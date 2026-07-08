<template>
  <div class="alert-list">
    <div class="page-header">
      <h2>智能预警</h2>
      <el-select v-model="filterType" placeholder="筛选类型" clearable style="width: 160px">
        <el-option label="全部类型" value="" />
        <el-option label="逾期未复诊" value="overdue" />
        <el-option label="服药依从性下降" value="compliance" />
        <el-option label="检查结果异常" value="abnormal" />
        <el-option label="即将失访" value="lost" />
      </el-select>
    </div>

    <div class="stat-grid">
      <el-card v-for="s in alertStats" :key="s.label" shadow="never" class="stat-card" @click="filterType = s.key">
        <div class="stat-value" :style="{ color: s.color }">{{ s.count }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </el-card>
    </div>

    <div class="alert-cards">
      <transition-group name="list">
        <div v-for="alert in filteredAlerts" :key="alert.id" class="alert-card" :style="{ borderLeftColor: alertTypeMap[alert.type]?.color }">
          <div class="alert-top">
            <div class="alert-left">
              <div class="alert-icon" :style="{ background: alertTypeMap[alert.type]?.color + '18', color: alertTypeMap[alert.type]?.color }">
                <el-icon :size="20">
                  <component :is="alertTypeMap[alert.type]?.icon" />
                </el-icon>
              </div>
              <div class="alert-meta">
                <span class="alert-name">{{ alert.patientName }}</span>
                <el-tag :type="alertTypeMap[alert.type]?.tag" size="small" round>
                  {{ alertTypeMap[alert.type]?.label }}
                </el-tag>
              </div>
            </div>
            <span class="alert-time">{{ alert.time }}</span>
          </div>
          <div class="alert-content">{{ alert.content }}</div>
          <div class="alert-actions">
            <el-button size="small" type="primary" :icon="Phone" @click="handleCall(alert)">
              一键拨号
            </el-button>
            <el-button size="small" :icon="Select" @click="handleProcess(alert)">
              已沟通
            </el-button>
            <span class="alert-urgency" :style="{ color: alertTypeMap[alert.type]?.color }">
              ● {{ alertTypeMap[alert.type]?.urgency }}
            </span>
          </div>
        </div>
      </transition-group>
      <el-empty v-if="!filteredAlerts.length" description="暂无符合条件的预警" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Phone, Select, WarningFilled, Clock, InfoFilled, RemoveFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const filterType = ref('')

const alertTypeMap = {
  overdue: { label: '逾期未复诊', tag: 'danger', icon: 'Clock', color: '#e53e3e', urgency: '紧急' },
  compliance: { label: '依从性下降', tag: 'warning', icon: 'WarningFilled', color: '#d69e2e', urgency: '关注' },
  abnormal: { label: '检查结果异常', tag: 'danger', icon: 'InfoFilled', color: '#e53e3e', urgency: '紧急' },
  lost: { label: '即将失访', tag: 'info', icon: 'RemoveFilled', color: '#718096', urgency: '一般' },
}

const alertStats = ref([
  { key: 'overdue', label: '逾期未复诊', count: 4, color: '#e53e3e' },
  { key: 'compliance', label: '依从性下降', count: 4, color: '#d69e2e' },
  { key: 'abnormal', label: '检查结果异常', count: 2, color: '#e53e3e' },
  { key: 'lost', label: '即将失访', count: 2, color: '#718096' },
])

const alerts = ref([
  { id: 1, patientName: '陈建国', type: 'overdue', content: '超过预约复诊时间 5 天，请及时联系患者确认情况', time: '2026-07-06 10:30', phone: '13800001111' },
  { id: 2, patientName: '王丽华', type: 'compliance', content: '连续 2 天未在小程序打卡服药，可能存在漏服风险', time: '2026-07-07 08:15', phone: '13800002222' },
  { id: 3, patientName: '刘志强', type: 'abnormal', content: '痰涂片结果由阴性转为阳性，提示治疗可能失败', time: '2026-07-07 14:20', phone: '13800003333' },
  { id: 4, patientName: '张秀英', type: 'lost', content: '连续 7 天未登录小程序，电话未接通，存在失访风险', time: '2026-07-08 09:00', phone: '13800004444' },
  { id: 5, patientName: '李明辉', type: 'compliance', content: '连续 3 天未服药打卡，依从性持续下降', time: '2026-07-08 11:00', phone: '13800005555' },
  { id: 6, patientName: '周美玲', type: 'overdue', content: '超过复诊时间 4 天，请尽快联系安排复诊', time: '2026-07-05 16:40', phone: '13800006666' },
])

const filteredAlerts = computed(() => {
  if (!filterType.value) return alerts.value
  return alerts.value.filter((a) => a.type === filterType.value)
})

function handleCall(alert) {
  ElMessage.success({ message: `正在呼叫 ${alert.patientName}（${alert.phone}）`, duration: 3000 })
}
function handleProcess(alert) {
  ElMessage.success(`已标记：与 ${alert.patientName} 沟通完成`)
  alerts.value = alerts.value.filter((a) => a.id !== alert.id)
}
</script>

<style scoped>
.alert-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;
}
.alert-card {
  background: #fff;
  border-radius: var(--radius-card);
  padding: 18px 20px;
  border: 1px solid #c8dce8;
  border-left: 4px solid;
  transition: box-shadow 0.2s, transform 0.2s;
}
.alert-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}
.alert-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}
.alert-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.alert-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.alert-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.alert-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--text-primary, #0a2d4d);
}
.alert-time {
  font-size: 12px;
  color: var(--text-placeholder, #7a9ab5);
  white-space: nowrap;
}
.alert-content {
  font-size: 14px;
  color: var(--text-secondary, #2c5282);
  line-height: 1.5;
  margin-bottom: 14px;
  padding-left: 48px;
}
.alert-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 48px;
}
.alert-urgency {
  font-size: 12px;
  margin-left: auto;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
