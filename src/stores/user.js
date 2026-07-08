import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const savedUser = localStorage.getItem('user')
  const token = ref(localStorage.getItem('token') || 'default')
  const user = ref(savedUser ? JSON.parse(savedUser) : { realName: '管理员', role: 'admin' })

  function setToken(val) {
    token.value = val
    localStorage.setItem('token', val)
  }

  function setUser(val) {
    user.value = val
    localStorage.setItem('user', JSON.stringify(val))
  }

  function logout() {
    token.value = ''
    user.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, setToken, setUser, logout }
})
