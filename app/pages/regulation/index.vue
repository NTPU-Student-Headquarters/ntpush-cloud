<!-- app/pages/regulation/index.vue -->

<script setup lang="ts">
// 設定使用 cloud 佈局
definePageMeta({
  layout: 'cloud'
})

useHead({
  title: '法規系統 - NTPU 學生自治雲'
})

// -- 狀態管理 --

// 1. 篩選狀態 (預設全選)
const selectedFilters = ref(['common', 'sanxia', 'taipei'])

// 2. 彈窗狀態
const isModalOpen = ref(false)
const currentLaw = ref<{ id: string, title: string } | null>(null)

// -- 資料獲取與處理 --

const { data: lawListResponse } = await useFetch('/api/regulation/list')
const lawList = computed(() => lawListResponse.value || [])

// 定義六大區塊的標題與對應的篩選 Key
const categories = [
  { prefix: '1', title: '三峽學生會', filterKey: 'sanxia' },
  { prefix: '2', title: '三峽議會', filterKey: 'sanxia' },
  { prefix: '3', title: '學生法院', filterKey: 'common' },
  { prefix: '4', title: '臺北學生會', filterKey: 'taipei' },
  { prefix: '5', title: '臺北議會', filterKey: 'taipei' },
  { prefix: '6', title: '總會', filterKey: 'common' },
]

// 核心邏輯：將法規分配到各個區塊
const categorizedLaws = computed(() => {
  const groups: Record<string, typeof lawList.value> = {
    '1': [], '2': [], '3': [], '4': [], '5': [], '6': []
  }
  
  lawList.value.forEach(([id, title]) => {
    const idStr = id.toString()
    const prefix = idStr.charAt(0)
    if (groups[prefix]) {
      groups[prefix].push([id, title])
    }
  })
  
  return groups
})

// -- 互動邏輯 --

const openModal = (id: string, title: string) => {
  currentLaw.value = { id, title }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    currentLaw.value = null
  }, 300) // 等待動畫結束
}

// 判斷是否顯示該區塊 (根據篩選器)
const shouldShowCategory = (filterKey: string) => {
  return selectedFilters.value.includes(filterKey)
}

// 判斷該區塊是否有資料
const hasData = (prefix: string) => {
  return categorizedLaws.value[prefix] && categorizedLaws.value[prefix].length > 0
}
</script>

