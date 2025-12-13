<script setup lang="ts">
definePageMeta({
  layout: 'cloud',
  // middleware: 'auth' // 實際專案應開啟此行
})


// 暫時取消登入
// const user = useUser()

// 如果未登入，導向登入頁 (模擬 Middleware)
/*
onMounted(() => {
  if (!user.value) {
    navigateTo('/login')
  }
})
  */

const systems = [
  {
    id: 'regulation',
    title: '法規系統',
    desc: '維護自治章程、組織法規修正案與解釋文。',
    icon: 'gavel',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/20',
    link: '/regulation'
  },
  {
    id: 'meeting',
    title: '會議紀錄系統(製作中)',
    desc: '上傳各級會議紀錄、發布行政公文與公告。',
    icon: 'folder_open',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/20',
    link: ''
  },
  {
    id: 'proposal',
    title: '峽議秘草🍀', //提案及查詢系統
    desc: '三峽議會秘書處草擬議程與會議紀錄用',
    icon: 'assignment_turned_in',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    link: 'bills/sanxia-congress/draft'
  },
  {
    id: 'school',
    title: '校務參與(製作中)',
    desc: '更新學生代表名單。',
    icon: 'school',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    link: ''
  },
  {
    id: 'court-decision',
    title: '裁判書管理系統(製作中)',
    desc: '學生法院上傳裁判書使用。',
    icon: 'book',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/20',
    link: ''
  }
]
</script>

<template>
  <div class="py-8 animate-fade-in"> <!-- v-if="user" -->
    
    <!-- 歡迎區塊 
    <div class="mb-10">
      <h2 class="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        早安user.name 
      </h2>
      <p class="text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        系統運作正常 · 您的權限級別：<span class="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 rounded text-xs text-slate-700 dark:text-slate-300">DUCK</span>
      </p>
    </div>-->
    <div class="mb-10">
      <h2 class="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        學生自治公開資訊維護系統 
      </h2>
      <p class="text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        僅供內部使用，會員請至<NuxtLink to="https://ntpusu.org" target="_BLANK">會網</NuxtLink>瀏覽。
      </p>
    </div>

    <!-- 系統入口卡片 Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <NuxtLink 
        v-for="sys in systems" 
        :key="sys.id"
        :to="sys.link"
        class="group relative bg-white dark:bg-slate-800 rounded-[24px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden no-underline"
      >
        <!-- 背景裝飾 -->
        <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-[0.08] transition-transform group-hover:scale-150 duration-500" :class="sys.bg.replace('bg-', 'bg-current text-')"></div>

        <div class="relative z-10 flex flex-col h-full">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors" :class="sys.bg">
            <span class="material-symbols-rounded text-3xl" :class="sys.color">{{ sys.icon }}</span>
          </div>
          
          <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {{ sys.title }}
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow leading-relaxed">
            {{ sys.desc }}
          </p>

          <div class="flex items-center text-sm font-bold text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors mt-auto">
            進入系統
            <span class="material-symbols-rounded ml-1 text-lg group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- 快速操作與待辦 (模擬 Widget) -->
    <div class="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- 待辦事項 -->
      <!--
      <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span class="material-symbols-rounded text-blue-500">task_alt</span>
            待辦事項
          </h3>
          <button class="text-xs font-medium text-blue-600 hover:underline">查看全部</button>
        </div>
        <div class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer group">
            <div class="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 group-hover:border-blue-500 transition-colors"></div>
            <div class="flex-grow">
              <p class="text-sm font-medium text-slate-700 dark:text-slate-200">審核法規委員會提交之修正草案</p>
              <p class="text-xs text-slate-400">截止日期：今天 17:00</p>
            </div>
            <span class="px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold">急件</span>
          </div>
        </div>
      </div>
      -->

      <!-- 下載專區 Widget -->
      <!-- 
      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] p-6 text-white relative overflow-hidden">
        <span class="material-symbols-rounded absolute -bottom-4 -right-4 text-9xl opacity-10">download</span>
        <h3 class="font-bold text-lg mb-2 relative z-10">常用表單下載</h3>
        <p class="text-blue-100 text-sm mb-6 relative z-10 opacity-90">
          需要行政公文範本、會議簽到表或預算申請書嗎？
        </p>
        <button class="relative z-10 w-full py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-sm font-medium transition-colors border border-white/20">
          前往下載中心
        </button>
      </div>
      -->

    </div>
  </div>
</template>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>