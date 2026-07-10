<template>
  <div class="patient-list">
    <div class="page-header">
      <h2>患者档案</h2>
      <div class="header-actions">
        <el-input
          v-model="searchName"
          placeholder="姓名"
          clearable
          :prefix-icon="Search"
          class="search-input"
        />
        <el-input
          v-model="searchRecordNo"
          placeholder="病历号"
          clearable
          :prefix-icon="Document"
          class="search-input"
        />
        <el-input
          v-model="searchPhone"
          placeholder="联系电话"
          clearable
          :prefix-icon="Phone"
          class="search-input"
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
      <el-card
        v-for="s in patientStats"
        :key="s.label"
        shadow="never"
        class="stat-card"
        :style="{ '--stat-accent': s.color, '--stat-icon-bg': s.iconBg }"
      >
        <div class="stat-value" :style="{ color: s.color }">{{ s.count }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </el-card>
    </div>

    <el-card shadow="never" class="section-card">
      <el-table :data="filteredPatients" size="small">
        <el-table-column label="姓名" min-width="180">
          <template #default="{ row }">
            <div class="name-cell">
              <el-avatar :size="28" :style="{ background: row.avatarColor }">{{ row.name.charAt(0) }}</el-avatar>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" min-width="120" />
        <el-table-column prop="hospitalId" label="病历号" min-width="120" />
        <el-table-column prop="gender" label="性别" min-width="60" />
        <el-table-column prop="age" label="年龄" min-width="60" />
        <el-table-column prop="diagnosis" label="诊断" min-width="160" />
        <el-table-column prop="nextFollowUp" label="下次随访" min-width="110" />
        <el-table-column prop="nurse" label="责任护士" min-width="100" />
        <el-table-column label="分类" min-width="90">
          <template #default="{ row }">
            <el-tag :type="categoryMap[row.category]?.tag" size="small">{{ categoryMap[row.category]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="$router.push(`/patient/${row.id}`)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Document, Phone, Refresh } from '@element-plus/icons-vue'

const searchName = ref('')
const searchRecordNo = ref('')
const searchPhone = ref('')
const filterCategory = ref('')

const patientStats = ref([
  { key: 'inpatient', label: '住院患者', count: 32, color: '#F43F5E', iconBg: '#FFE4E6' },
  { key: 'outpatient', label: '门诊随访', count: 45, color: '#F59E0B', iconBg: '#FEF3C7' },
  { key: 'home', label: '居家服药', count: 28, color: '#10B981', iconBg: '#D1FAE5' },
  { key: 'closed', label: '已结案', count: 10, color: '#64748B', iconBg: '#F1F5F9' },
])

const patients = ref([
  { id: 1, name: '陈建国', hospitalId: '20240001', phone: '13800001111', gender: '男', age: 45, diagnosis: '肺结核（初治）', category: 'inpatient', nextFollowUp: '2026-07-15', nurse: '王护士', avatarColor: '#7BA7D7' },
  { id: 2, name: '王丽华', hospitalId: '20240002', phone: '13800002222', gender: '女', age: 32, diagnosis: 'HIV 感染', category: 'outpatient', nextFollowUp: '2026-07-20', nurse: '张护士', avatarColor: '#89CFF0' },
  { id: 3, name: '刘志强', hospitalId: '20240003', phone: '13800003333', gender: '男', age: 28, diagnosis: '耐多药结核', category: 'home', nextFollowUp: '2026-07-12', nurse: '李护士', avatarColor: '#7EC8B8' },
  { id: 4, name: '张秀英', hospitalId: '20240004', phone: '13800004444', gender: '女', age: 55, diagnosis: 'HIV 合并乙肝', category: 'outpatient', nextFollowUp: '2026-07-25', nurse: '刘护士', avatarColor: '#B8A9D4' },
  { id: 5, name: '李明辉', hospitalId: '20240005', phone: '13800005555', gender: '男', age: 38, diagnosis: '肺结核（复治）', category: 'home', nextFollowUp: '2026-07-18', nurse: '李护士', avatarColor: '#F4A896' },
  { id: 6, name: '赵秀梅', hospitalId: '20240006', phone: '13800006666', gender: '女', age: 51, diagnosis: 'HIV 感染', category: 'inpatient', nextFollowUp: '2026-07-22', nurse: '王护士', avatarColor: '#E899A8' },
  { id: 7, name: '孙志伟', hospitalId: '20240007', phone: '13800007777', gender: '男', age: 29, diagnosis: '肺结核（初治）', category: 'home', nextFollowUp: '2026-07-10', nurse: '刘护士', avatarColor: '#6BA3D6' },
  { id: 8, name: '吴德明', hospitalId: '20240008', phone: '13800008888', gender: '男', age: 63, diagnosis: '耐多药结核', category: 'closed', nextFollowUp: '-', nurse: '张护士', avatarColor: '#95C9A8' },
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
  if (searchName.value) {
    const name = searchName.value.trim()
    list = list.filter((p) => p.name.includes(name))
  }
  if (searchRecordNo.value) {
    const recordNo = searchRecordNo.value.trim()
    list = list.filter((p) => p.hospitalId.includes(recordNo))
  }
  if (searchPhone.value) {
    const phone = searchPhone.value.trim()
    list = list.filter((p) => p.phone.includes(phone))
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
.search-input {
  width: 160px;
}
</style>
