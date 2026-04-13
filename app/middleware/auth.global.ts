// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  
   console.log(`[auth.global] path=${to.path}, loggedIn=${loggedIn.value}, server=${import.meta.server}`)

  // 已登入的使用者試圖訪問 /login，導回首頁
  if (to.path === '/login') {
    if (loggedIn.value) {
      return navigateTo('/')
    }
    return // 未登入就讓他正常訪問 /login
  }

  // 在 server 端 session 尚未就緒時，交由 client 端再判斷一次
  if (import.meta.server) {
    if (!loggedIn.value) {
      return navigateTo('/login', { redirectCode: 302 })
    }
    return
  }

  // client 端：確保水合後也會檢查
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})