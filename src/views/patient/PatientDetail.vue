<template>
  <div class="patient-detail" v-loading="loading">
    <div class="page-header">
      <el-button text :icon="ArrowLeft" @click="goBack">返回列表</el-button>
      <el-button type="primary" size="small" :icon="Edit">编辑档案</el-button>
    </div>

    <el-row :gutter="16" class="detail-row">
      <el-col :xs="24" :sm="24" :md="8" class="detail-col">
        <el-card shadow="never" class="section-card profile-card">
          <template #header>
            <div class="profile-header">
              <el-avatar :size="48" class="profile-avatar" :style="{ background: patient.avatarColor }">{{ patient.name.charAt(0) }}</el-avatar>
              <div>
                <div class="profile-name">{{ patient.name }}</div>
                <div class="profile-id">病历号: {{ patient.hospitalId }}</div>
              </div>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item"><label>性别</label><span>{{ patient.gender }}</span></div>
            <div class="info-item"><label>年龄</label><span>{{ patient.age }} 岁</span></div>
            <div class="info-item"><label>联系电话</label><span>{{ patient.phone }}</span></div>
            <div class="info-item"><label>诊断</label><span>{{ patient.diagnosis }}</span></div>
            <div class="info-item"><label>治疗方案</label><span>{{ patient.treatmentPlan }}</span></div>
            <div class="info-item"><label>责任护士</label><span>{{ patient.nurse }}</span></div>
            <div class="info-item"><label>主管医生</label><span>{{ patient.doctor }}</span></div>
            <div class="info-item"><label>下次随访</label><span>{{ patient.nextFollowUp }}</span></div>
            <div class="info-item">
              <label>管理状态</label>
              <span><el-tag size="small" :type="patient.statusTag" style="color: #f00;">{{ patient.statusLabel }}</el-tag></span>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="section-card contacts-card">
          <template #header>
            <span>密切接触者</span>
            <el-button text type="primary" size="small">管理</el-button>
          </template>
          <div class="contacts-body">
            <div v-for="c in contacts" :key="c.name" class="contact-row">
              <el-avatar :size="28" :style="{ background: c.avatarColor }">{{ c.name.charAt(0) }}</el-avatar>
              <div class="contact-info">
                <span>{{ c.name }}</span>
                <span class="contact-rel">{{ c.relation }}</span>
              </div>
              <el-tag
                :type="c.screeningStatus === 'done' ? 'success' : 'warning'"
                size="small"
              >
                {{ c.screeningStatus === 'done' ? '已筛查' : '待筛查' }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="16" class="detail-col">
        <el-card shadow="never" class="section-card">
          <template #header><span>治疗时间轴</span></template>
          <el-timeline>
            <el-timeline-item
              v-for="(event, idx) in timeline"
              :key="idx"
              :timestamp="event.time"
              :type="event.type"
              :size="idx === 0 ? 'large' : 'normal'"
              :hollow="idx !== 0"
            >
              <div class="tl-title">{{ event.title }}</div>
              <div v-if="event.desc" class="tl-desc">{{ event.desc }}</div>
            </el-timeline-item>
          </el-timeline>
        </el-card>

        <el-card shadow="never" class="section-card lab-card">
          <template #header><span>历次检查结果</span></template>
          <el-table :data="labResults" size="small">
            <el-table-column prop="date" label="日期" min-width="110" />
            <el-table-column prop="item" label="检查项目" min-width="130" />
            <el-table-column label="结果" min-width="90">
              <template #default="{ row }">
                <el-tag
                  :type="row.result === '阴性' || row.result === '正常' ? 'success' : 'danger'"
                  size="small"
                >
                  {{ row.result }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="解读" min-width="180" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

const patientMap = {
  1: { name: '陈建国', hospitalId: '20240001', phone: '13800001111', gender: '男', age: 45, diagnosis: '肺结核（初治）', treatmentPlan: '2HRZE/4HR', nurse: '王护士', doctor: '李医生', nextFollowUp: '2026-07-15', statusLabel: '在治', statusTag: 'danger', avatarColor: '#7BA7D7' },
  2: { name: '王丽华', hospitalId: '20240002', phone: '13800002222', gender: '女', age: 32, diagnosis: 'HIV 感染', treatmentPlan: 'TDF/3TC/DTG', nurse: '张护士', doctor: '李医生', nextFollowUp: '2026-07-20', statusLabel: '在治', statusTag: 'danger', avatarColor: '#89CFF0' },
  3: { name: '刘志强', hospitalId: '20240003', phone: '13800003333', gender: '男', age: 28, diagnosis: '耐多药结核', treatmentPlan: 'Bdq-Lzd-Mfx', nurse: '李护士', doctor: '王医生', nextFollowUp: '2026-07-12', statusLabel: '在治', statusTag: 'danger', avatarColor: '#7EC8B8' },
  4: { name: '张秀英', hospitalId: '20240004', phone: '13800004444', gender: '女', age: 55, diagnosis: 'HIV 合并乙肝', treatmentPlan: 'TAF/FTC/BIC', nurse: '刘护士', doctor: '李医生', nextFollowUp: '2026-07-25', statusLabel: '在治', statusTag: 'danger', avatarColor: '#B8A9D4' },
  5: { name: '李明辉', hospitalId: '20240005', phone: '13800005555', gender: '男', age: 38, diagnosis: '肺结核（复治）', treatmentPlan: '2HRZE/4HR', nurse: '李护士', doctor: '王医生', nextFollowUp: '2026-07-18', statusLabel: '在治', statusTag: 'danger', avatarColor: '#F4A896' },
  6: { name: '赵秀梅', hospitalId: '20240006', phone: '13800006666', gender: '女', age: 51, diagnosis: 'HIV 感染', treatmentPlan: 'TDF/3TC/EFV', nurse: '王护士', doctor: '李医生', nextFollowUp: '2026-07-22', statusLabel: '在治', statusTag: 'danger', avatarColor: '#E899A8' },
  7: { name: '孙志伟', hospitalId: '20240007', phone: '13800007777', gender: '男', age: 29, diagnosis: '肺结核（初治）', treatmentPlan: '2HRZE/4HR', nurse: '刘护士', doctor: '王医生', nextFollowUp: '2026-07-10', statusLabel: '在治', statusTag: 'danger', avatarColor: '#6BA3D6' },
  8: { name: '吴德明', hospitalId: '20240008', phone: '13800008888', gender: '男', age: 63, diagnosis: '耐多药结核', treatmentPlan: 'Bdq-Lzd-Mfx', nurse: '张护士', doctor: '王医生', nextFollowUp: '-', statusLabel: '已结案', statusTag: 'info', avatarColor: '#95C9A8' },
}

const patient = computed(() => patientMap[Number(route.params.id)] || patientMap[1])

const contacts = ref([
  { name: '张妻', relation: '配偶', screeningStatus: 'done', avatarColor: '#B8A9D4' },
  { name: '张母', relation: '母亲', screeningStatus: 'pending', avatarColor: '#F4A896' },
  { name: '张子', relation: '子女', screeningStatus: 'pending', avatarColor: '#89CFF0' },
])

const timeline = ref([
  { time: '2026-01-15', title: '确诊', desc: '痰涂片阳性，确诊肺结核', type: 'danger' },
  { time: '2026-01-20', title: '启动治疗', desc: '方案：2HRZE/4HR', type: 'primary' },
  { time: '2026-03-15', title: '2月末复查', desc: '痰涂片转阴，肝功能正常', type: 'success' },
  { time: '2026-05-20', title: '方案调整', desc: '进入巩固期，继续 4HR', type: 'warning' },
  { time: '2026-07-15', title: '下次随访', desc: '预计复诊日期', type: 'info' },
])

const labResults = ref([
  { date: '2026-03-15', item: '痰涂片', result: '阴性', note: '治疗效果良好，请继续坚持' },
  { date: '2026-05-20', item: '肝功能', result: '正常', note: 'AST/ALT 均在正常范围' },
  { date: '2026-05-20', item: '痰涂片', result: '阴性', note: '恭喜您，治疗效果很好' },
])

function goBack() {
  router.push('/patient')
}
</script>

<style scoped>
.detail-row {
  align-items: stretch;
}

.detail-col {
  display: flex;
  flex-direction: column;
}

.profile-card {
  flex-shrink: 0;
}

.contacts-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 0 !important;
}

.contacts-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.contacts-body {
  flex: 1;
}

.lab-card {
  margin-bottom: 0 !important;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 14px;
}
.profile-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}
.profile-id {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.info-item label {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 2px;
}
.info-item span {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}
.contact-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}
.contact-row + .contact-row {
  border-top: 1px solid var(--border-light);
}
.contact-info {
  flex: 1;
}
.contact-info span {
  font-size: 14px;
  color: var(--text-primary);
}
.contact-rel {
  font-size: 12px;
  color: var(--text-muted);
  margin-left: 8px;
}
.tl-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}
.tl-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 4px;
}
.profile-avatar {
  font-size: 20px;
}
</style>
