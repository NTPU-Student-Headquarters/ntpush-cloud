// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession()
  
  console.log(`[auth.global] path=${to.path}, loggedIn=${loggedIn.value}, server=${import.meta.server}`)

  // 1. 已登入的使用者試圖訪問 /login，導回首頁
  if (to.path === '/login') {
    if (loggedIn.value) {
      return navigateTo('/')
    }
    return // 未登入就讓他正常訪問 /login
  }

  // 2. 登入狀態檢查 (Server 端)
  if (import.meta.server) {
    if (!loggedIn.value) {
      return navigateTo('/login', { redirectCode: 302 })
    }
  } 
  // 3. 登入狀態檢查 (Client 端：確保水合後也會檢查)
  // 也就是在 server 端 session 尚未就緒時，交由 client 端再判斷一次
  else {
    if (!loggedIn.value) {
      return navigateTo('/login')
    }
  }

  // ----------------------------------------------------------------
  // 4. 特定路徑權限管控 (執行到此處，代表 loggedIn 必為 true)
  // ----------------------------------------------------------------
  if (to.path.startsWith('/drafting/')) {
    
    // 定義可以存取草擬系統的白名單
    const draftingWhitelist = [
      'ntpuscs@gmail.com',
    ];

    // 檢查當前使用者的 email 是否存在於白名單中
    if (!user.value || !draftingWhitelist.includes(user.value.email)) {
      console.warn(`[auth.global] 無權限訪問: ${user.value?.email} 嘗試進入 ${to.path}`);
      
      // 無權限，導回首頁
      return navigateTo('/');
    }
  }
})