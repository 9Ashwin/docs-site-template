import { readFileSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { defineConfig, type DefaultTheme } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import './theme-config.d.ts'
import { repoVersionLabel } from './version'
import { readScreenshotSizes } from './screenshot-sizes.mjs'

const root = resolve(import.meta.dirname, '..')
/** 站点身份与导航都放在仓库根的 site.config.json，模板使用者只改这一个文件。 */
const siteConfig = JSON.parse(readFileSync(resolve(root, 'site.config.json'), 'utf-8')) as {
  name: string
  title: string
  titleTemplate: string
  description: string
  lang: string
  repositoryUrl: string
  sections: { dir: string; label: string; newestFirst?: boolean }[]
}
const require = createRequire(import.meta.url)

/** 当前安装能解析到该模块时返回 true。缺失的包不能写进 optimizeDeps.include。 */
function installedDep(id: string): boolean {
  try {
    require.resolve(id)
    return true
  } catch {
    return false
  }
}

const sections = siteConfig.sections

/** 侧边栏条目文字：取正文一级标题，去掉冗余前后缀 */
function itemText(dir: string, file: string): string {
  const raw = readFileSync(resolve(root, dir, file), 'utf-8')
  const heading = raw.match(/^#\s+(.+)$/m)?.[1] ?? file.replace(/\.md$/, '')
  return heading
    .replace(/^API 参考[:：]\s*/, '')
    .replace(/^API[:：]\s*/, '')
    .replace(/\s*[（(][^（()）]*[)）]\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/** 版本号按数字比较，v1.10.0 排在 v1.9.0 之后 */
function compareVersions(a: string, b: string): number {
  const parts = (f: string) => f.replace(/^v|\.md$/g, '').split('.').map(Number)
  const [x, y] = [parts(a), parts(b)]
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) - (y[i] ?? 0)
  }
  return 0
}

function itemsOf(dir: string, newestFirst = false): DefaultTheme.SidebarItem[] {
  const files = readdirSync(resolve(root, dir)).filter((f) => f.endsWith('.md'))
  return (newestFirst ? files.sort(compareVersions).reverse() : files.sort())
    .map((f) => ({
      text: itemText(dir, f),
      link: `/${dir}/${f.replace(/\.md$/, '')}`,
    }))
}

const sidebar: DefaultTheme.SidebarItem[] = sections.map((s) => ({
  text: s.label,
  collapsed: false,
  items: itemsOf(s.dir, s.newestFirst),
}))

/** 本地搜索默认按空白分词，中文整段会被当作一个词，这里退化为字粒度切分 */
function tokenize(text: string): string[] {
  const tokens: string[] = []
  for (const part of text.split(/[\s\n\r#%*,=/:;?[\]{}()&+\-!'"$·、，。：；？！（）【】《》…—]+/)) {
    if (!part) continue
    if (/[\u4e00-\u9fa5]/.test(part)) {
      tokens.push(part, ...part.split(''))
    } else {
      tokens.push(part)
    }
  }
  return tokens
}

const repo = siteConfig.repositoryUrl
/** 部署前缀：根路径为 ''，GitHub Pages 项目站点为 '/my-repo'（来自 SITE_BASE）。 */
const siteBase = (process.env.SITE_BASE ?? '').replace(/\/$/, '')

export default withMermaid(
  defineConfig({
    title: siteConfig.name,
    titleTemplate: siteConfig.titleTemplate,
    description: siteConfig.description,
    lang: siteConfig.lang,
    base: `${siteBase}/docs/`,
    cleanUrls: true,
    appearance: { storageKey: 'vitepress-theme-appearance' },
    lastUpdated: true,
    srcExclude: ['README.md', 'MIGRATION.md', 'homepage/**', 'shared/**', 'scripts/**', 'deploy/**', 'static-site/**', 'releases/**'],
    metaChunk: true,
    transformPageData(pageData) {
      // 共享顶栏替代默认文档导航栏
      pageData.frontmatter.navbar = false
    },

    head: [
      ['link', { rel: 'icon', href: `${siteBase}/docs/logo.svg`, type: 'image/svg+xml' }],
      ['meta', { name: 'theme-color', content: '#101f38' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: siteConfig.title }],
      [
        'meta',
        {
          property: 'og:description',
          content: siteConfig.description,
        },
      ],
    ],

    markdown: {
      theme: { light: 'github-light', dark: 'github-dark' },
      lineNumbers: false,
      toc: { level: [2, 3] },
      config(md) {
        // 表格外面包一层滚动容器。默认主题把 <table> 本身设成 display:block 来做
        // 横向滚动，副作用是表格按内容收缩——列少的表比正文列窄一截，页面里宽窄不一。
        // 把滚动交给包裹层后，表格可以恢复 display:table + width:100%，统一撑满正文列。
        md.renderer.rules.table_open = () => '<div class="mh-table">\n<table>\n'
        md.renderer.rules.table_close = () => '</table>\n</div>\n'

        // 行内代码里常有 {{key}} 这类提示词占位符。VitePress 把渲染结果当作 Vue
        // 模板编译，{{...}} 会被当成插值表达式（求值成空串或直接报错）。用 v-pre
        // 包住含花括号的行内代码，让它按字面渲染。
        const renderCodeInline = md.renderer.rules.code_inline
        md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
          const html = renderCodeInline
            ? renderCodeInline(tokens, idx, options, env, self)
            : `<code${self.renderAttrs(tokens[idx])}>${md.utils.escapeHtml(tokens[idx].content)}</code>`
          return /[{}]/.test(tokens[idx].content) ? `<span v-pre>${html}</span>` : html
        }
      },
    },

    themeConfig: {
      logoLink: { link: `${siteBase}/`, target: '_self' },
      siteTitle: siteConfig.name,

      nav: [],

      siteVersion: repoVersionLabel,
      siteScreenshotSizes: readScreenshotSizes(resolve(root, 'public/screenshots')),

      sidebar,

      socialLinks: [{ icon: 'github', link: repo }],

      outline: { level: [2, 3], label: '本页目录' },

      docFooter: { prev: '上一篇', next: '下一篇' },
      returnToTopLabel: '回到顶部',
      sidebarMenuLabel: '目录',
      darkModeSwitchLabel: '外观',
      lightModeSwitchTitle: '切换到浅色',
      darkModeSwitchTitle: '切换到深色',

      lastUpdated: {
        text: '最后更新',
        formatOptions: { dateStyle: 'medium', timeStyle: undefined },
      },

      editLink: {
        pattern: `${repo}/edit/main/website-docs/:path`,
        text: '在 GitHub 上编辑此页',
      },

      search: {
        provider: 'local',
        options: {
          translations: {
            button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
            modal: {
              displayDetails: '展开详情',
              resetButtonTitle: '清除',
              backButtonTitle: '返回',
              noResultsText: '没有找到结果',
              footer: {
                selectText: '选择',
                navigateText: '切换',
                closeText: '关闭',
              },
            },
          },
          miniSearch: {
            options: { tokenize },
            searchOptions: {
              fuzzy: 0.2,
              prefix: true,
              boost: { title: 4, text: 2, titles: 1 },
            },
          },
        },
      },

      footer: {
        message: `基于 ${siteConfig.name} ${repoVersionLabel} 源码整理`,
        copyright: `© ${new Date().getFullYear()} ${siteConfig.name}`,
      },
    },

    // mermaid >= 11.17 会动态 import UMD 包 fastdom。Vite 启动时扫不到这次导入，
    // 浏览器直接加载原始 fastdom.js，报 does not provide an export named 'default'
    //（vitepress-plugin-mermaid#98）。只在能解析到这两个包时才预构建：lockfile 里的
    // mermaid 11.16.0 没有 fastdom，无条件 include 会报 Failed to resolve dependency。
    vite: {
      optimizeDeps: {
        include: ['fastdom', 'fastdom/extensions/fastdom-promised.js'].filter(installedDep),
      },
    },

    mermaid: {
      theme: 'base',
      fontFamily:
        '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", ui-sans-serif, sans-serif',
      themeVariables: {
        primaryColor: '#eef1f6',
        primaryTextColor: '#101f38',
        primaryBorderColor: '#9aa8bd',
        lineColor: '#7d8ba1',
        secondaryColor: '#faf7ef',
        tertiaryColor: '#f6f7f9',
        fontSize: '14px',
      },
    },
  }),
)
