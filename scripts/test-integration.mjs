// 统一站点的端到端检查：官网与文档共用顶栏、主题、搜索和路由。
// 需要本机安装 Google Chrome，并先启动 `npm run preview`（默认 127.0.0.1:3000）。
// 可用 SITE_TEST_URL 指定其它已构建站点。
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteConfig = JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '..', 'site.config.json'), 'utf8'));

const origin = process.env.SITE_TEST_URL || 'http://127.0.0.1:3000';
// 与构建时一致：根路径部署为空，GitHub Pages 项目站点为 '/my-repo'。
const siteBase = (process.env.SITE_BASE ?? '').replace(/\/$/, '');
const at = (path) => `${origin}${siteBase}${path}`;
const key = 'vitepress-theme-appearance';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ colorScheme: 'light', viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];
context.on('page', p => p.on('pageerror', error => errors.push(error.message)));
page.on('pageerror', error => errors.push(error.message));

const expectTheme = (p, dark) =>
  p.waitForFunction(expected => document.documentElement.classList.contains('dark') === expected, dark);

async function expectHomepage(p = page) {
  await p.waitForSelector('#hero-title');
  assert.equal(new URL(p.url()).pathname, `${siteBase}/`);
}

async function checkVisibleControl(p, selector) {
  await p.waitForFunction(selector => {
    const box = document.querySelector(selector)?.getBoundingClientRect();
    return box && box.width > 0 && box.x >= 0 && box.right <= innerWidth + 1;
  }, selector);
  const box = await p.locator(selector).boundingBox();
  assert.ok(box && box.width > 0 && box.x >= 0 && box.x + box.width <= p.viewportSize().width + 1, `${selector} must fit in the viewport`);
}

async function headerGeometry(p) {
  return p.locator('.mh-header').evaluate(header => ({
    links: [...header.querySelectorAll('#main-navigation a')].map(a => a.textContent.trim()),
    controls: [...header.querySelectorAll('.mh-header-inner, .mh-brand, .mh-theme-toggle, .mh-header-github')].map(el => {
      const box = el.getBoundingClientRect();
      return [Math.round(box.x), Math.round(box.y), Math.round(box.width), Math.round(box.height)];
    }),
  }));
}

async function currentSidebarLinkVisible(p) {
  await p.waitForFunction(() => {
    const sidebar = document.querySelector('.VPSidebar');
    const active = sidebar?.querySelector('.VPSidebarItem.is-active > .item > a');
    if (!active) return false;
    const bounds = sidebar.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    return item.height > 0 && item.top >= bounds.top && item.bottom <= bounds.bottom;
  });
}

