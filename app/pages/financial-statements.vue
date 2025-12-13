<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { FinancialStatement } from '~/server/api/finance-statements'

definePageMeta({
  layout: 'cloud'
})

useHead({
  title: '財務報表 - NTPU 學生自治雲'
})

// --- 資料定義 ---

const entities = ['總會', '三峽校區', '臺北校區', '學生法院'] as const
const reportTypes = ['法定預算', '法定追加預算', '法定特別預算', '法定決算', '法定追加決算', '法定特別決算', '其它'] as const

// 產生學年度選項 (114 ~ 90)
const yearOptions = Array.from({ length: 114 - 90 + 1 }, (_, i) => 114 - i)

// 排序權重 Mapping
const entityOrderMap: Record<string, number> = {
  '總會': 1,
  '三峽校區': 2,
  '臺北校區': 3,
  '學生法院': 4
}

const typeOrderMap: Record<string, number> = {
  '法定預算': 1,
  '法定追加預算': 2,
  '法定特別預算': 3,
  '法定決算': 4,
  '法定追加決算': 5,
  '法定特別決算': 6,
  '其它': 7
}

// --- 狀態管理 ---

const { data: rawData, pending } = await useFetch<FinancialStatement[]>('/api/finance-statements')

const isFilterExpanded = ref(true)
const isYearDropdownOpen = ref(false)

const selectedEntities = ref<string[]>([...entities])
const selectedReportTypes = ref<string[]>([...reportTypes])
const selectedYears = ref<number[]>([...yearOptions])

// --- 輔助函式 (全選/全不選) ---

const toggleAllEntities = (checked: boolean) => {
  selectedEntities.value = checked ? [...entities] : []
}

const toggleAllReportTypes = (checked: boolean) => {
  selectedReportTypes.value = checked ? [...reportTypes] : []
}

const toggleAllYears = (checked: boolean) => {
  selectedYears.value = checked ? [...yearOptions] : []
}

// 點擊外部關閉年份下拉選單
const yearDropdownRef = ref<HTMLElement | null>(null)
const handleClickOutside = (event: MouseEvent) => {
  if (yearDropdownRef.value && !yearDropdownRef.value.contains(event.target as Node)) {
    isYearDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// --- 核心邏輯：排序與篩選 ---

const filteredAndSortedData = computed(() => {
  if (!rawData.value) return []

  // 1. 篩選
  let result = rawData.value.filter(item => {
    return (
      selectedEntities.value.includes(item.entity) &&
      selectedReportTypes.value.includes(item.type) &&
      selectedYears.value.includes(item.year)
    )
  })

  // 2. 排序
  result.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    if (a.semester !== b.semester) return b.semester - a.semester
    
    const entityA = entityOrderMap[a.entity] || 99
    const entityB = entityOrderMap[b.entity] || 99
    if (entityA !== entityB) return entityA - entityB
    
    const typeA = typeOrderMap[a.type] || 99
    const typeB = typeOrderMap[b.type] || 99
    return typeA - typeB
  })

  return result
})

// --- UI 輔助 ---

const getFileLink = (item: FinancialStatement) => {
  if (item.resourceType === 'link' && item.url) {
    return item.url
  } else {
    return `/financial-statements/${item.id}.pdf`
  }
}

const getSemsterText = (sem: number) => {
  return sem === 1 ? '上學期' : '下學期'
}

// 獲取顯示用的標題
// 若資料庫有 title 則顯示 title，否則自動組合標準名稱
const getReportTitle = (item: FinancialStatement) => {
  if (item.title && item.title.trim() !== '') {
    return item.title
  }
  return `${item.entity}${item.year}年度第${item.semester}期間${item.type}`
}
</script>

