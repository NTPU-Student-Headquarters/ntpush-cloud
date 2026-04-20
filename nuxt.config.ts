// https://nuxt.com/docs/api/configuration/nuxt-config

import { siteConfig } from "./config/site.config";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { 
    enabled: process.env.NODE_ENV === 'development'
   },

  nitro: {
    preset: 'cloudflare-pages'
  },

  app: {
    head: {
      title: siteConfig.name,
      titleTemplate: '%s - '+siteConfig.shortName,
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
    '@nuxt/icon',
    'nuxt-auth-utils'
  ],

  colorMode: {
    classSuffix: '', // Tailwind: 讓 Tailwind 的 dark: class 直接生效
    dataValue: 'theme', // Pico: 對應 Pico 的 [data-theme]
    preference: 'system',
    fallback: 'light', // 當偵測不到時的預設值
  },
  
  css: [
    '@/assets/css/regulation-format.css'
  ],
  
  // 注入全域變數
  runtimeConfig: {
    public: {
      ...siteConfig
    },
    // 以下定義立法資料儲存在哪裡，只能在 Server 端存取
    legiDataSource: {
      repo: 'ntpuscs/legislative-data',
      branch: 'main',
      
      basePath: 'data/bylaws', // 各法規文字檔案之路徑
      listPath: 'data/bylaw-list.json',
      
      workflowBasePath: '.github/workflows',
      workflowNameReports: 'fetch-committee-reports.yml',
      workflowNameBills: 'fetch-bills.yml',
      workflowNameBylaws: 'fetch-bylaws.yml',
    }
    
  },
  
  vite: {
    optimizeDeps: {
      include: [
        'file-saver',
        'docx'
      ]
    }
  },
})