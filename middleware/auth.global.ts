// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (to.path === '/login') return

  // 在 server 端 session 尚未就緒時，交由 client 端再判斷一次
  if (import.meta.server) {
    // server 端：若明確未登入才導向（有 cookie 時 loggedIn 應為 true）
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