<template>
  <div class="animate-fade-in pb-12 w-full">
    
    <!-- Header -->
    <div class="mb-8">
      <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
        <NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">首頁</NuxtLink>
        <span class="material-symbols-rounded text-base">chevron_right</span>
        <span class="font-medium text-slate-800 dark:text-slate-200" aria-current="page">財務報表</span>
      </nav>

      <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3 mb-4">
        <span class="material-symbols-rounded text-blue-600 dark:text-blue-400 text-4xl">account_balance_wallet</span>
        財務報表
      </h1>
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-xl text-slate-700 dark:text-slate-300 leading-relaxed">
        <p>
          依照本會
          <NuxtLink to="https://ntpusu.org/tag/financial-regulations" target="_BLANK" class="text-blue-600 dark:text-blue-400 font-bold hover:underline decoration-2 underline-offset-2">財務規章</NuxtLink>
          ，我們向您收取的會費，必須編製預算，經學生議會審議後才能使用。每學期的花費狀況，也會編列決算，經過學生議會審查後，提供公開檢視。
        </p>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="mb-8 bg-white dark:bg-slate-800 rounded-[24px] border border-slate-200 dark:border-slate-700 shadow-sm overflow-visible">
      <button 
        @click="isFilterExpanded = !isFilterExpanded"
        class="w-full px-6 py-4 flex justify-between items-center text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        :aria-expanded="isFilterExpanded"
        aria-controls="filter-panel"
      >
        <div class="flex items-center gap-2 font-bold text-lg">
          <span class="material-symbols-rounded">filter_list</span>
          資料篩選
        </div>
        <span class="material-symbols-rounded transition-transform duration-300" :class="{ 'rotate-180': isFilterExpanded }">
          expand_more
        </span>
      </button>

      <div 
        id="filter-panel"
        v-show="isFilterExpanded" 
        class="border-t border-slate-100 dark:border-slate-700 p-6 space-y-6"
      >
        <!-- Filter Groups (Same as before) -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">預算主體</h3>
            <div class="flex gap-2 text-xs">
              <button @click="toggleAllEntities(true)" class="text-blue-600 dark:text-blue-400 hover:underline">全選</button>
              <span class="text-slate-300">|</span>
              <button @click="toggleAllEntities(false)" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">全不選</button>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <label v-for="entity in entities" :key="entity" class="cursor-pointer select-none">
              <input type="checkbox" :value="entity" v-model="selectedEntities" class="peer sr-only">
              <div class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-sm peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 dark:peer-checked:bg-blue-500 transition-all shadow-sm">
                {{ entity }}
              </div>
            </label>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">類型</h3>
            <div class="flex gap-2 text-xs">
              <button @click="toggleAllReportTypes(true)" class="text-blue-600 dark:text-blue-400 hover:underline">全選</button>
              <span class="text-slate-300">|</span>
              <button @click="toggleAllReportTypes(false)" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">全不選</button>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <label v-for="type in reportTypes" :key="type" class="cursor-pointer select-none">
              <input type="checkbox" :value="type" v-model="selectedReportTypes" class="peer sr-only">
              <div class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-sm peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-emerald-600 dark:peer-checked:bg-emerald-500 transition-all shadow-sm">
                {{ type }}
              </div>
            </label>
          </div>
        </div>

        <div class="relative" ref="yearDropdownRef">
          <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">年度</h3>
          
          <button 
            @click="isYearDropdownOpen = !isYearDropdownOpen"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-colors min-w-[160px] justify-between"
            :class="isYearDropdownOpen ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30' : 'border-slate-300 dark:border-slate-600'"
          >
            <span>
              <span v-if="selectedYears.length === yearOptions.length">所有年度 ({{ yearOptions.length }})</span>
              <span v-else-if="selectedYears.length === 0">未選擇</span>
              <span v-else>已選 {{ selectedYears.length }} 個年度</span>
            </span>
            <span class="material-symbols-rounded text-slate-400">arrow_drop_down</span>
          </button>

          <div 
            v-show="isYearDropdownOpen"
            class="absolute top-full left-0 mt-2 w-64 max-h-60 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-20 p-2 custom-scrollbar"
          >
            <div class="flex justify-between px-2 py-2 mb-1 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
              <button @click="toggleAllYears(true)" class="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">全選</button>
              <button @click="toggleAllYears(false)" class="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">全不選</button>
            </div>
            <div class="grid grid-cols-2 gap-1 p-1">
              <label v-for="year in yearOptions" :key="year" class="flex items-center p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                <input type="checkbox" :value="year" v-model="selectedYears" class="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-600">
                <span class="ml-2 text-sm text-slate-700 dark:text-slate-300">{{ year }} 學年</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white dark:bg-slate-800 rounded-[24px] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="pending" class="p-12 flex justify-center items-center text-slate-400 gap-3">
        <span class="material-symbols-rounded animate-spin text-3xl">progress_activity</span>
        <span>資料載入中...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredAndSortedData.length === 0" class="p-12 text-center text-slate-500 dark:text-slate-400">
        <span class="material-symbols-rounded text-6xl mb-4 text-slate-300 dark:text-slate-600">search_off</span>
        <p class="text-lg font-medium">找不到符合條件的財報</p>
        <p class="text-sm mt-1">請嘗試調整上方的篩選條件</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse" aria-label="財務報表列表">
          <thead class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th scope="col" class="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider whitespace-nowrap">機關</th>
              <th scope="col" class="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider whitespace-nowrap">會計年度</th>
              
              <th scope="col" class="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider whitespace-nowrap min-w-[240px]">預（決）算書</th>
              <th scope="col" class="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider whitespace-nowrap">類型</th>
              <th scope="col" class="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider whitespace-nowrap">公布日</th>
              <th scope="col" class="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider text-right whitespace-nowrap">查看</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
            <tr 
              v-for="item in filteredAndSortedData" 
              :key="item.id"
              class="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group"
            >
              <td class="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                {{ item.entity }}
              </td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                <span class="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-sm">{{ item.year }}</span>
              </td>
              
              <!-- 標題 -->
              <td class="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">
                {{ getReportTitle(item) }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300': item.type.includes('預算'),
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300': item.type.includes('決算'),
                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300': item.type === '其它'
                  }"
                >
                  {{ item.type.replace('法定', '')}}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                {{ item.publicateDate? item.publicateDate : '待補' }}
              </td>
              <td class="px-6 py-4 text-right whitespace-nowrap">
                <a 
                  :href="getFileLink(item)" 
                  target="_blank"
                  :aria-label="`查看 ${getReportTitle(item)}`"
                  class="inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all transform hover:scale-110 active:scale-95"
                >
                  <span class="material-symbols-rounded text-2xl">
                    {{ item.resourceType === 'link' ? 'link' : 'picture_as_pdf' }}
                  </span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Table Footer -->
      <div class="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
        <span>顯示 {{ filteredAndSortedData.length }} 筆資料</span>
        <span>資料更新時間：2025/12/13</span>
      </div>
    </div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
}
</style>