<template>
  <div class="animate-fade-in pb-12">
    
    <!-- Header Area -->
    <div class="mb-8">
      <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
        <NuxtLink to="/" class="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">首頁</NuxtLink>
        <span class="material-symbols-rounded text-base">chevron_right</span>
        <span class="font-medium text-slate-800 dark:text-slate-200">法規系統</span>
      </div>
      <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
        <span class="material-symbols-rounded text-amber-500 text-4xl">gavel</span>
        法規系統
      </h1>
      <p class="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">
        以下依照主管部門列出法規。點擊法規名稱後，可以進一步操作（列印公告版、下載空白對照表 Word 檔等）。
      </p>
    </div>

    <!-- Filter Chips (M3 Style) -->
    <div class="mb-8 p-1">
      <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 ml-1">顯示篩選</h3>
      <div class="flex flex-wrap gap-3">
        <label 
          v-for="filter in [
            { key: 'common', label: '共通法規' }, 
            { key: 'sanxia', label: '三峽校區' }, 
            { key: 'taipei', label: '臺北校區' }
          ]" 
          :key="filter.key"
          class="relative cursor-pointer select-none"
        >
          <input type="checkbox" :value="filter.key" v-model="selectedFilters" class="peer sr-only">
          <div class="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 peer-checked:bg-blue-100 peer-checked:text-blue-800 peer-checked:border-blue-200 dark:peer-checked:bg-blue-900/40 dark:peer-checked:text-blue-300 dark:peer-checked:border-blue-700 transition-all flex items-center gap-2 shadow-sm">
            <span class="material-symbols-rounded text-lg transition-transform scale-0 w-0 peer-checked:scale-100 peer-checked:w-auto">check</span>
            <span class="font-medium text-sm">{{ filter.label }}</span>
          </div>
        </label>
      </div>
    </div>

    <!-- 6-Block Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      
      <template v-for="cat in categories" :key="cat.prefix">
        <!-- 僅當符合篩選條件時顯示區塊 -->
        <div 
          v-if="shouldShowCategory(cat.filterKey)" 
          class="flex flex-col h-full bg-white dark:bg-slate-800 rounded-[24px] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          <!-- Block Header -->
          <div class="px-6 py-4 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h2 class="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-mono font-bold">{{ cat.prefix }}</span>
              {{ cat.title }}
            </h2>
          </div>

          <!-- List Content -->
          <div class="flex-grow">
            <ul v-if="hasData(cat.prefix)" class="divide-y divide-slate-100 dark:divide-slate-700/50">
              <li 
                v-for="([id, title]) in categorizedLaws[cat.prefix]" 
                :key="id"
                class="flex items-start gap-4 px-6 py-4"
              >
                <span class="font-mono text-slate-400 dark:text-slate-500 text-sm mt-0.5 select-none">
                  {{ id.toString().padStart(4, '0') }}
                </span>
                <span 
                  @click="openModal(id.toString(), title)"
                  class="text-slate-700 dark:text-slate-200 font-medium leading-snug cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:underline decoration-blue-500/30 underline-offset-4 transition-all"
                >
                  {{ title }}
                </span>
              </li>
            </ul>
            
            <!-- Empty State for Block -->
            <div v-else class="p-8 text-center text-slate-400 dark:text-slate-500">
              <span class="material-symbols-rounded text-4xl mb-2 opacity-50">folder_off</span>
              <p class="text-sm">此類別尚無資料</p>
            </div>
          </div>
        </div>
      </template>

    </div>

    <!-- Modal (Dialog) -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
          
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeModal"></div>

          <!-- Dialog Content -->
          <div class="relative bg-white dark:bg-slate-800 rounded-[28px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            
            <!-- Header -->
            <div class="p-6 pb-2">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-mono mb-3">
                    <span class="material-symbols-rounded text-sm">tag</span>
                    {{ currentLaw?.id.toString().padStart(4, '0') }}
                  </div>
                  <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    {{ currentLaw?.title }}
                  </h3>
                </div>
                <button 
                  @click="closeModal"
                  class="p-2 -mr-2 -mt-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                >
                  <span class="material-symbols-rounded">close</span>
                </button>
              </div>
            </div>

            <!-- Content / Actions -->
            <div class="p-6 pt-4">
              <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">操作選項</p>
              
              <div class="grid grid-cols-2 gap-4">
                <!-- Group 1: 法制作業 (Warm Colors) -->
                <div class="col-span-2 grid grid-cols-2 gap-3">
                   <NuxtLink 
                    :to="`/regulation/${currentLaw?.id}/print`" 
                    target="_blank"
                    class="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-orange-100 dark:border-orange-900/30 transition-all group"
                  >
                    <span class="material-symbols-rounded text-2xl group-hover:scale-110 transition-transform">print</span>
                    <span class="text-sm font-medium">列印法規</span>
                  </NuxtLink>

                  <NuxtLink 
                    :to="`/regulation/${currentLaw?.id}/amend`"
                    target="_blank" 
                    class="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-amber-100 dark:border-amber-900/30 transition-all group"
                  >
                    <span class="material-symbols-rounded text-2xl group-hover:scale-110 transition-transform">difference</span>
                    <span class="text-sm font-medium">修法對照表</span>
                  </NuxtLink>
                </div>

                <!-- Divider -->
                <div class="col-span-2 border-t border-slate-100 dark:border-slate-700 my-1"></div>

                <!-- Group 2: IT 原始碼 (Cool/Neutral Colors) -->
                <div class="col-span-2 grid grid-cols-2 gap-3">
                  <NuxtLink 
                    :to="`/regulation/${currentLaw?.id}/embed`" 
                    target="_blank"
                    class="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-900/30 transition-all group"
                  >
                    <span class="material-symbols-rounded text-2xl group-hover:scale-110 transition-transform">preview</span>
                    <span class="text-sm font-medium">網頁預覽</span>
                  </NuxtLink>

                  <NuxtLink 
                    :to="`/regulation/${currentLaw?.id}/source-code`"
                    target="_blank" 
                    class="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all group"
                  >
                    <span class="material-symbols-rounded text-2xl group-hover:scale-110 transition-transform">code</span>
                    <span class="text-sm font-medium">原始碼</span>
                  </NuxtLink>
                </div>
              </div>

            </div>

            <!-- Footer (Optional Info) -->
            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 text-center">
               <span class="text-xs text-slate-400">僅限內部人員使用，請勿外流原始碼。</span>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}

.modal-enter-to .relative,
.modal-leave-from .relative {
  transform: scale(1) translateY(0);
}
</style>