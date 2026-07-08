<template>
  <el-header class="navbar">
    <div class="navbar-left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="navbar-right">
      <el-badge :value="unreadAlerts" :hidden="!unreadAlerts" class="mr-12">
        <el-button text :icon="Bell" style="font-size: 18px" @click="$router.push('/alert')" />
      </el-badge>
      <el-dropdown trigger="click">
        <span class="user-info">
          <el-avatar :size="30" style="background: linear-gradient(135deg, #0066cc, #3399ff)">
            {{ userStore.user.realName?.charAt(0) || '管' }}
          </el-avatar>
          <span class="user-name">{{ userStore.user.realName || '管理员' }}</span>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bell, ArrowDown, SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const unreadAlerts = ref(4)

function handleLogout() {
  localStorage.clear()
  location.reload()
}
</script>

<style scoped>
.navbar {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  height: var(--navbar-height, 50px);
}
.navbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.mr-12 { margin-right: 12px; }
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}
.user-info:hover {
  background: #f0f7ff;
}
.user-name {
  font-size: 14px;
  color: var(--text-regular, #1a3a5c);
}
</style>
