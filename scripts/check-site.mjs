import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveSiteFile } from './site-files.mjs';
const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(process.argv[2] || resolve(project, 'static-site'));
// 部署前缀：根路径部署为空，GitHub Pages 项目站点为 '/my-repo'。
// 页面里的绝对链接带上该前缀，校验时先剥掉它再映射回产物文件。
const siteBase = (process.env.SITE_BASE ?? '').replace(/\/$/, '');
const stripped = (pathname) => (siteBase && pathname.startsWith(siteBase + '/') ? pathname.slice(siteBase.length) : pathname);
const isSiteRoot = (pathname) => pathname === `${siteBase}/` || pathname === '/';
async function walk(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(path));
    else if (entry.name.endsWith('.html')) result.push(path);
  }
  return result;
}
for (const retired of ['/docs/README.html', '/docs/MIGRATION.html', '/docs/homepage/README.html', '/docs/static-site/', '/docs/releases/']) {
  assert.equal(await resolveSiteFile(root, retired), null, `Retired demo must not be published: ${retired}`);
}
const failures = [];
for (const entry of await readdir(root)) {
  if (!['index.html', '404.html', 'docs'].includes(entry)) failures.push(`/${entry}: only index.html, 404.html and docs/ may sit at the site root`);
}
// Missing screenshots may use labelled placeholders; existing images must
// reserve their intrinsic dimensions before loading to keep anchors stable.
const pendingShots = new Set();
const checked = new Map();
const targetIds = new Map();
const pages = await walk(root);
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const route = '/' + relative(root, file).replaceAll('\\', '/');
  const base = new URL(route, 'https://docs.test');
  for (const match of html.matchAll(/<(?:a|link|img|script|source|video)\b[^>]*>/g)) {
    const tag = match[0];
    for (const [, raw] of tag.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
      const url = new URL(raw.replaceAll('&amp;', '&'), base);
      if (url.origin !== base.origin) continue;
      // The upstream router forwards only the site root and its docs prefix.
      const local = stripped(url.pathname);
      if (!isSiteRoot(url.pathname) && url.pathname !== base.pathname && !local.startsWith('/docs/')) failures.push(`${route}: ${url.pathname} is outside the site root and docs prefix`);
      if (!checked.has(local)) checked.set(local, !!await resolveSiteFile(root, local));
      if (!checked.get(local)) {
        if (/class="mh-shot-img"/.test(tag) && local.startsWith('/docs/screenshots/')) pendingShots.add(local);
        else failures.push(`${route}: missing ${url.pathname}`);
      }
      if (tag.startsWith('<img') && /class="mh-shot-img"/.test(tag)) {
        if (!/\bwidth="[1-9]\d*"/.test(tag) || !/\bheight="[1-9]\d*"/.test(tag) || /display:\s*none/.test(tag)) {
          failures.push(`${route}: screenshot ${url.pathname} must reserve its intrinsic size before loading`);
        }
      }
      if (tag.startsWith('<a') && url.hash && checked.get(local)) {
        const target = (await resolveSiteFile(root, local))?.path;
        if (target?.endsWith('.html')) {
          if (!targetIds.has(target)) {
            const content = await readFile(target, 'utf8');
            targetIds.set(target, new Set([...content.matchAll(/\bid="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&'))));
          }
          if (!targetIds.get(target).has(decodeURIComponent(url.hash.slice(1)))) failures.push(`${route}: missing anchor ${url.pathname}${url.hash}`);
        }
      }
      if (isSiteRoot(url.pathname) && tag.startsWith('<a') && /target="_blank"/.test(tag)) failures.push(`${route}: homepage link opens a new tab`);
    }
  }
  if (route.startsWith('/docs/') && !route.endsWith('/404.html') && !/class="mh-brand"[^>]*href="[^"]*"[^>]*target="_self"/.test(html)) failures.push(`${route}: documentation logo must navigate to the main site`);
}
// 必须存在的路由来自 site.config.json，换项目时改配置即可。
const siteConfig = JSON.parse(await readFile(resolve(project, 'site.config.json'), 'utf8'));
for (const path of siteConfig.requiredRoutes) assert.ok(await resolveSiteFile(root, path), path);
assert.equal(failures.length, 0, [...new Set(failures)].join('\n'));
if (pendingShots.size) console.warn(`Screenshots still pending (placeholder shown): ${[...pendingShots].sort().join(', ')}`);
console.log(`Unified site check passed: ${pages.length} pages, ${checked.size} local routes/assets, fragment targets, screenshot dimensions, same-tab homepage links and documentation logos.`);
