<!-- layouts/repres.vue -->
<template>
  <div :data-bs-theme="colorMode.value" class="bootstrap-scope">
    <Head>
      <!-- Bootstrap CSS -->
      <Link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossorigin="anonymous"
      />
      <!-- Bootstrap Icons -->
      <Link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
      <!-- Bootstrap JS -->
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossorigin="anonymous"
        defer
      />
    </Head>
    
    <slot />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
</script>

<style>

.bootstrap-scope {
  /* 將 Bootstrap 樣式限制在 bootstrap-scope 內，確保 Bootstrap 樣式不會洩漏到其他頁面 */
  all: initial;
  display: block;
  min-height: 100vh;
}

/* 重新應用必要的全域樣式 */
.bootstrap-scope * {
  box-sizing: border-box;
}

.bootstrap-scope body {
  margin: 0;
  font-family: var(--bs-body-font-family);
  font-size: var(--bs-body-font-size);
  font-weight: var(--bs-body-font-weight);
  line-height: var(--bs-body-line-height);
  color: var(--bs-body-color);
  background-color: var(--bs-body-bg);
}
</style>