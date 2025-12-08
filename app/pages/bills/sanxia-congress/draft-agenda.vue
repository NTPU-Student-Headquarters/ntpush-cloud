<!-- app/pages/bills/index.vue -->

<script setup lang="ts">
definePageMeta({
  layout: 'cloud'
})

useHead({
  title: '三峽校區學生議會秘書處排案系統 - NTPU 學生自治雲'
})
</script>

<template>
  <div class="animate-fade-in pb-12 w-full">
    
    <!-- Header Area -->
    <div class="mb-8">
      <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
        <NuxtLink to="/" class="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">首頁</NuxtLink>
        <span class="material-symbols-rounded text-base">chevron_right</span>
        <NuxtLink to="/bills" class="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">議案系統</NuxtLink>
        <span class="material-symbols-rounded text-base">chevron_right</span>
        <NuxtLink to="/bills/sanxia-congress" class="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">三峽議會</NuxtLink>
        <span class="material-symbols-rounded text-base">chevron_right</span>
        <span class="font-medium text-slate-800 dark:text-slate-200">秘書處排案系統</span>
      </div>
      <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
        <span class="material-symbols-rounded text-amber-500 text-4xl">gavel</span>
        三峽校區學生議會秘書處排案系統
      </h1>
      <p class="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">
        功能匯入整合中，請稍後再試。
      </p>
    </div>

  </div>
</template>

<style scoped>
</style>