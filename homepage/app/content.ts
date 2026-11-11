// 官网首页的全部文案与链接集中在这里：改这一个文件就能定制首页。
// 站点名称、描述、仓库地址在仓库根 site.config.json。
import siteConfig from "../../site.config.json";
import { siteHref } from "./site";

const docsRoot = `${siteHref("/docs")}/`;

/** 文档页链接（cleanUrls，不带 .html）。 */
export const doc = (path: string) => `${docsRoot}${path}`;

export const hero = {
  eyebrow: "OPEN SOURCE · YOUR PRODUCT",
  title: ["给项目写一份", "读得下去的文档"],
  description:
    "官网 + 文档站一次构建、一份产物：VitePress 写文档，Next.js 写首页，共用顶栏、品牌变量、深浅色与中文搜索。开箱即可部署到 GitHub Pages、Docker 或 Nginx。",
  primary: { label: "阅读文档", href: doc(siteConfig.docsEntry) },
  secondary: { label: "查看模板说明", href: doc("01-getting-started/02-writing-guide") },
  note: "改 site.config.json 与 homepage/app/content.ts 即可换掉站点身份与首页文案",
  heroImage: { alt: "首页主视觉占位图，替换为产品界面截图", caption: "产品主视觉：替换为真实界面截图" },
};

/** 首页 hero 下方的一行要点。 */
export const trustItems = [
  { icon: "workspace", label: "一次构建" },
  { icon: "clock", label: "子路径可部署" },
  { icon: "channels", label: "中文搜索" },
  { icon: "shield", label: "深浅色" },
];

/** 01 · 产品能力：3 列卡片。href 指向文档页；没有文档页时填外部链接。 */
export const capabilities = [
  {
    index: "01",
    icon: "workspace",
    title: "结构化文档",
    description: "按「快速开始 / 架构 / 功能 / API / 客户端 / 开发 / 版本」分类，侧边栏由目录自动生成，写完即出现在导航里。",
    tags: ["目录即导航", "自动侧边栏", "中文分词搜索"],
    href: doc("01-getting-started/01-introduction"),
  },
  {
    index: "02",
    icon: "search",
    title: "写作约束可验证",
    description: "构建前先跑链接与 Mermaid 检查，构建后再校验资源路径、锚点与截图尺寸，死链不会进产物。",
    tags: ["死链拦截", "Mermaid 语法", "锚点校验"],
    href: doc("01-getting-started/02-writing-guide"),
  },
  {
    index: "03",
    icon: "shield",
    title: "一套品牌，两端共用",
    description: "官网与文档共用 CSS 变量、顶栏组件与深浅色偏好；换主色只改 shared/brand.css 里的几个变量。",
    tags: ["共享顶栏", "深浅色", "响应式"],
    href: doc("06-development/01-dev-guide"),
  },
];

/** 02 · 截图轮播：图片放在 homepage/public/docs/_home/product/ 下。 */
export const gallerySlides = [
  {
    name: "总览",
    icon: "workspace",
    title: "按产品本身组织截图",
    description: "左侧列表切换截图，右侧展示界面。图片来自 homepage/public/docs/_home/product/，与文档站共用同一套素材。",
    image: "hero",
    alt: "产品总览截图占位",
    href: doc("01-getting-started/01-introduction"),
  },
  {
    name: "细节",
    icon: "search",
    title: "文档里的截图组件",
    description: "文档页用 <Screenshot> 组件引用 public/screenshots/ 下的图片，构建时按真实尺寸预留版面，缺图显示占位而不是破版。",
    image: "detail",
    alt: "细节截图占位",
    href: doc("01-getting-started/02-writing-guide"),
  },
  {
    name: "流程",
    icon: "history",
    title: "流程图与代码块",
    description: "Mermaid 图与代码块按主题配色渲染，Mermaid 语法在构建前统一校验。",
    image: "workflow",
    alt: "流程截图占位",
    href: doc("02-architecture/01-overview"),
  },
];

/** 03 · 站点能力列表（两列说明 + 右侧清单）。 */
export const highlights = [
  {
    title: "文档站",
    description: "VitePress 静态构建：分类侧边栏、本地中文搜索、目录页、上一页/下一页、最后更新时间。",
    link: { label: "打开文档", href: docsRoot },
  },
  {
    title: "官网首页",
    description: "Next.js App Router 静态导出：区块式首页、截图轮播、深浅色切换、移动端抽屉导航。",
    link: { label: "查看首页源码", href: `${siteConfig.repositoryUrl}/tree/main/homepage` },
  },
];

export const highlightList = [
  { label: "构建产物", value: "static-site/（index.html + 404.html + docs/）" },
  { label: "部署前缀", value: "SITE_BASE=/repo 时自动适配子路径" },
  { label: "质量门禁", value: "check:links · check:mermaid · check-site" },
  { label: "部署方式", value: "GitHub Pages · Docker · Nginx" },
];

/** 04 · 部署/自托管区块。 */
export const install = {
  title: "一条命令构建，三种方式发布",
  description: "构建脚本会先编译官网、检查文档、编译文档，再合并校验；通过后才更新 static-site/。",
  command: "npm run setup && npm run build && npm run preview",
  facts: [
    { label: "GitHub Pages", value: "推送 main，Actions 自动构建并发布" },
    { label: "Docker", value: "docker build -t my-docs-site website-docs" },
    { label: "Nginx", value: "把 static-site/ 作为站点根目录" },
  ],
  links: [
    { label: "部署说明", href: `${siteConfig.repositoryUrl}/blob/main/README.md` },
    { label: "维护指南", href: `${siteConfig.repositoryUrl}/blob/main/AGENTS.md` },
  ],
};

/** 05 · 文档入口卡片。 */
export const docCards = [
  { icon: "workspace", title: "快速开始", text: "从零跑起模板：安装、构建、预览与发布。", href: doc("01-getting-started/01-introduction") },
  { icon: "search", title: "写作指南", text: "页面结构、锚点、截图、Mermaid 与自检命令。", href: doc("01-getting-started/02-writing-guide") },
  { icon: "channels", title: "开发指南", text: "构建脚本、主题、检查脚本与目录约定。", href: doc("06-development/01-dev-guide") },
  { icon: "history", title: "版本说明", text: "每版一页，侧边栏按版本号倒序。", href: doc(siteConfig.releasesEntry) },
];

export const footer = {
  tagline: siteConfig.description,
  nav: [
    { label: "文档", href: docsRoot },
    { label: "GitHub", href: siteConfig.repositoryUrl },
    { label: "版本", href: doc(siteConfig.releasesEntry) },
  ],
  meta: `© ${new Date().getFullYear()} ${siteConfig.name}`,
};
