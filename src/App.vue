<template>
  <router-view />
</template>

<script setup lang="ts">
import { provide, reactive } from 'vue'
import type { AppConfig } from '@/types'

const appConfig = reactive<AppConfig>({
  apiBase: 'https://jsonplaceholder.typicode.com',
  theme: 'light',
  appName: 'Dashboard App',
})

provide('config', appConfig)
</script>
