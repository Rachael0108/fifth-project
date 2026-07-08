<template>
  <div class="dashboard">
    <div class="welcome-banner">
      <div class="welcome-text">
        <h2>上午好，{{ userStore.user.realName || '管理员' }}</h2>
        <p>{{ today }} · 今日有 <strong>{{ pendingAlerts.length }}</strong> 条预警待处理</p>
      </div>
      <el-button type="primary" :icon="WarningFilled" @click="$router.push('/alert')">
        查看预警
      </el-button>
    </div>

    <div class="stat-grid">
      <el-card v-for="item in stats" :key="item.label" shadow="never" class="stat-card">
        <div class="stat-icon">{{ item.icon }}</div>
        <div class="stat-value" :style="{ color: item.color }">{{ item.value }}</div>
        <div class="stat-label">{{ item.label }}</div>
        <div class="stat-trend" :style="{ color: item.trend > 0 ? '#38a169' : '#e53e3e' }">
          {{ item.trend > 0 ? '↑' : '↓' }} {{ Math.abs(item.trend) }}% 较上月
        </div>
      </el-card>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16">
        <el-card shadow="never" class="section-card">
          <template #header><span>管理指标总览</span></template>
          <div class="bar-chart">
            <div v-for="bar in barData" :key="bar.label" class="bar-row">
              <span class="bar-label">{{ bar.label }}</span>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: bar.percent + '%', background: bar.color }" />
              </div>
              <span class="bar-value">{{ bar.count }}人</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="8">
        <el-card shadow="never" class="section-card">
          <template #header><span>近期预警</span></template>
          <div v-for="row in pendingAlerts" :key="row.id" class="alert-row">
            <span class="alert-dot" :style="{ background: alertTypeMap[row.type]?.color }" />
            <div class="alert-row-info">
              <span class="alert-row-name">{{ row.patientName }}</span>
              <span class="alert-row-desc">{{ row.content }}</span>
            </div>
            <el-tag :type="alertTypeMap[row.type]?.type" size="small" round>
              {{ alertTypeMap[row.type]?.label }}
            </el-tag>
          </div>
          <el-empty v-if="!pendingAlerts.length" description="暂无预警" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="section-card">
      <template #header><span>预警记录</span></template>
      <el-table :data="alertLog" stripe size="small">
        <el-table-column prop="patientName" label="患者" width="110" />
        <el-table-column label="类型" width="110">
          <template #default="{ row }">
            <el-tag :type="alertTypeMap[row.type]?.type" size="small" round>
              {{ alertTypeMap[row.type]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="240" />
        <el-table-column prop="time" label="时间" width="150" />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button text size="small" @click="handleCall(row)">已沟通</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

const alertTypeMap = {
  overdue: { label: '逾期未复诊', type: 'danger', color: '#e53e3e' },
  compliance: { label: '依从性下降', type: 'warning', color: '#d69e2e' },
  abnormal: { label: '检查结果异常', type: 'danger', color: '#e53e3e' },
  lost: { label: '即将失访', type: 'info', color: '#718096' },
}

const stats = ref([
  { icon: '👥', label: '在管患者总数', value: 128, color: '#0066cc', trend: 3 },
  { icon: '🏥', label: '住院患者', value: 32, color: '#e53e3e', trend: -2 },
  { icon: '💊', label: '服药依从率', value: '86%', color: '#38a169', trend: 2 },
  { icon: '⚠️', label: '待处理预警', value: 12, color: '#d69e2e', trend: -8 },
  { icon: '➕', label: '今日新增患者', value: 3, color: '#0066cc', trend: 0 },
  { icon: '📊', label: '管理完成率', value: '94%', color: '#38a169', trend: 1 },
])

const barData = ref([
  { label: '住院患者', count: 32, percent: 25, color: '#e53e3e' },
  { label: '门诊随访', count: 45, percent: 35, color: '#d69e2e' },
  { label: '居家服药', count: 28, percent: 22, color: '#38a169' },
  { label: '已结案', count: 10, percent: 8, color: '#718096' },
  { label: '失访', count: 3, percent: 2, color: '#a0aec0' },
])

const alertStats = ref([
  { label: '逾期未复诊', count: 4, color: '#e53e3e', total: 12 },
  { label: '依从性下降', count: 4, color: '#d69e2e', total: 12 },
  { label: '检查结果异常', count: 2, color: '#e53e3e', total: 12 },
  { label: '即将失访', count: 2, color: '#718096', total: 12 },
])

const pendingAlerts = ref([
  { id: 1, patientName: '陈建国', type: 'overdue', content: '超过复诊时间 5 天', time: '2026-07-06 10:30', phone: '13800001111' },
  { id: 2, patientName: '王丽华', type: 'compliance', content: '连续 2 天未打卡服药', time: '2026-07-07 08:15', phone: '13800002222' },
  { id: 3, patientName: '刘志强', type: 'abnormal', content: '痰涂片结果转为阳性', time: '2026-07-07 14:20', phone: '13800003333' },
  { id: 4, patientName: '张秀英', type: 'lost', content: '7 天未登录且电话未通', time: '2026-07-08 09:00', phone: '13800004444' },
])

const alertLog = ref([
  { id: 1, patientName: '陈建国', type: 'overdue', content: '超过复诊时间 5 天', time: '2026-07-06 10:30' },
  { id: 2, patientName: '王丽华', type: 'compliance', content: '连续 2 天未打卡服药', time: '2026-07-07 08:15' },
  { id: 3, patientName: '刘志强', type: 'abnormal', content: '痰涂片结果转为阳性', time: '2026-07-07 14:20' },
  { id: 4, patientName: '张秀英', type: 'lost', content: '7 天未登录且电话未通', time: '2026-07-08 09:00' },
])

function handleCall(row) {
  ElMessage.success(`已记录：与 ${row.patientName} 沟通完成`)
}
</script>

<style scoped>
.welcome-banner {
  background: linear-gradient(135deg, #0066cc, #3399ff);
  border-radius: var(--radius-card);
  padding: 24px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: #fff;
}
.welcome-text h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 6px;
}
.welcome-text p {
  font-size: 14px;
  opacity: 0.9;
}
.welcome-text strong {
  font-weight: 700;
}
.stat-trend {
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 0;
}
.bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.bar-label {
  width: 70px;
  font-size: 13px;
  color: var(--text-secondary, #2c5282);
  flex-shrink: 0;
}
.bar-track {
  flex: 1;
  height: 14px;
  background: #e0f2fe;
  border-radius: 7px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 7px;
  transition: width 0.6s ease;
}
.bar-value {
  width: 40px;
  font-size: 13px;
  color: var(--text-secondary, #2c5282);
  text-align: right;
}
.alert-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
}
.alert-row + .alert-row {
  border-top: 1px solid #c8dce8;
}
.alert-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}
.alert-row-info {
  flex: 1;
  min-width: 0;
}
.alert-row-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #0a2d4d);
}
.alert-row-desc {
  display: block;
  font-size: 12px;
  color: var(--text-muted, #4a7a9a);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
