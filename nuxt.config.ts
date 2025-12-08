// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { 
    enabled: process.env.NODE_ENV === 'development'
   },
  css: ['@/assets/css/regulation-format.css'],

  nitro: {
    preset: 'cloudflare-pages'
  },

  app: {
    head: {
      title: 'NTPU 學生自治雲',
      htmlAttrs: { lang: 'zh-Hant-TW', },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { "charset": "utf-8" }
      ],
      noscript: [
        { textContent: 'JavaScript is required' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/ntpush-icon/favicon.ico' },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '180x180', href: '/ntpush-icon/apple-touch-icon.png' },
        { rel: 'manifest', href: '/ntpush-icon/site.webmanifest' }
      ]
    }
  },

  modules: [
    '@nuxt/image', 
    '@nuxtjs/tailwindcss', 
    '@nuxtjs/color-mode', 
    '@nuxt/icon'
  ],

  colorMode: {
    classSuffix: '', // 讓 Tailwind 的 dark: class 直接生效
    preference: 'system',
    fallback: 'light', // 當偵測不到時的預設值
  }

})