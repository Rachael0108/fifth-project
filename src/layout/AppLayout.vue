<template>
  <el-container class="app-container">
    <Sidebar />
    <el-container class="right-panel">
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
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
</script>

<style scoped>
.app-container {
  height: 100vh;
}

.right-panel {
  margin-left: var(--sidebar-width);
  flex-direction: column;
}

.app-main {
  background: var(--bg-page);
  padding: 20px 24px;
  overflow-y: auto;
  height: calc(100vh - var(--navbar-height));
}

.main-content {
  max-width: 1440px;
  margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
