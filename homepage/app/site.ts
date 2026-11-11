/** 站点部署前缀：根路径部署为 ''，GitHub Pages 项目站点为 '/repo'。 */
export const siteBase = (process.env.NEXT_PUBLIC_SITE_BASE ?? "").replace(/\/$/, "");

/** 官网静态资源（Next 产物 after build-site.mjs）所在目录。 */
export const homeAssets = `${siteBase}/docs/_home`;

/** 把根相对链接（'/docs/'、'/#capabilities'）展开到实际部署前缀下。 */
export function siteHref(href: string): string {
  return siteBase && href.startsWith("/") ? `${siteBase}${href}` : href;
}
