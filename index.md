---
layout: page
title: 快速开始
sidebar: false
aside: false
footer: false
search: false
---

<script setup>
import { onMounted } from 'vue'
import siteConfig from './site.config.json'
// BASE_URL 含部署前缀：根路径为 '/docs/'，项目站点为 '/my-repo/docs/'。
onMounted(() => {
  const target = `${import.meta.env.BASE_URL}${siteConfig.docsEntry}.html`
  window.location.replace(target + window.location.search + window.location.hash)
})
</script>

[进入文档](./01-getting-started/01-introduction)
