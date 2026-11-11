<script setup lang="ts">
import { computed, h, ref, watch, onMounted, onUnmounted } from 'vue'
import { useData, useRoute } from 'vitepress'
import Search from 'vitepress/dist/client/theme-default/components/VPNavBarSearch.vue'
import { repositoryUrl, headerIcons } from '../../shared/header'
import siteConfig from '../../site.config.json'
const { isDark, site } = useData()
const siteName = siteConfig.name
const route = useRoute()
// site.value.base 形如 '/docs/'（根路径部署）或 '/repo/docs/'（项目站点）。
const docsBase = computed(() => site.value.base)
const siteRoot = computed(() => docsBase.value.replace(/docs\/$/, ''))
// 官网静态资源在 <base>/docs/_home/。
const homeAssets = computed(() => `${docsBase.value}_home`)
// 每个分类的入口页 = 该目录第一篇文章（构建时按文件名排序，见 config.mts 的 itemsOf）。
// 用 site.config.json 的 sections 决定顺序与名称，这里只负责拼链接。
const docsNavigation = siteConfig.sections.map((section) => ({
  label: section.label,
  section: `${section.dir}/`,
  link: `${section.dir}/${section.entry}`,
}))
// route.path 含部署前缀，形如 '/docs/03-features/04-memory' 或 '/repo/docs/03-features/04-memory'。
const isCurrent = (section: string) => route.path.startsWith(`${docsBase.value}${section}`)
const open = ref(false)
watch(() => route.path, () => open.value = false)
const menu = ref<HTMLButtonElement>()
const label = computed(() => isDark.value ? '切换到浅色' : '切换到深色')
const HeaderIcon = (props: { name: string }) => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [h('path', { d: headerIcons[props.name] })])
function closeMenu(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) { open.value = false; menu.value?.focus() }
}
onMounted(() => document.addEventListener('keydown', closeMenu))
onUnmounted(() => document.removeEventListener('keydown', closeMenu))
</script>

<template>
  <header class="mh-header mh-docs-header">
    <div class="mh-header-inner">
      <a class="mh-brand" :href="siteRoot" target="_self" aria-label="回到首页">
        <img :src="`${homeAssets}/brand/logo.svg`" alt="" width="44" height="38">
        <span class="mh-brand-name">{{ siteName }}</span>
      </a>
      <nav id="main-navigation" class="mh-navigation" :class="{ 'is-open': open }" aria-label="文档导航">
        <a v-for="item in docsNavigation" :key="item.href" :href="`${docsBase}${item.link}`" :aria-current="isCurrent(item.section) ? 'page' : undefined" @click="open = false">{{ item.label }}</a>
        <div class="mh-header-search"><Search /></div>
        <a class="mh-mobile-github" :href="repositoryUrl" target="_blank" rel="noreferrer">GitHub <HeaderIcon name="external" /></a>
      </nav>
      <button class="mh-theme-toggle" type="button" role="switch" :aria-checked="isDark" :aria-label="label" :title="label" @click="isDark = !isDark"><HeaderIcon :name="isDark ? 'moon' : 'sun'" /></button>
      <a class="mh-header-github" :href="repositoryUrl" target="_blank" rel="noreferrer"><HeaderIcon name="github" /><span>GitHub</span></a>
      <button ref="menu" class="mh-menu-toggle" type="button" :aria-label="open ? '关闭导航' : '打开导航'" :aria-expanded="open" aria-controls="main-navigation" @click="open = !open"><HeaderIcon :name="open ? 'close' : 'menu'" /></button>
    </div>
  </header>
</template>
