<template>
  <div
    class="sidebar-wrapper"
    :class="{
      'is-collapsed': layoutStore.collapsed && !layoutStore.isMobile,
      'is-mobile': layoutStore.isMobile,
      'is-open': layoutStore.mobileOpen,
    }"
  >
    <div class="logo">
      <img :src="logoImg" alt="logo" class="logo-img" />
      <div v-show="showText" class="logo-text">
        <span class="logo-title">苏州市第五人民医院</span>
        <span class="logo-sub">医防融合系统</span>
      </div>
    </div>
    <el-menu
      :default-active="route.path"
      :collapse="layoutStore.collapsed && !layoutStore.isMobile"
      background-color="transparent"
      text-color="var(--sidebar-text)"
      active-text-color="var(--sidebar-text-active)"
      router
      @select="onSelect"
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.index"
        :index="item.index"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import logoImg from '@/assets/logo.png'
import { useLayoutStore } from '@/stores/layout'

const route = useRoute()
const layoutStore = useLayoutStore()

const showText = computed(() => layoutStore.isMobile || !layoutStore.collapsed)

const menuItems = [
  { index: '/dashboard', icon: 'DataBoard', title: '运营看板' },
  { index: '/patient', icon: 'User', title: '患者档案' },
  { index: '/alert', icon: 'WarningFilled', title: '预警管理' },
  { index: '/consultation', icon: 'ChatDotRound', title: '线上问诊' },
  { index: '/assessment', icon: 'List', title: '评估模块' },
  { index: '/medication', icon: 'AlarmClock', title: '服药复诊' },
  { index: '/education', icon: 'Reading', title: '健康教育' },
]

function onSelect() {
  if (layoutStore.isMobile) layoutStore.closeMobile()
}
</script>

<style scoped>
.sidebar-wrapper {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  transition: width 0.25s ease, transform 0.25s ease;
  overflow: hidden;
}

.sidebar-wrapper.is-collapsed {
  width: var(--sidebar-width-collapsed);
  --el-menu-base-level-padding: 0px;
  --el-menu-icon-width: 24px;
}

.sidebar-wrapper.is-mobile {
  transform: translateX(-100%);
  width: var(--sidebar-width);
  box-shadow: var(--shadow-md);
}

.sidebar-wrapper.is-mobile.is-open {
  transform: translateX(0);
}

.logo {
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--sidebar-border);
  padding: 0 16px;
  flex-shrink: 0;
}

.sidebar-wrapper.is-collapsed .logo {
  justify-content: center;
  padding: 0 8px;
}

.logo-img {
  height: 28px;
  width: auto;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
  min-width: 0;
}

.logo-title {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logo-sub {
  color: var(--text-muted);
  font-size: 11px;
}

.el-menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px;
}

.el-menu:not(.el-menu--collapse) {
  width: 100%;
}

.el-menu .el-menu-item {
  height: 42px;
  line-height: 42px;
  margin: 2px 0;
  border-radius: var(--radius-sm);
  width: auto;
  font-size: 14px;
  transition: background 0.2s;
}

.el-menu .el-menu-item:hover {
  background: var(--sidebar-hover) !important;
}

.el-menu .el-menu-item.is-active {
  background: var(--sidebar-active) !important;
  color: var(--sidebar-text-active) !important;
  font-weight: 500;
}

.el-menu .el-menu-item .el-icon {
  font-size: 17px;
}

/* 折叠态：覆盖 Element Plus 默认左偏样式，图标水平居中 */
.sidebar-wrapper.is-collapsed .el-menu {
  padding: 8px 0;
}

.sidebar-wrapper.is-collapsed :deep(.el-menu--collapse) {
  width: 100% !important;
  padding: 8px 0;
}

.sidebar-wrapper.is-collapsed :deep(.el-menu--collapse .el-menu-item) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 !important;
  margin: 2px 6px;
  width: auto;
}

.sidebar-wrapper.is-collapsed :deep(.el-menu--collapse .el-menu-tooltip__trigger) {
  position: static;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 !important;
}

.sidebar-wrapper.is-collapsed :deep(.el-menu--collapse .el-menu-item .el-icon) {
  margin: 0 !important;
  width: auto !important;
}
</style>
