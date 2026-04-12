<script setup lang="ts">
definePageMeta({
  layout: 'cloud'
})
useHead({
  title: '登入',
})

const isLoggingIn = ref(false)

// 正式 Google 登入流程
const handleGoogleLogin = () => {
  isLoggingIn.value = true
  
  // 導向至你在 server/api/auth/google.get.ts 定義的處理端點
  // 使用外部鏈結跳轉以啟動 OAuth 流程
  window.location.href = '/api/auth/google'
}
</script>

<template>
  <div class="flex-grow flex items-center justify-center -mt-16">
    <div class="w-full max-w-sm">
      
      <div class="bg-white dark:bg-slate-800 rounded-[28px] shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden p-8 text-center">
        
        <div class="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl mx-auto flex items-center justify-center mb-6">
          <span class="material-symbols-rounded text-4xl text-blue-600 dark:text-blue-400">admin_panel_settings</span>
        </div>

        <h2 class="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">自治機關登入</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
          本系統僅限國立臺北大學學生自治會<br />
          各機關(含網管小組)使用，請使用貴機關官方信箱登入。
        </p>

        <button 
          @click="handleGoogleLogin"
          :disabled="isLoggingIn"
          class="w-full relative flex items-center justify-center gap-3 bg-white dark:bg-[#131314] text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 transition-all rounded-full px-6 py-3.5 shadow-sm group"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" alt="Google Logo">
          <span class="font-medium tracking-wide">
            {{ isLoggingIn ? '正在前往 Google 驗證...' : '使用 Google 帳號登入' }}
          </span>
          
          <div v-if="isLoggingIn" class="absolute right-4 w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
        </button>

        <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
          <div class="flex items-start gap-2 text-left">
            <span class="material-symbols-rounded text-amber-500 text-lg mt-0.5">warning</span>
            <p class="text-xs text-slate-400 dark:text-slate-500">
              非授權帳號將無法通過驗證。若貴單位官方信箱有異動，請聯絡網管小組更新權限。
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>