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

    <div class="stat-grid dash-stat-grid">
      <el-card
        v-for="item in stats"
        :key="item.label"
        shadow="never"
        class="stat-card dash-stat-card"
        :style="{ '--stat-accent': item.color, '--stat-icon-bg': item.iconBg }"
      >
        <div class="dash-stat-row">
          <div class="dash-stat-info">
            <div class="stat-value" :style="{ color: item.color }">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
            <div class="stat-trend" :style="{ color: item.trend > 0 ? 'var(--color-success)' : item.trend < 0 ? 'var(--color-danger)' : 'var(--text-muted)' }">
              <template v-if="item.trend !== 0">{{ item.trend > 0 ? '↑' : '↓' }} {{ Math.abs(item.trend) }}% 较上月</template>
              <template v-else>与上月持平</template>
            </div>
          </div>
          <div class="stat-icon-wrap">
            <el-icon :size="20"><component :is="item.icon" /></el-icon>
          </div>
        </div>
      </el-card>
    </div>

    <el-row :gutter="16" class="overview-row">
      <el-col :xs="24" :sm="24" :md="16" class="overview-col">
        <el-card shadow="never" class="section-card overview-card">
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

      <el-col :xs="24" :sm="24" :md="8" class="overview-col">
        <el-card shadow="never" class="section-card overview-card">
          <template #header><span>近期预警</span></template>
          <div class="alert-list-body">
          <div v-for="row in pendingAlerts" :key="row.id" class="alert-row">
            <span class="alert-dot" :style="{ background: alertTypeMap[row.type]?.color }" />
            <div class="alert-row-info">
              <span class="alert-row-name">{{ row.patientName }}</span>
              <span class="alert-row-desc">{{ row.content }}</span>
            </div>
            <el-tag :type="alertTypeMap[row.type]?.type" size="small">
              {{ alertTypeMap[row.type]?.label }}
            </el-tag>
          </div>
          <el-empty v-if="!pendingAlerts.length" description="暂无预警" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="section-card">
      <template #header><span>预警记录</span></template>
      <el-table :data="alertLog" size="small">
        <el-table-column prop="patientName" label="患者" min-width="110" />
        <el-table-column label="类型" min-width="110">
          <template #default="{ row }">
            <el-tag :type="alertTypeMap[row.type]?.type" size="small">
              {{ alertTypeMap[row.type]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="240" />
        <el-table-column prop="time" label="时间" min-width="150" />
        <el-table-column label="操作" min-width="80">
          <template #default="{ row }">
            <el-button text size="small" @click="handleCall(row)">已沟通</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { WarningFilled, User, House, FirstAidKit, Plus, DataAnalysis } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

const alertTypeMap = {
  overdue: { label: '逾期未复诊', type: 'danger', color: 'var(--color-danger)' },
  compliance: { label: '依从性下降', type: 'warning', color: 'var(--color-warning)' },
  abnormal: { label: '检查结果异常', type: 'danger', color: 'var(--color-danger)' },
  lost: { label: '即将失访', type: 'info', color: 'var(--color-info)' },
}

const stats = ref([
  { icon: 'User', label: '在管患者总数', value: 128, color: '#5B9BD5', iconBg: '#E8F2FA', trend: 3 },
  { icon: 'House', label: '住院患者', value: 32, color: '#EF5350', iconBg: '#FFEBEE', trend: -2 },
  { icon: 'FirstAidKit', label: '服药依从率', value: '86%', color: '#66BB6A', iconBg: '#E8F5E9', trend: 2 },
  { icon: 'WarningFilled', label: '待处理预警', value: 12, color: '#FFB300', iconBg: '#FFF8E1', trend: -8 },
  { icon: 'Plus', label: '今日新增患者', value: 3, color: '#7BA7D7', iconBg: '#E8F2FA', trend: 0 },
  { icon: 'DataAnalysis', label: '管理完成率', value: '94%', color: '#89CFF0', iconBg: '#E8F2FA', trend: 1 },
])

const barData = ref([
  { label: '住院患者', count: 32, percent: 25, color: '#EF5350' },
  { label: '门诊随访', count: 45, percent: 35, color: '#FFB300' },
  { label: '居家服药', count: 28, percent: 22, color: '#66BB6A' },
  { label: '已结案', count: 10, percent: 8, color: '#64748B' },
  { label: '失访', count: 3, percent: 2, color: '#CBD5E1' },
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
  background: #fff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.welcome-text h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.welcome-text p {
  font-size: 14px;
  color: var(--text-secondary);
}
.welcome-text strong {
  color: var(--color-danger);
  font-weight: 700;
}

.dash-stat-grid {
  grid-template-columns: repeat(3, 1fr);
}

.dash-stat-card :deep(.el-card__body) {
  padding: 16px 18px;
}

.dash-stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dash-stat-info {
  min-width: 0;
  flex: 1;
}

.dash-stat-card .stat-icon-wrap {
  margin: 0;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 10px;
}

.dash-stat-card .stat-value {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
}

.dash-stat-card .stat-label {
  margin-top: 2px;
  font-size: 12px;
}

.stat-trend {
  font-size: 12px;
  margin-top: 4px;
}

@media (max-width: 992px) {
  .dash-stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .dash-stat-grid {
    grid-template-columns: 1fr;
  }
}

.overview-row {
  align-items: stretch;
}
.overview-col {
  display: flex;
  margin-bottom: 16px;
}
.overview-card {
  flex: 1;
  width: 100%;
  margin-bottom: 0 !important;
  display: flex;
  flex-direction: column;
}
.overview-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.bar-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
}
.alert-list-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.bar-label {
  width: 70px;
  font-size: 13px;
  color: var(--text-secondary);
  flex-shrink: 0;
}
.bar-track {
  flex: 1;
  height: 12px;
  background: var(--bg-warm-alt);
  border-radius: 6px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
.bar-value {
  width: 40px;
  font-size: 13px;
  color: var(--text-secondary);
  text-align: right;
}
.alert-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
}
.alert-row + .alert-row {
  border-top: 1px solid var(--border-light);
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
  color: var(--text-primary);
}
.alert-row-desc {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
