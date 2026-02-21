<template>
  <main class="details-page">
    <div class="details-container">
      <nav class="navigation">
        <button @click="router.back()" class="btn-back">← Back</button>
      </nav>

      <div v-if="loading" class="loader-card">
        <div class="spinner"></div>
        <p>Uploading data..</p>
      </div>

      <BaseCard v-else-if="user">
        <template #header>
          <div class="details-header">
            <h1>{{ user.name }}</h1>
          </div>
        </template>

        <div class="details-body">
          <div class="info-list">
            <p><strong>Email:</strong>{{ user.email }}</p>
            <p><strong>Phone:</strong>{{ user.phone }}</p>
            <p><strong>City:</strong>{{ user.address?.city }}</p>
            <p><strong>Zipcode:</strong>{{ user.address?.zipcode }}</p>
            <p><strong>Company:</strong>{{ user.company?.name }}</p>
            <p><strong>Website:</strong>{{ user.website }}</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard v-else variant="error">
        <p>User not found</p>
        <button @click="router.push('/dashboard')" class="btn">Return to Dashboard</button>
      </BaseCard>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRoute, useRouter } from 'vue-router'
import BaseCard from '@/components/BaseCard.vue'
import type { User } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(true)

const user = computed<User | undefined>(() => {
  return userStore.users.find((u: User) => u.id === Number(route.params.id))
})

onMounted(() => {
  if (!user.value && userStore.users.length === 0) {
    router.push('/dashboard')
  } else {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
/* Стили из предыдущего сообщения для исправления отступов */
@mixin checkerboard-bg {
  background-color: #f0f2f5;
  background-image:
    radial-gradient(circle at center 37%, transparent 10%, rgba(66, 184, 131, 0.7) 93%),
    linear-gradient(45deg, rgba(0, 0, 0, 0.09) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(0, 0, 0, 0.09) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.09) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.09) 75%);
  background-size:
    100% 100%,
    100px 100px,
    100px 100px,
    100px 100px,
    100px 100px;
  background-position:
    center,
    0 0,
    0 50px,
    50px -50px,
    -50px 0px;
}
.details-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 20px;
  @include checkerboard-bg;
}
.details-container {
  width: 100%;
  max-width: 550px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.navigation {
  display: flex;
  justify-content: flex-start;
}
.details-header {
  border-bottom: 2px solid #42b883;
  padding-bottom: 1rem;
  margin-bottom: 0;
  h1 {
    font-size: 2rem;
    color: #1e293b;
    margin: 0;
  }
}
.details-body {
  padding-top: 0;
}
.info-list p {
  margin: 12px 0;
  font-size: 1.2rem;
  color: #475569;
  display: flex;
  strong {
    color: #1e293b;
    width: 120px;
    flex-shrink: 0;
  }
}
.btn-back {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #64748b;
  transition: 0.3s;
  &:hover {
    background: white;
    transform: translateX(-5px);
    color: #42b883;
  }
}
.loader-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: #42b883;
}
.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
