import 'vitepress'

declare module 'vitepress/dist/client/theme-default/config' {
  export interface ThemeConfig {
    /** 文档站展示的站点版本（来自仓库根 VERSION） */
    siteVersion?: string
    /** Intrinsic screenshot dimensions used to reserve layout before image loading. */
    siteScreenshotSizes?: Record<string, { width: number; height: number }>
  }
}
