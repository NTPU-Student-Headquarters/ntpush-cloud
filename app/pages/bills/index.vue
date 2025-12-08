<!-- app/pages/bills/index.vue -->


<script setup lang="ts">
definePageMeta({
  layout: 'cloud'
})

useHead({
  title: '議案系統 - NTPU 學生自治雲'
})
</script>

<template>
  <div class="animate-fade-in pb-12 w-full">
    
    <!-- Header Area -->
    <div class="mb-8">
      <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
        <NuxtLink to="/" class="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">首頁</NuxtLink>
        <span class="material-symbols-rounded text-base">chevron_right</span>
        <span class="font-medium text-slate-800 dark:text-slate-200">議案系統</span>
      </div>
      <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
        <span class="material-symbols-rounded text-amber-500 text-4xl">gavel</span>
        議案系統
      </h1>
      <p class="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">
        目前僅提供三峽校區學生議會 <NuxtLink to="/bills/sanxia-congress/draft" class="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">峽議秘草</NuxtLink> 功能，其餘功能尚在開發中。
      </p>
    </div>

  </div>
</template>

<style scoped>
/* Modal Transition */

</style>