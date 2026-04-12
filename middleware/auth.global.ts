export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  // 避免登入頁面進入無限循環
  if (!loggedIn.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})