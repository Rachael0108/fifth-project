import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const MOBILE_BREAKPOINT = 992

export const useLayoutStore = defineStore('layout', () => {
  const collapsed = ref(false)
  const mobileOpen = ref(false)
  const isMobile = ref(false)

  const sidebarOffset = computed(() => {
    if (isMobile.value) return '0px'
    return collapsed.value ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)'
  })

  function toggleCollapsed() {
    if (isMobile.value) {
      mobileOpen.value = !mobileOpen.value
    } else {
      collapsed.value = !collapsed.value
    }
  }

  function closeMobile() {
    mobileOpen.value = false
  }

  function checkMobile() {
    const next = window.innerWidth < MOBILE_BREAKPOINT
    if (next !== isMobile.value) {
      isMobile.value = next
      if (!next) mobileOpen.value = false
    }
  }

  function initResizeListener() {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }

  return {
    collapsed,
    mobileOpen,
    isMobile,
    sidebarOffset,
    toggleCollapsed,
    closeMobile,
    checkMobile,
    initResizeListener,
  }
})
