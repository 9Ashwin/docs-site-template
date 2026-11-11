# 项目文档站模板

一套开箱即用的 **官网 + 文档站** 模板：VitePress 写文档、Next.js 写首页，共用顶栏、品牌样式、深浅色与中文搜索；一次构建输出一份静态产物，可部署到 GitHub Pages（含子路径）、Docker 或 Nginx。

示例站点：<https://9ashwin.github.io/docs-site-template/>

## 用它起一个新站 {#quickstart}

1. 在 GitHub 上点 **Use this template** 创建自己的仓库（或复制目录）。
2. 改 `site.config.json`：站点名称、描述、仓库地址、分类与每类入口页。
3. 改 `shared/brand.css` 的主色（默认是墨蓝 + 纸白 + 鎏金的书籍感配色，字体与强调色都在这里的 `--mh-*` 变量），替换 `public/logo.svg`、`public/favicon.ico`。
4. 改 `homepage/app/content.ts` 的首页文案（这是首页唯一需要改的文件）。
5. 删掉 `01-getting-started` 到 `07-releases` 里的示例页，换成自己的文档。
6. 把 `public/screenshots/`、`homepage/public/docs/_home/product/` 里的占位图换成真实截图。
7. 更新 `VERSION` 与 `07-releases/`。

```bash
npm run setup      # 安装根目录 + homepage 依赖
npm run dev:docs   # 文档站热更新
npm run build      # 构建并校验，产物在 static-site/
npm run preview    # 本地预览 static-site/
```

## 包含什么 {#includes}

| 部分 | 技术 | 说明 |
| --- | --- | --- |
| 文档站 | VitePress | 分类侧边栏、本地中文搜索、目录页、Mermaid、深浅色 |
| 官网首页 | Next.js App Router（静态导出） | 区块式首页、截图轮播、响应式、移动端抽屉 |
| 主题 | CSS 变量 + 共享顶栏 | 品牌色、排版、代码块、表格滚动容器 |
| 构建 | Node.js 脚本 | 合并两个应用、校验链接/锚点/资源，输出 `static-site/` |
| 检查 | Node.js + Playwright | 死链、Mermaid 语法、产物断言、端到端交互 |
| 部署 | GitHub Actions + Nginx + Docker | Pages、静态文件、容器 |

## 目录结构 {#layout}

```text
.
├── site.config.json        # 站点身份与导航（先改这里）
├── 01-getting-started/     # 文档分类：一个目录 = 一个侧边栏分组
├── 02-architecture/
├── 03-features/
├── 04-api/
├── 05-clients/
├── 06-development/
├── 07-releases/            # 每版一页，侧边栏按版本号倒序
├── homepage/               # Next.js 官网（文案在 app/content.ts）
├── .vitepress/             # 文档站配置与主题
├── shared/                 # 品牌变量、顶栏图标
├── public/                 # logo、favicon、screenshots/
├── scripts/                # 构建、检查、预览、打包、发布、集成测试
├── deploy/、Dockerfile     # Nginx 与容器部署
└── .github/workflows/      # Pages 发布 + CI 检查
```

## 常用命令 {#commands}

| 命令 | 作用 |
| --- | --- |
| `npm run setup` | 按两份锁文件安装依赖 |
| `npm run dev:docs` / `dev:homepage` | 分别热更新文档站 / 官网 |
| `npm run build` | 官网 + 文档 + 合并校验 → `static-site/` |
| `npm run preview` | 本地预览 `static-site/`（默认 3000 端口） |
| `npm run check` | 链接 + Mermaid + 产物校验 |
| `npm run check:docs` | 只跑链接与 Mermaid（改文档后最常用） |
| `npm run test:integration` | 端到端检查（需本机 Chrome + 已启动 preview） |
| `npm run package:site` | 打包 `static-site/` → `releases/` |
| `npm run test:docker` | 构建镜像后校验路由、压缩、响应头 |

## 部署 {#deploy}

### GitHub Pages

仓库自带 `.github/workflows/deploy-pages.yml`：推送 `main` 后自动构建并发布。

- 仓库 Settings → Pages → Source 选 **GitHub Actions**。
- 若 `github-pages` 环境有分支保护规则，允许 `main` 部署。
- 部署前缀自动推导：项目仓库为 `/<repo>/`（构建时 `SITE_BASE=/<repo>`），`*.github.io` 仓库为根路径。
- 本地验证子路径构建：

  ```bash
  SITE_BASE=/<repo> npm run build
  SITE_BASE=/<repo> npm run preview
  SITE_BASE=/<repo> npm run test:integration
  ```

### 静态文件 + Nginx

```bash
npm run build                 # 产物在 static-site/
tar -czf site.tar.gz -C static-site .
# 上传解压到服务器目录，把 Nginx 的 root 指过去（模板见 deploy/nginx.conf）
```

`deploy/nginx.conf` 已包含文档的 `.html` 路由解析、gzip 与安全响应头。

### Docker

```bash
docker build -t my-docs-site .          # 在仓库根目录
docker run -d --name my-docs -p 8080:80 my-docs-site
```

镜像用 Node 24 构建、Nginx 托管静态产物，容器内端口可用 `WEBSITE_NGINX_PORT` 覆盖。

## 维护与二次开发 {#maintenance}

- 写作约定、语法示例、自检命令见文档站里的「写作指南」。
- 需要 AI 辅助维护时，把仓库根的 `AGENTS.md` 交给它：里面有事实来源、页面映射与易错点。
- 站点身份只有 `site.config.json` 一处；首页文案只有 `homepage/app/content.ts` 一处；颜色只有 `shared/brand.css` 一处。

## 版权 {#license}

模板本身可自由用于自己的项目；模板里的占位图（`public/screenshots/*`、`homepage/public/docs/_home/product/*`）由脚本生成，随手替换即可。
