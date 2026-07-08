<template>
  <div class="login-container">
    <div class="login-brand">
      <div class="brand-bg" aria-hidden="true">
        <div class="brand-circle brand-circle--1" />
        <div class="brand-circle brand-circle--2" />
        <div class="brand-circle brand-circle--3" />
      </div>
      <div class="brand-content">
        <div class="brand-icon">
          <el-icon :size="36"><OfficeBuilding /></el-icon>
        </div>
        <h1>苏州市第五人民医院</h1>
        <p class="brand-subtitle">医防融合患者健康管理系统</p>
        <p class="brand-desc">结核病 / HIV 患者全周期健康管理平台</p>
        <div class="brand-tags">
          <span class="brand-tag">患者档案</span>
          <span class="brand-tag">预警管理</span>
          <span class="brand-tag">线上问诊</span>
          <span class="brand-tag">健康教育</span>
        </div>
      </div>
    </div>
    <div class="login-form-panel">
      <div class="login-card">
        <div class="login-header">
          <h2>系统登录</h2>
          <p class="login-subtitle">请使用您的账号登录管理平台</p>
        </div>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="0"
          size="large"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="用户名"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
              :loading="loading"
              class="login-btn"
            >
              {{ loading ? '登录中...' : '登 录' }}
            </el-button>
          </el-form-item>
        </el-form>
        <div class="login-tips">
          <p>演示账号：admin / admin123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, OfficeBuilding } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)
const form = reactive({ username: 'admin', password: 'admin123' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  setTimeout(() => {
    userStore.setUser({ realName: '管理员', role: 'admin' })
    ElMessage.success('登录成功')
    router.push('/dashboard')
    loading.value = false
  }, 800)
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
}

.login-brand {
  flex: 1;
  background: linear-gradient(160deg, #0F172A 0%, #1E293B 50%, #0F766E 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  position: relative;
  overflow: hidden;
}

.brand-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.brand-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}

.brand-circle--1 {
  width: 350px;
  height: 350px;
  background: rgba(45, 212, 191, 0.2);
  top: -80px;
  right: -60px;
}

.brand-circle--2 {
  width: 280px;
  height: 280px;
  background: rgba(99, 102, 241, 0.15);
  bottom: -40px;
  left: -40px;
}

.brand-circle--3 {
  width: 200px;
  height: 200px;
  background: rgba(139, 92, 246, 0.12);
  top: 50%;
  left: 40%;
}

.brand-content {
  text-align: center;
  color: #F1F5F9;
  position: relative;
  z-index: 1;
  max-width: 420px;
}

.brand-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: #2DD4BF;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.brand-content h1 {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 1px;
  line-height: 1.3;
}

.brand-subtitle {
  font-size: 16px;
  margin-top: 14px;
  color: #CBD5E1;
  font-weight: 500;
}

.brand-desc {
  font-size: 13px;
  margin-top: 10px;
  color: #94A3B8;
}

.brand-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 32px;
}

.brand-tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #E2E8F0;
}

.login-form-panel {
  width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 48px;
  position: relative;
}

.login-form-panel::before {
  content: '';
  position: absolute;
  left: 0;
  top: 15%;
  bottom: 15%;
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--border-light), transparent);
}

.login-card {
  width: 100%;
  max-width: 360px;
}

.login-header {
  margin-bottom: 36px;
}

.login-header h2 {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.login-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 8px;
}

.login-btn {
  width: 100%;
  height: 46px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
}

.login-tips {
  text-align: center;
  font-size: 12px;
  color: var(--text-placeholder);
  margin-top: 20px;
  padding: 10px;
  background: #F8FAFC;
  border-radius: 8px;
}
</style>
