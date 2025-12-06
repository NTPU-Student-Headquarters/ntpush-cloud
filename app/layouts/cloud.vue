<!-- app/layouts/cloud.vue -->

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 模擬使用者狀態 (實際專案會從 Pinia 或 useAuth 取得)
/*
const user = useUser() // 假設有一個 global composable

*/
const isDark = ref(false)

// 切換深色模式
const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// 登出功能
/*
const handleLogout = async () => {
  // await signOut() // 呼叫 Auth 模組登出
  user.value = null
  navigateTo('/login')
}
*/

// 初始化主題
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

// 使用 useHead 將背景 class 直接應用到 <body>
useHead({
  bodyAttrs: {
    class: 'bg-slate-50 dark:bg-[#1b1b1f]'
  }
})
</script>

<template>
  <div class="min-h-screen w-full flex flex-col text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans">
    
    <!-- 頂部導覽列 (Sticky Header) -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1b1b1f]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          
          <!-- Logo 與 標題 -->
          <div class="flex items-center gap-3 cursor-pointer min-w-0" @click="navigateTo('/')">
            <div class="w-10 h-10 bg-blue-700 dark:bg-blue-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <span class="material-symbols-rounded text-white text-2xl">cloud_circle</span>
            </div>
            
            <div class="flex flex-col min-w-0">
              <h1 class="font-bold text-lg leading-tight tracking-wide text-blue-900 dark:text-blue-100 truncate">
                NTPU 學生自治雲
              </h1>
              <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase truncate">
                Internal Only
              </span>
            </div>
          </div>

          <!-- 右側功能區 -->
          <div class="flex items-center gap-3">
            <!-- 主題切換 -->
            <button 
              @click="toggleTheme"
              class="border-0 w-10 h-10 rounded-full flex items-center justify-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
              :title="isDark ? '切換至亮色模式' : '切換至深色模式'"
            >
              <span class="material-symbols-rounded">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
            </button>

            <!-- 使用者資訊 / 登出 -->
            <!--
            <ClientOnly>
              <div v-if="user" class="flex items-center gap-3 pl-3 border-l border-slate-300 dark:border-slate-700">
                <div class="hidden md:flex flex-col items-end">
                  <span class="text-sm font-medium">{{ user.name }}</span>
                  <span class="text-xs text-slate-500 dark:text-slate-400">{{ user.department }}</span>
                </div>
                
                <img 
                  v-if="user.avatar" 
                  :src="user.avatar" 
                  class="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-600"
                  alt="User Avatar"
                >
                <div v-else class="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">
                  {{ user.name.charAt(0) }}
                </div>
                
                <button 
                  @click="handleLogout"
                  class="ml-1 w-9 h-9 rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 flex items-center justify-center transition-colors"
                  title="登出"
                >
                  <span class="material-symbols-rounded text-xl">logout</span>
                </button>
              </div>
            </ClientOnly>
            -->
          </div>
        </div>
      </div>
    </header>

    <!-- 主要內容區 -->
    <main class="flex-grow pt-24 w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>

    <footer class="mt-12 py-8 bg-slate-50 dark:bg-[#1b1b1f] border-t border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© {{ new Date().getFullYear() }} 國立臺北大學學生自治會 NTPU Student Headquarters. All rights reserved.</p>
        <div class="flex gap-4">
          <a href="mailto:ntpusuwebsite@gmail.com" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">系統技術問題</a>
          <a href="mailto:ntpush92613815@gmail.com" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">管理員聯絡資訊</a>
        </div>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* 引入 Material Symbols */
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0');
</style>