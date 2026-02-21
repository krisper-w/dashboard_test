import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../types'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const setUsers = (data: User[]) => {
    users.value = data
  }

  return { users, loading, error, setUsers }
})
