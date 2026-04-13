<!--
<script setup>
onErrorCaptured((err, instance, info) => {
  console.error('[ErrorCaptured]', err, info)
  return false
})
</script>
-->
<template>
  <NuxtLayout>
    <NuxtPage />
    <NuxtRouteAnnouncer />
  </NuxtLayout>
</template>
