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
      background-color="var(--blue-deep)"
      text-color="#99b8d4"
      active-text-color="#ffffff"
      router
    >
      <el-menu-item index="/dashboard">
        <el-icon><DataBoard /></el-icon>
        <template #title>运营看板</template>
      </el-menu-item>
      <el-menu-item index="/patient">
        <el-icon><User /></el-icon>
        <template #title>患者档案</template>
      </el-menu-item>
      <el-menu-item index="/alert">
        <el-icon><WarningFilled /></el-icon>
        <template #title>智能预警</template>
      </el-menu-item>
      <el-menu-item index="/consultation">
        <el-icon><ChatDotRound /></el-icon>
        <template #title>线上问诊</template>
      </el-menu-item>
      <el-menu-item index="/assessment">
        <el-icon><List /></el-icon>
        <template #title>评估模块</template>
      </el-menu-item>
      <el-menu-item index="/medication">
        <el-icon><AlarmClock /></el-icon>
        <template #title>服药复诊</template>
      </el-menu-item>
      <el-menu-item index="/education">
        <el-icon><Reading /></el-icon>
        <template #title>健康教育</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import logoImg from '@/assets/logo.png'

const route = useRoute()
</script>

<style scoped>
.sidebar-wrapper {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--blue-deep);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-bottom: 1px solid #0052a3;
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
  line-height: 1.3;
}
.logo-title {
  color: #e0f2fe;
  font-size: 14px;
  font-weight: 700;
}
.logo-sub {
  color: #99b8d4;
  font-size: 12px;
  font-weight: 500;
}
.el-menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
  padding: 6px 0;
}
.el-menu .el-menu-item {
  height: 46px;
  line-height: 46px;
  margin: 2px 10px;
  border-radius: 8px;
  width: auto;
}
.el-menu .el-menu-item.is-active {
  background: var(--blue-mid) !important;
}
.el-menu .el-menu-item:hover {
  background: var(--blue-mid) !important;
}
</style>
