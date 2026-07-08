import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAdvancedStore = defineStore(
  'persist-advanced',
  () => {
    const loginState = ref<{ status: string; lastLogin: string }>({
      status: 'offline',
      lastLogin: '',
    })
    const preferences = ref<{ theme: string; lang: string }>({
      theme: 'light',
      lang: 'zh-CN',
    })
    const sensitiveData = ref<{ token: string; password: string }>({
      token: '',
      password: '',
    })

    return { loginState, preferences, sensitiveData }
  },
  {
    persist: [
      {
        key: 'persist-advanced',
        storage: sessionStorage,
        pick: ['loginState'],
      },
      {
        key: 'persist-advanced-prefs',
        storage: localStorage,
        pick: ['preferences'],
      },
    ],
  },
)
