<template>
  <el-container class="app-container">
    <Sidebar />
    <div
      v-if="layoutStore.isMobile && layoutStore.mobileOpen"
      class="sidebar-mask"
      @click="layoutStore.closeMobile()"
    />
    <el-container class="right-panel" :style="{ marginLeft: layoutStore.sidebarOffset }">
      <Navbar />
      <el-main class="app-main">
        <div class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()
let removeResize = null

onMounted(() => {
  removeResize = layoutStore.initResizeListener()
})

onUnmounted(() => {
  removeResize?.()
})
</script>

<style scoped>
.app-container {
  height: 100vh;
}

.right-panel {
  flex-direction: column;
  transition: margin-left 0.25s ease;
  min-width: 0;
}

.app-main {
  background: var(--bg-page);
  padding: 20px 24px;
  overflow-y: auto;
  height: calc(100vh - var(--navbar-height));
  display: flex;
  flex-direction: column;
}

.main-content {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-mask {
  position: fixed;
  inset: 0;
  background: rgba(62, 39, 35, 0.35);
  z-index: 99;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 992px) {
  .app-main {
    padding: 16px;
  }
}
</style>