try {
  // 官网首屏与默认主题
  assert.equal((await page.goto(at('/'))).status(), 200);
  await expectTheme(page, false);
  const masthead = await headerGeometry(page);

  // 主题切换写入本地存储，刷新后保持
  await page.getByRole('switch', { name: '切换到深色' }).click();
  await expectTheme(page, true);
  assert.equal(await page.evaluate(k => localStorage.getItem(k), key), 'dark');
  await page.reload();
  await expectTheme(page, true);

  // 顶栏进入文档：默认落到 site.config.json 的入口页
  await page.locator('#main-navigation').getByRole('link', { name: '文档', exact: true }).click();
  await page.waitForSelector('.VPDoc h1');
  await expectTheme(page, true);
  assert.equal(new URL(page.url()).pathname, `${siteBase}/docs/${siteConfig.docsEntry}.html`);
  assert.ok((await page.locator('.VPDoc h1').innerText()).trim().length > 0);

  // 官网与文档顶栏完全一致（布局与链接）
  assert.deepEqual((await headerGeometry(page)).controls, masthead.controls);
  assert.deepEqual((await headerGeometry(page)).links, [...siteConfig.sections.map(section => section.label), 'GitHub']);
  assert.equal(await page.locator('.mh-header').evaluate(el => el.getBoundingClientRect().height), 64);
  assert.equal(context.pages().length, 1);

  // 跨分类切换时侧栏同步到当前项，且不滚动正文
  for (const section of [siteConfig.sections[4].label, siteConfig.sections[5].label, siteConfig.sections[0].label, siteConfig.sections[2].label, siteConfig.sections[1].label]) {
    await page.locator('#main-navigation').getByRole('link', { name: section, exact: true }).click();
    await page.waitForFunction(section => document.querySelector('#main-navigation a[aria-current="page"]')?.textContent.trim() === section, section);
    await currentSidebarLinkVisible(page);
    assert.ok(await page.evaluate(() => window.scrollY < 2), 'Sidebar synchronization must not scroll the document');
  }

  // 手动滚动侧栏后切换主题不应重置滚动位置（页面少时侧栏可能不可滚动，跳过）
  const sidebarScroll = await page.locator('.VPSidebar').evaluate(el => {
    const scrollable = el.scrollHeight > el.clientHeight + 40;
    el.scrollTop = el.scrollHeight;
    return { scrollable, scrollTop: el.scrollTop };
  });
  await page.locator('.mh-theme-toggle').click();
  if (sidebarScroll.scrollable) {
    assert.ok(await page.locator('.VPSidebar').evaluate(el => el.scrollTop > 0), 'Theme toggle must not reset sidebar scroll');
  }

  // 文档内搜索（中文分词）
  await page.locator('.mh-header-search button').click();
  await page.locator('#localsearch-input').fill('文档');
  await page.waitForSelector('.VPLocalSearchBox .result');
  await page.keyboard.press('Escape');

  // 品牌区返回官网，保持同标签
  await page.locator('.mh-header .mh-brand').click();
  await expectHomepage();
  assert.equal(context.pages().length, 1);

  // 深浅色偏好在官网与文档之间双向同步
  const docs = await context.newPage();
  await docs.goto(at(`/docs/${siteConfig.docsEntry}.html`));
  await docs.waitForSelector('.VPDoc h1');
  await expectTheme(docs, false);
  await docs.locator('.mh-theme-toggle').click();
  await expectTheme(docs, true);
  await expectTheme(page, true);
  await page.getByRole('switch', { name: '切换到浅色' }).click();
  await expectTheme(page, false);
  await expectTheme(docs, false);
  await docs.close();

  // 未显式选择时跟随系统偏好
  const automatic = await browser.newContext({ colorScheme: 'dark' });
  const autoPage = await automatic.newPage();
  await autoPage.goto(at('/'));
  await expectTheme(autoPage, true);
  await autoPage.emulateMedia({ colorScheme: 'light' });
  await expectTheme(autoPage, false);
  await autoPage.goto(at('/docs/'));
  await autoPage.waitForSelector('.VPDoc h1');
  await expectTheme(autoPage, false);
  await automatic.close();

  // 窄屏：控件不溢出，抽屉导航可用
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(at('/'));
  await checkVisibleControl(page, '.mh-header button[role="switch"]');
  await page.getByRole('button', { name: '打开导航' }).click();
  await page.locator('#main-navigation').getByRole('link', { name: '文档', exact: true }).click();
  await page.waitForSelector('.VPDoc h1');
  await checkVisibleControl(page, '.mh-header .mh-brand');
  await page.getByRole('button', { name: '打开导航' }).click();
  await checkVisibleControl(page, '.mh-header-search button');
  await page.keyboard.press('Escape');
  await page.locator('.VPLocalNav button.menu').click();
  await checkVisibleControl(page, '.VPSidebar.open');
  await page.keyboard.press('Escape');

  // 深链直达后侧栏要能定位到当前条目
  await page.goto(at(`/docs/${siteConfig.sections[4].dir}/${siteConfig.sections[4].entry}.html`));
  await page.locator('.VPLocalNav button.menu').click();
  await currentSidebarLinkVisible(page);
  await page.keyboard.press('Escape');

  // 文档路由必须独立：缺失页面不能回退到官网
  for (const path of siteConfig.requiredRoutes) {
    const response = await context.request.get(at(path));
    assert.equal(response.status(), 200, path);
    assert.ok(!(await response.text()).includes('id="hero-title"'), 'A missing docs route must not fall back to the homepage');
  }
  assert.equal((await context.request.get(at('/docs/this-page-does-not-exist'))).status(), 404);
  assert.equal((await context.request.get(at('/not-found'))).status(), 404);

  // 各宽度下顶栏铺满且 Logo 尺寸稳定
  for (const width of [320, 801, 1024, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/docs/01-getting-started/02-installation.html']) {
      await page.goto(at(path));
      await page.waitForSelector('.mh-header');
      const dimensions = await page.locator('.mh-header').evaluate(el => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height, scrollWidth: el.scrollWidth }));
      assert.equal(dimensions.height, 64);
      assert.equal(dimensions.width, width);
      assert.equal(dimensions.scrollWidth, width);
      await checkVisibleControl(page, '.mh-header .mh-brand');
      await checkVisibleControl(page, '.mh-header .mh-theme-toggle');
    }
  }

  assert.deepEqual(errors, []);
  console.log('Integration checks passed: shared masthead, theme sync and system preference, header search, sidebar synchronization, mobile drawer, deep links, docs 404, responsive masthead.');
} finally {
  await browser.close();
}
