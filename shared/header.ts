// 共享的顶栏数据：官网与文档站都用这一份。
// 站点身份（名称、仓库地址、版本）在仓库根 site.config.json。
import siteConfig from '../site.config.json';

export type SiteNavChild = {
  label: string;
  href: string;
};

export type SiteNavItem = {
  label: string;
  href: string;
  badge?: string;
  external?: boolean;
  children?: SiteNavChild[];
};

/** 官网顶栏导航；文档站用的是 .vitepress/theme/SiteHeader.vue 里的分类导航。 */
export const siteNavigation: SiteNavItem[] = [
  { label: '产品能力', href: '/#capabilities', badge: '' },
  { label: '产品截图', href: '/#screenshots', badge: '' },
  { label: '文档', href: '/docs/', badge: '' },
  { label: '版本', href: `/docs/${siteConfig.releasesEntry}`, badge: '' },
];

export const repositoryUrl = siteConfig.repositoryUrl;

export const headerIcons: Record<string, string> = {
  sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
  moon: 'M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm5 5 14 14M5 19 19 5',
  external: 'M8 5H5v14h14v-3M12 5h7v7M10 14 19 5',
  chevron: 'm6 9 6 6 6-6',
  github: 'M9 19c-4.3 1.3-4.3-2.2-6-2.7m12 5v-3.5c0-1 .1-1.4-.5-2 3.4-.4 7-1.7 7-7.5a5.7 5.7 0 0 0-1.5-4 5.4 5.4 0 0 0-.1-4S18.6-.1 15.5 2a14 14 0 0 0-7 0C5.4-.1 4.1.3 4.1.3A5.4 5.4 0 0 0 4 4.3a5.7 5.7 0 0 0-1.5 4c0 5.8 3.6 7.1 7 7.5-.6.6-.6 1.2-.5 2V21',
};
