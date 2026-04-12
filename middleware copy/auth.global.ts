// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Server 端 session 狀態不穩定，統一交由 client 端判斷
  if (import.meta.server) return

  const { loggedIn } = useUserSession()

  // 公開路由白名單
  const publicRoutes = ['/login']
  if (publicRoutes.includes(to.path)) {
    // 已登入者不應再進入登入頁
    if (loggedIn.value) return navigateTo('/')
    return
  }

  // 未登入則導向登入頁
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})