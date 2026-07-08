<template>
  <div class="patient-list">
    <div class="page-header">
      <h2>患者档案</h2>
      <div class="header-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索姓名 / 住院号"
          clearable
          :prefix-icon="Search"
          style="width: 220px"
        />
        <el-select v-model="filterCategory" placeholder="患者分类" clearable style="width: 150px">
          <el-option label="全部患者" value="" />
          <el-option label="住院患者" value="inpatient" />
          <el-option label="门诊随访" value="outpatient" />
          <el-option label="居家服药" value="home" />
          <el-option label="已结案" value="closed" />
        </el-select>
        <el-button type="primary" :icon="Refresh">同步数据</el-button>
      </div>
    </div>

    <div class="stat-grid">
      <el-card v-for="s in patientStats" :key="s.label" shadow="never" class="stat-card">
        <div class="stat-value" :style="{ color: s.color }">{{ s.count }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </el-card>
    </div>

    <el-card shadow="never" class="section-card">
      <el-table :data="filteredPatients" stripe size="small">
        <el-table-column label="姓名" width="180">
          <template #default="{ row }">
            <div class="name-cell">
              <el-avatar :size="28" :style="{ background: row.avatarColor }">{{ row.name.charAt(0) }}</el-avatar>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="hospitalId" label="住院号" width="120" />
        <el-table-column prop="gender" label="性别" width="60" />
        <el-table-column prop="age" label="年龄" width="60" />
        <el-table-column prop="diagnosis" label="诊断" min-width="160" />
        <el-table-column prop="nextFollowUp" label="下次随访" width="110" />
        <el-table-column prop="nurse" label="责任护士" width="100" />
        <el-table-column label="分类" width="90">
          <template #default="{ row }">
            <el-tag :type="categoryMap[row.category]?.tag" size="small" round>{{ categoryMap[row.category]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button text size="small" @click="$router.push(`/patient/${row.id}`)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const filterCategory = ref('')

const patientStats = ref([
  { key: 'inpatient', label: '住院患者', count: 32, color: '#e53e3e' },
  { key: 'outpatient', label: '门诊随访', count: 45, color: '#d69e2e' },
  { key: 'home', label: '居家服药', count: 28, color: '#38a169' },
  { key: 'closed', label: '已结案', count: 10, color: '#718096' },
])

const patients = ref([
  { id: 1, name: '陈建国', hospitalId: '20240001', gender: '男', age: 45, diagnosis: '肺结核（初治）', category: 'inpatient', nextFollowUp: '2026-07-15', nurse: '王护士', avatarColor: '#e53e3e' },
  { id: 2, name: '王丽华', hospitalId: '20240002', gender: '女', age: 32, diagnosis: 'HIV 感染', category: 'outpatient', nextFollowUp: '2026-07-20', nurse: '张护士', avatarColor: '#d69e2e' },
  { id: 3, name: '刘志强', hospitalId: '20240003', gender: '男', age: 28, diagnosis: '耐多药结核', category: 'home', nextFollowUp: '2026-07-12', nurse: '李护士', avatarColor: '#38a169' },
  { id: 4, name: '张秀英', hospitalId: '20240004', gender: '女', age: 55, diagnosis: 'HIV 合并乙肝', category: 'outpatient', nextFollowUp: '2026-07-25', nurse: '刘护士', avatarColor: '#d69e2e' },
  { id: 5, name: '李明辉', hospitalId: '20240005', gender: '男', age: 38, diagnosis: '肺结核（复治）', category: 'home', nextFollowUp: '2026-07-18', nurse: '李护士', avatarColor: '#38a169' },
  { id: 6, name: '赵秀梅', hospitalId: '20240006', gender: '女', age: 51, diagnosis: 'HIV 感染', category: 'inpatient', nextFollowUp: '2026-07-22', nurse: '王护士', avatarColor: '#e53e3e' },
  { id: 7, name: '孙志伟', hospitalId: '20240007', gender: '男', age: 29, diagnosis: '肺结核（初治）', category: 'home', nextFollowUp: '2026-07-10', nurse: '刘护士', avatarColor: '#38a169' },
  { id: 8, name: '吴德明', hospitalId: '20240008', gender: '男', age: 63, diagnosis: '耐多药结核', category: 'closed', nextFollowUp: '-', nurse: '张护士', avatarColor: '#718096' },
])

const categoryMap = {
  inpatient: { label: '住院患者', tag: 'danger' },
  outpatient: { label: '门诊随访', tag: 'warning' },
  home: { label: '居家服药', tag: 'success' },
  closed: { label: '已结案', tag: 'info' },
}

const filteredPatients = computed(() => {
  let list = patients.value
  if (filterCategory.value) {
    list = list.filter((p) => p.category === filterCategory.value)
  }
  if (searchKeyword.value) {
    const kw = searchKeyword.value.trim().toLowerCase()
    list = list.filter((p) => p.name.includes(kw) || p.hospitalId.includes(kw))
  }
  return list
})
</script>

<style scoped>
.name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}
.header-actions {
  display: flex;
  gap: 12px;
}
</style>
