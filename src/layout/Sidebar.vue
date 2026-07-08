<template>
  <div class="sidebar-wrapper">
    <div class="logo">
      <img :src="logoImg" alt="logo" class="logo-img" />
      <div class="logo-text">
        <span class="logo-title">苏州市第五人民医院</span>
        <span class="logo-sub">医防融合系统</span>
      </div>
    </div>
    <el-menu
      :default-active="route.path"
      background-color="transparent"
      text-color="var(--sidebar-text)"
      active-text-color="var(--sidebar-text-active)"
      router
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
import { useRoute } from 'vue-router'
import logoImg from '@/assets/logo.png'

const route = useRoute()

const menuItems = [
  { index: '/dashboard', icon: 'DataBoard', title: '运营看板' },
  { index: '/patient', icon: 'User', title: '患者档案' },
  { index: '/alert', icon: 'WarningFilled', title: '预警管理' },
  { index: '/consultation', icon: 'ChatDotRound', title: '线上问诊' },
  { index: '/assessment', icon: 'List', title: '评估模块' },
  { index: '/medication', icon: 'AlarmClock', title: '服药复诊' },
  { index: '/education', icon: 'Reading', title: '健康教育' },
]
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
}

.logo {
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--sidebar-border);
  padding: 0 16px;
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
  padding: 8px;
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
</style>
