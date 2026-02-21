<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <h1>List of participants</h1>
      <button @click="logout" class="btn --logout">Log out</button>
    </header>

    <div v-if="userStore.loading" class="dashboard__loader-container">
      <div class="loader-card">
        <div class="spinner"></div>
        <p>Loading assets...</p>
      </div>
    </div>

    <div v-else-if="userStore.error" class="dashboard__error-container">
      <div class="error-card">
        <h3>Error Loading Data</h3>
        <p>{{ userStore.error }}</p>
        <button @click="fetchData" class="btn --error-btn">Repeat</button>
      </div>
    </div>

    <template v-else>
      <div class="dashboard__card">
        <table class="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>City</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userStore.users" :key="user.id">
              <td class="--id">#{{ user.id }}</td>
              <td class="--name">{{ user.name }}</td>
              <td class="--email">{{ user.email }}</td>
              <td>{{ user.address?.city }}</td>
              <td>
                <button @click="goToDetails(user.id)" class="btn --details">Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="dashboard__ws-status">
        <div class="ws-status-card">
          <div class="ws-status__header">
            <span class="ws-status__icon" :class="`--${wsStatus}`">●</span>
            <span class="ws-status__text">
              Feedback: {{ wsStatus === 'open' ? 'enter a message' : 'message is unavailable' }}
            </span>
          </div>
          <div class="ws-status__controls">
            <input
              v-model="wsInput"
              @keyup.enter="sendWsMessage"
              placeholder="Enter a request"
              class="ws-input"
            />
            <button @click="sendWsMessage" :disabled="wsStatus !== 'open'" class="btn --ws-send">
              Send
            </button>
          </div>
          <div v-if="messages.length > 0" class="ws-messages">
            <div v-for="(msg, i) in messages.slice(-3)" :key="i" class="ws-message">{{ msg }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, inject } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { useWebSocket } from '@/composables/useWebSocket'
import type { User, AppConfig } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const config = inject<AppConfig>('config')

const wsInput = ref('')
const { messages, status: wsStatus, sendMessage } = useWebSocket('wss://ws.postman-echo.com/raw')

const sendWsMessage = () => {
  if (!wsInput.value.trim()) return
  sendMessage(wsInput.value)
  wsInput.value = ''
}

const fetchData = async () => {
  try {
    userStore.error = null
    userStore.loading = true
    const res = await fetch(`${config?.apiBase}/users`)
    if (!res.ok) throw new Error('Network error')

    const data: User[] = await res.json()
    userStore.setUsers(data)
  } catch (err: unknown) {
    userStore.error = err instanceof Error ? err.message : 'Loading failed'
  } finally {
    userStore.loading = false
  }
}

const goToDetails = (id: number) => router.push(`/details/${id}`)
const logout = () => {
  localStorage.removeItem('isAuth')
  router.push('/login')
}

onMounted(() => {
  if (userStore.users.length === 0) fetchData()
})
</script>

<style lang="scss" scoped>
@mixin checkerboard-bg {
  background-color: #f0f2f5;
  background-image:
    radial-gradient(circle, transparent 25%, rgba(66, 184, 131, 0.5) 93%),
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
  background-repeat: no-repeat, repeat, repeat, repeat, repeat;
}

.dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
  @include checkerboard-bg;
  &__header {
    max-width: 1000px;
    width: 100%;
    margin: 0 auto 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      font:
        800 1.8rem 'Inter',
        sans-serif;
      color: #1a1a1a;
    }
  }
  &__card {
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  &__ws-status {
    max-width: 1000px;
    width: 100%;
    margin: 2rem auto 0;
  }
  &__loader-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  &__status {
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
    &.--error {
      margin-top: 2rem;
    }
  }
}

.ws-status-card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.ws-status__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}
.ws-status__icon {
  font-size: 12px;
  &.--open {
    color: #42b883;
  }
  &.--connecting {
    color: #fbbf24;
    animation: pulse 1.5s infinite;
  }
  &.--closed {
    color: #ef4444;
  }
}
.ws-status__text {
  color: #475569;
  font-weight: 600;
}
.ws-status__controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.ws-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  &:focus {
    outline: none;
    border-color: #42b883;
  }
}
.ws-messages {
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px;
  max-height: 100px;
  overflow-y: auto;
}
.ws-message {
  font-size: 12px;
  color: #64748b;
  padding: 4px 0;
  border-bottom: 1px solid #e2e8f0;
}

.loader-card {
  background: white;
  padding: 30px 50px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  p {
    font-weight: 600;
    color: #475569;
  }
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

.dashboard-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  th {
    padding: 12px 20px;
    background: #f8fafc;
    color: #94a3b8;
    font-size: 0.75rem;
    text-transform: uppercase;
    border-bottom: 1px solid #f1f5f9;
  }
  td {
    padding: 10px 20px;
    border-bottom: 1px solid #f1f5f9;
    color: #475569;
    font-size: 0.9rem;
  }
  tr:hover {
    background: #fdfdfe;
  }
  .--id {
    font-weight: 600;
    color: #cbd5e1;
    width: 60px;
  }
  .--name {
    font-weight: 600;
    color: #1e293b;
  }
}

.btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &.--details {
    background: #f1f5f9;
    color: #475569;
    &:hover {
      color: #42b883;
      transform: translateY(-1px);
    }
  }
  &.--logout {
    background: rgba(255, 255, 255, 0.8);
    color: #ef4444;
    border: 1px solid #fee2e2;
    z-index: 101;
    &:hover {
      background: #fef2f2;
    }
  }
  &.--ws-send {
    background: #42b883;
    color: white;
    &:hover:not(:disabled) {
      background: #3aa876;
    }
    &:disabled {
      opacity: 0.5;
    }
  }
}
</style>
