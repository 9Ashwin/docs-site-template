# AGENTS.md — 文档站模板维护指南

本文件面向用 AI 维护本模板（或由本模板生成的站点）的 Agent：说明结构、可配置项、写作约定与常见坑。**用户的任务是写文档时，读第 3 节即可；改造模板本身时，读第 2、4 节。**

## 1. 站点结构 {#layout}

```text
site.config.json          # 站点身份、分类导航、入口页、必须存在的路由
homepage/                 # Next.js 官网（静态导出）
  app/content.ts          #   首页全部文案与卡片（唯一需要改的首页文件）
  app/site.ts             #   部署前缀与资源路径（一般不动）
  app/page.tsx            #   首页区块结构（一般不动）
0*/*.md                   # 文档正文：目录 = 侧边栏分组，文件名序号 = 顺序
.vitepress/config.mts     # 文档站配置：标题/描述/侧边栏/搜索分词/Mermaid
.vitepress/theme/         # 顶栏、截图组件、主题样式
shared/brand.css          # 品牌变量（--mh-*）：颜色、字体
shared/header.ts          # 官网导航与图标（文档站顶栏也用图标）
scripts/                  # 构建、检查、预览、打包、发布、集成测试
deploy/、Dockerfile       # Nginx 与容器部署
```

部署前缀由 `SITE_BASE` 环境变量控制：为空表示根路径部署，`/my-repo` 表示 GitHub Pages 项目站点（链接自动加前缀）。根路径与子路径两种模式都必须能用。

## 2. 可配置项（改这些，不要改散落的硬编码） {#config}

| 要改什么 | 改哪里 |
| --- | --- |
| 站点名称、标题、描述、语言 | `site.config.json` 的 `name` / `title` / `titleTemplate` / `description` / `lang` |
| 仓库地址（顶栏 GitHub、页脚） | `site.config.json` 的 `repositoryUrl` |
| 文档分类与顺序、每类入口页 | `site.config.json` 的 `sections[]`（`dir` / `label` / `entry` / `newestFirst`） |
| 文档首页跳转目标 | `site.config.json` 的 `docsEntry` |
| 最新版本页 | `site.config.json` 的 `releasesEntry` + `VERSION` |
| 构建必须存在的路由 | `site.config.json` 的 `requiredRoutes` |
| 品牌色、纸张色、字体 | `shared/brand.css`（深浅色各一组变量） |
| 首页 hero、卡片、截图轮播、部署块、页脚 | `homepage/app/content.ts` |
| 顶栏导航（官网） | `shared/header.ts` 的 `siteNavigation` |
| 文档站分类导航 | 自动来自 `site.config.json` 的 `sections`（`SiteHeader.vue` 读取） |
| Logo / favicon | `public/logo.svg`、`public/favicon.ico`；官网复用同一份 |

改完必须验证：`npm run check`（根路径）与 `SITE_BASE=/任意前缀 npm run build`（子路径）。

## 3. 写文档的工作流 {#writing-workflow}

1. 在对应分类目录新建 `NN-文件名.md`，第一行写 `# 标题`（侧边栏文字取自此标题）。
2. 骨架：开头 1-3 段 → 4-8 个 `##` → 至少一张表格 → 流程页加 Mermaid → 结尾「相关文档」。
3. 关键 `##` 手写锚点 `{#anchor}`；站内链接用相对 `.md` 路径。
4. 截图放 `public/screenshots/`，用 `<Screenshot src caption hint />` 引用；图片必须是真实 PNG。
5. 自检：`npm run check:docs`；涉及导航/主题时再 `npm run build` + `npm run preview` + `npm run test:integration`。
6. 新版本：复制 `07-releases/` 下最新页改名，更新 `VERSION`，必要时改 `releasesEntry`。

语法与示例见模板内的「写作指南」页（`01-getting-started/02-writing-guide.md`）。

## 4. 改造模板时的约定 {#template-rules}

- **单一事实源**：站点身份只放 `site.config.json`，首页文案只放 `homepage/app/content.ts`，颜色只放 `shared/brand.css`。不要把这些值硬编码进 `page.tsx`、`config.mts` 或组件里。
- **`shared/header.ts` 不能引用 `process.env`**：文档主题是 Vite 构建，浏览器里没有 `process`。部署前缀只走 `.vitepress` 的 `SITE_BASE` 与 `homepage/app/site.ts` 的 `NEXT_PUBLIC_SITE_BASE`。
- **路径必须带部署前缀**：官网里的站内链接用 `siteHref()` / `doc()` 生成；文档主题里用 `site.value.base` 拼。写死 `/docs/...` 会让子路径部署 404。
- **行内双花括号**：`.vitepress/config.mts` 的 `code_inline` 规则会给含 `{}` 的行内代码包 `<span v-pre>`；正文里不要裸写 `{{`。
- **构建产物不入库**：`static-site/`、`releases/`、`.vitepress/dist`、`homepage/out`、`homepage/.next` 已在 `.gitignore` 中。
- **检查脚本是门禁**：`check-links`（死链）、`check-mermaid`（语法）、`check-site`（资源前缀、锚点、截图尺寸、官网 logo 回首页）。任何一个失败都不应合并。
- **新增分类目录**：改 `site.config.json` 的 `sections`（含 `entry`），并同步 `requiredRoutes`。

## 5. 常见坑 {#pitfalls}

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 构建报 `Invalid PNG screenshot` | 图片是 JPEG 改了扩展名 | 用图像工具转成真 PNG |
| 构建报 `Attribute name cannot contain U+0022` | `<Screenshot hint="...">` 属性值里嵌了双引号 | 改用「」或单引号 |
| 页面里出现空文本或报插值错误 | 正文裸写了 `{{...}}` | 放进行内代码或加 `<span v-pre>` |
| 子路径部署后资源 404 | 某处写死了 `/docs/...` | 改用 `siteHref()` / `withBase` / `site.value.base` |
| 侧边栏缺页面 | 文件名不以 `.md` 结尾，或在被排除目录 | 放到 `0*` 分类目录下 |
| `test:integration` 找不到元素 | 页面数量少时侧栏不可滚动、或导航标签改了 | 同步更新 `scripts/test-integration.mjs` 里的断言 |
| 搜索搜不到中文 | 分词退化为空白切分 | 已在 `config.mts` 的 `tokenize` 中按字粒度处理，不要删 |

## 6. 命令速查 {#commands}

```bash
npm run setup                  # 安装依赖
npm run dev:docs               # 文档热更新
npm run build                  # 完整构建 + 校验
SITE_BASE=/repo npm run build  # 子路径构建
npm run check                  # 链接 + Mermaid + 产物
npm run preview                # 预览产物
npm run test:integration       # 端到端（需 Chrome）
npm run package:site           # 打包发布物
```
