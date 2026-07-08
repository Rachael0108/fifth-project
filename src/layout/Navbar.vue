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
        <el-button text :icon="Bell" class="nav-icon-btn" @click="$router.push('/alert')" />
      </el-badge>
      <el-dropdown trigger="click">
        <span class="user-info">
          <el-avatar :size="34" class="user-avatar">
            {{ userStore.user.realName?.charAt(0) || '管' }}
          </el-avatar>
          <span class="user-name">{{ userStore.user.realName || '管理员' }}</span>
          <el-icon class="arrow-icon"><ArrowDown /></el-icon>
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
  border-bottom: 1px solid var(--border-light);
  height: var(--navbar-height);
  position: sticky;
  top: 0;
  z-index: 10;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mr-12 { margin-right: 4px; }

.nav-icon-btn {
  font-size: 20px;
  color: var(--text-secondary);
  width: 38px;
  height: 38px;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.nav-icon-btn:hover {
  background: #F1F5F9;
  color: var(--el-color-primary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}

.user-info:hover {
  background: #F5F6F8;
}

.user-avatar {
  background: var(--el-color-primary);
  font-size: 13px;
}

.user-name {
  font-size: 14px;
  color: var(--text-regular);
  font-weight: 600;
}

.arrow-icon {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
