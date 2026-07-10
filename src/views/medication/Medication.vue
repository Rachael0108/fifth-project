<template>
  <div class="medication">
    <div class="page-header">
      <h2>服药复诊</h2>
      <el-date-picker v-model="currentDate" type="date" placeholder="选择日期" style="width: 160px" />
    </div>

    <div class="stat-grid stat-grid--4">
      <el-card
        v-for="s in medStats"
        :key="s.label"
        shadow="never"
        class="stat-card stat-card--horizontal"
        :style="{ '--stat-accent': s.color, '--stat-icon-bg': s.iconBg }"
      >
        <div class="stat-row">
          <div class="stat-icon-wrap">
            <el-icon :size="20"><component :is="s.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value" :style="{ color: s.color }">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <el-tabs v-model="activeTab" class="page-tabs">
      <el-tab-pane label="今日打卡" name="daily">
        <el-row :gutter="16" class="panel-row">
          <el-col :xs="24" :sm="24" :md="12" class="panel-col">
            <el-card shadow="never" class="section-card panel-card">
              <template #header><span>今日服药打卡</span></template>
              <el-table :data="dailyMeds" size="small">
                <el-table-column label="姓名" min-width="100">
                  <template #default="{ row }">
                    <span class="cell-name">{{ row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="medication" label="药品" min-width="120" />
                <el-table-column prop="scheduledTime" label="计划时间" min-width="100" />
                <el-table-column label="状态" min-width="90">
                  <template #default="{ row }">
                    <span class="status-dot" :class="row.status === 'done' ? 'is-done' : 'is-pending'">
                      {{ row.status === 'done' ? '已打卡' : '未打卡' }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="actualTime" label="实际打卡" min-width="100" />
              </el-table>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" class="panel-col">
            <el-card shadow="never" class="section-card panel-card">
              <template #header><span>HIV 免疫功能追踪</span></template>
              <div class="immunity-chart">
                <div class="chart-row">
                  <span class="chart-label">CD4 计数</span>
                  <div class="mini-chart">
                    <div v-for="(v, i) in cd4Data" :key="i" class="mini-bar mini-bar--cd4" :style="{ height: v + 'px' }" />
                  </div>
                </div>
                <div class="chart-row">
                  <span class="chart-label">病毒载量</span>
                  <div class="mini-chart">
                    <div v-for="(v, i) in viralData" :key="i" class="mini-bar mini-bar--viral" :style="{ height: v + 'px' }" />
                  </div>
                </div>
                <div class="chart-months">
                  <span v-for="m in ['1月','2月','3月','4月','5月','6月']" :key="m">{{ m }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="panel-row">
          <el-col :xs="24" :sm="24" :md="12" class="panel-col">
            <el-card shadow="never" class="section-card panel-card">
              <template #header><span>漏服提醒与补救指导</span></template>
              <div v-for="item in missedDoses" :key="item.id" class="missed-item">
                <div class="missed-header">
                  <el-tag size="small" type="danger">漏服</el-tag>
                  <strong style="color: var(--text-primary)">{{ item.name }}</strong>
                  <span style="color: var(--text-placeholder); font-size: 12px">{{ item.time }}</span>
                </div>
                <p class="missed-guidance">{{ item.guidance }}</p>
              </div>
              <el-empty v-if="missedDoses.length === 0" description="今日无漏服记录" :image-size="60" />
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" class="panel-col">
            <el-card shadow="never" class="section-card panel-card">
              <template #header>
                <span>症状自报</span>
                <el-button text type="primary" :icon="Plus" @click="showSymptomDialog = true">上报症状</el-button>
              </template>
              <el-table :data="symptomReports" size="small">
                <el-table-column label="患者" prop="patientName" min-width="80" />
                <el-table-column label="症状" min-width="150">
                  <template #default="{ row }">
                    <el-tag v-for="s in row.symptoms" :key="s" :type="s === '呼吸困难' ? 'danger' : ''" size="small" style="margin-right: 3px">{{ s }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="severity" label="程度" min-width="60">
                  <template #default="{ row }">
                    <el-tag :type="row.severity === '重度' ? 'danger' : row.severity === '中度' ? 'warning' : 'success'" size="small">{{ row.severity }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="处理" min-width="70">
                  <template #default="{ row }">
                    <el-tag v-if="row.alert" type="danger" size="small">已预警</el-tag>
                    <span v-else style="color: var(--text-placeholder)">正常</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="服药计划" name="medication">
        <el-card shadow="never" class="section-card">
          <template #header>
            <span>服药计划</span>
            <el-button text type="primary" :icon="Plus" @click="showPlanDrawer = true">新增服药计划</el-button>
          </template>
          <el-table :data="medicationPlans" size="small">
            <el-table-column prop="patientName" label="患者" min-width="100" />
            <el-table-column prop="medication" label="药品" min-width="120" />
            <el-table-column prop="dosage" label="用量" min-width="80" />
            <el-table-column prop="frequency" label="频率" min-width="100" />
            <el-table-column prop="time" label="时间" min-width="100" />
            <el-table-column prop="note" label="备注" min-width="160" />
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="复查计划" name="followup">
        <el-card shadow="never" class="section-card">
          <template #header>
            <span>复查计划</span>
            <el-button text type="primary" :icon="Plus" @click="showFollowupDrawer = true">新增复查计划</el-button>
          </template>
          <el-table :data="followupPlans" size="small">
            <el-table-column prop="patientName" label="患者" min-width="100" />
            <el-table-column prop="examType" label="复查项目" min-width="140" />
            <el-table-column prop="lastDate" label="上次日期" min-width="110" />
            <el-table-column prop="nextDate" label="下次日期" min-width="110">
              <template #default="{ row }">
                <span :style="{ color: row.overdue ? 'var(--el-color-danger)' : 'var(--text-primary)', fontWeight: row.overdue ? 600 : 400 }">{{ row.nextDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" min-width="80">
              <template #default="{ row }">
                <el-tag :type="row.overdue ? 'danger' : row.done ? 'success' : 'warning'" size="small">
                  {{ row.overdue ? '逾期' : row.done ? '已完成' : '待复查' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="doctor" label="医生" min-width="80" />
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="检查结果" name="results">
        <el-card shadow="never" class="section-card">
          <template #header><span>检查结果查询</span></template>
          <el-table :data="labResults" size="small">
            <el-table-column prop="patientName" label="患者" min-width="90" />
            <el-table-column prop="date" label="日期" min-width="90" />
            <el-table-column prop="testName" label="检查项目" min-width="140" />
            <el-table-column prop="result" label="结果" min-width="90">
              <template #default="{ row }">
                <span :style="{ color: row.normal ? 'var(--el-color-success)' : 'var(--el-color-danger)', fontWeight: 600 }">{{ row.result }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="reference" label="参考范围" min-width="120" />
            <el-table-column label="解读" min-width="240">
              <template #default="{ row }">
                <span style="color: var(--text-secondary)">{{ row.interpretation }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-drawer v-model="showFollowupDrawer" title="新增复查计划" direction="rtl" size="450px">
      <el-form :model="followupForm" label-width="90" size="small">
        <el-form-item label="患者姓名">
          <el-input v-model="followupForm.patientName" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="复查项目">
          <el-select v-model="followupForm.examType" placeholder="选择复查项目" style="width: 100%">
            <el-option label="痰涂片复查" value="痰涂片复查" />
            <el-option label="痰培养" value="痰培养" />
            <el-option label="胸部影像" value="胸部影像" />
            <el-option label="肝功能检查" value="肝功能检查" />
            <el-option label="肾功能检查" value="肾功能检查" />
            <el-option label="CD4 计数" value="CD4 计数" />
            <el-option label="HIV 病毒载量" value="HIV 病毒载量" />
            <el-option label="血常规" value="血常规" />
          </el-select>
        </el-form-item>
        <el-form-item label="上次复查日期">
          <el-date-picker v-model="followupForm.lastDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="下次复查日期">
          <el-date-picker v-model="followupForm.nextDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="负责医生">
          <el-input v-model="followupForm.doctor" placeholder="请输入医生姓名" />
        </el-form-item>
        <el-form-item label="提醒时间">
          <el-date-picker v-model="followupForm.reminderTime" type="datetime" placeholder="选择提醒日期和时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" @click="addFollowup" style="width: 100%">添加</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-drawer v-model="showPlanDrawer" title="新增服药计划" direction="rtl" size="450px">
      <el-form :model="planForm" label-width="80" size="small">
        <el-form-item label="患者">
          <el-select v-model="planForm.patientId" placeholder="选择患者" style="width: 100%">
            <el-option label="陈建国" value="1" />
            <el-option label="王丽华" value="2" />
            <el-option label="刘志强" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="药品">
          <el-input v-model="planForm.medication" placeholder="药品名称" />
        </el-form-item>
        <el-form-item label="用量">
          <el-input v-model="planForm.dosage" placeholder="如：1片" />
        </el-form-item>
        <el-form-item label="频率">
          <el-select v-model="planForm.frequency" placeholder="频率" style="width: 100%">
            <el-option label="每日一次" value="每日一次" />
            <el-option label="每日两次" value="每日两次" />
            <el-option label="每周一次" value="每周一次" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-time-picker v-model="planForm.time" placeholder="选择服药时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="提醒时间">
          <el-time-picker v-model="planForm.reminderTime" placeholder="选择提醒时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="planForm.note" type="textarea" :rows="3" placeholder="如：空腹服用" />
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" @click="addPlan" style="width: 100%">添加</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-dialog v-model="showSymptomDialog" title="症状自报" width="500px">
      <el-form :model="symptomForm" label-width="80">
        <el-form-item label="患者姓名">
          <el-input v-model="symptomForm.patientName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="症状选择">
          <el-checkbox-group v-model="symptomForm.symptoms">
            <el-checkbox label="恶心" />
            <el-checkbox label="呕吐" />
            <el-checkbox label="皮疹" />
            <el-checkbox label="乏力" />
            <el-checkbox label="咳嗽" />
            <el-checkbox label="头晕" />
            <el-checkbox label="头痛" />
            <el-checkbox label="腹泻" />
            <el-checkbox label="发热" />
            <el-checkbox label="呼吸困难" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="严重程度">
          <el-radio-group v-model="symptomForm.severity">
            <el-radio label="轻度">轻度</el-radio>
            <el-radio label="中度">中度</el-radio>
            <el-radio label="重度">重度</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSymptomDialog = false">取消</el-button>
        <el-button type="primary" @click="submitSymptom">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, FirstAidKit, CircleCheck, Clock, WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const currentDate = ref(new Date())
const activeTab = ref('daily')

const medStats = ref([
  { icon: 'FirstAidKit', label: '在管服药患者', value: 78, color: '#5B9BD5', iconBg: '#E8F2FA' },
  { icon: 'CircleCheck', label: '今日已打卡', value: 66, color: '#10B981', iconBg: '#D1FAE5' },
  { icon: 'Clock', label: '今日未打卡', value: 12, color: '#F59E0B', iconBg: '#FEF3C7' },
  { icon: 'WarningFilled', label: '连续漏服预警', value: 3, color: '#F43F5E', iconBg: '#FFE4E6' },
])

const dailyMeds = ref([
  { name: '陈建国', medication: '异烟肼', scheduledTime: '08:00', status: 'done', actualTime: '07:50' },
  { name: '王丽华', medication: '替诺福韦', scheduledTime: '08:00', status: 'done', actualTime: '08:05' },
  { name: '刘志强', medication: '利福平', scheduledTime: '08:00', status: 'done', actualTime: '08:00' },
  { name: '张秀英', medication: '多替拉韦', scheduledTime: '08:00', status: 'pending', actualTime: '-' },
  { name: '李明辉', medication: '乙胺丁醇', scheduledTime: '08:00', status: 'pending', actualTime: '-' },
  { name: '周美玲', medication: '异烟肼', scheduledTime: '08:00', status: 'done', actualTime: '07:55' },
  { name: '杨伟', medication: '吡嗪酰胺', scheduledTime: '08:00', status: 'done', actualTime: '08:10' },
  { name: '黄桂英', medication: '恩曲他滨', scheduledTime: '22:00', status: 'pending', actualTime: '-' },
])

const cd4Data = ref([60, 75, 90, 85, 110, 130])
const viralData = ref([50, 30, 20, 15, 10, 8])

const missedDoses = ref([
  { id: 1, name: '张秀英', time: '今日 08:00 未打卡', guidance: '今天这顿就不要补服了，下次记得按时吃，不要焦虑。如果忘记服药超过 6 小时请跳过本次剂量，按原计划服用下一次。' },
  { id: 2, name: '李明辉', time: '今日 08:00 未打卡', guidance: '漏服不超过 2 小时请立即补服。已超过 2 小时，请跳过本次，不可双倍剂量。建议设置每日闹钟提醒。' },
  { id: 3, name: '黄桂英', time: '昨日 22:00 未打卡', guidance: '昨夜漏服已超过 12 小时，请按正常时间服用今日剂量，切勿加倍。连续漏服可能影响治疗效果。' },
])

const symptomReports = ref([
  { id: 1, patientName: '王秀英', symptoms: ['恶心', '呕吐'], severity: '中度', alert: false },
  { id: 2, patientName: '陈小红', symptoms: ['皮疹'], severity: '轻度', alert: false },
  { id: 3, patientName: '赵国强', symptoms: ['呼吸困难', '头晕'], severity: '重度', alert: true },
  { id: 4, patientName: '李明芳', symptoms: ['乏力', '头痛'], severity: '轻度', alert: false },
])

const medicationPlans = ref([
  { patientName: '陈建国', medication: '利福平片', dosage: '1片', frequency: '每日一次', time: '08:00', note: '空腹服用' },
  { patientName: '王丽华', medication: '替诺福韦', dosage: '2片', frequency: '每日一次', time: '08:00', note: '空腹服用' },
  { patientName: '刘志强', medication: '雷诺拉韦', dosage: '1片', frequency: '每日一次', time: '08:00', note: '与餐同服' },
  { patientName: '张秀英', medication: '多替拉韦(DTG)', dosage: '1片', frequency: '每日一次', time: '08:00', note: '不受饮食影响，建议固定时间服用' },
  { patientName: '李明辉', medication: '乙胺丁醇', dosage: '2片', frequency: '每日一次', time: '08:00', note: '空腹服用，服药后注意视力变化' },
  { patientName: '周美玲', medication: '异烟肼', dosage: '3片', frequency: '每日一次', time: '08:00', note: '空腹服用，定期复查肝功能' },
  { patientName: '杨伟', medication: '吡嗪酰胺', dosage: '2片', frequency: '每日一次', time: '08:00', note: '随餐服用减少胃部不适' },
  { patientName: '黄桂英', medication: '恩曲他滨(FTC)', dosage: '1粒', frequency: '每日一次', time: '22:00', note: '睡前服用，勿与高脂餐同服' },
  { patientName: '郑丽芳', medication: '克力芝(LPV/r)', dosage: '2粒', frequency: '每日两次', time: '08:00/20:00', note: '随餐服用，间隔12小时' },
  { patientName: '陈明', medication: '拉米夫定(3TC)', dosage: '1片', frequency: '每日一次', time: '08:00', note: '与其它抗病毒药一同服用' },
  { patientName: '林小红', medication: '奈韦拉平(NVP)', dosage: '1片', frequency: '每日两次', time: '08:00/20:00', note: '初始期注意皮疹和肝功能' },
  { patientName: '黄伟', medication: '阿巴卡韦(ABC)', dosage: '1片', frequency: '每日一次', time: '08:00', note: '用药前检测 HLA-B*5701 基因' },
])

const followupPlans = ref([
  { patientName: '陈建国', examType: '痰涂片复查', lastDate: '2026-06-15', nextDate: '2026-07-15', overdue: false, done: false, doctor: '王敏' },
  { patientName: '陈建国', examType: '肝功能检查', lastDate: '2026-06-15', nextDate: '2026-07-15', overdue: false, done: false, doctor: '王敏' },
  { patientName: '王丽华', examType: 'CD4 计数', lastDate: '2026-06-10', nextDate: '2026-07-10', overdue: true, done: false, doctor: '李刚' },
  { patientName: '王丽华', examType: '病毒载量', lastDate: '2026-06-10', nextDate: '2026-07-10', overdue: true, done: false, doctor: '李刚' },
  { patientName: '刘志强', examType: '胸部影像', lastDate: '2026-06-01', nextDate: '2026-07-01', overdue: true, done: false, doctor: '王敏' },
  { patientName: '张秀英', examType: 'HIV 病毒载量', lastDate: '2026-06-20', nextDate: '2026-07-20', overdue: false, done: false, doctor: '李刚' },
  { patientName: '周美玲', examType: '痰培养', lastDate: '2026-06-25', nextDate: '2026-07-25', overdue: false, done: true, doctor: '王敏' },
  { patientName: '杨伟', examType: '肾功能检查', lastDate: '2026-06-18', nextDate: '2026-07-02', overdue: false, done: true, doctor: '王敏' },
])

const labResults = ref([
  { id: 1, patientName: '陈建国', date: '2026-07-01', testName: '痰涂片抗酸染色', result: '阴性', normal: true, reference: '阴性', interpretation: '恭喜您，治疗效果很好，请继续坚持治疗。' },
  { id: 2, patientName: '王丽华', date: '2026-07-01', testName: 'HIV 病毒载量', result: '<20 IU/mL', normal: true, reference: '<40 IU/mL', interpretation: '病毒完全抑制，效果非常好！' },
  { id: 3, patientName: '刘志强', date: '2026-06-28', testName: 'CD4 细胞计数', result: '385 个/μL', normal: true, reference: '>350 个/μL', interpretation: '免疫功能持续改善，请继续保持服药依从性。' },
  { id: 4, patientName: '王秀英', date: '2026-06-28', testName: '痰涂片抗酸染色', result: '阳性(+)', normal: false, reference: '阴性', interpretation: '痰菌转阳，请尽快联系医生评估治疗方案。' },
  { id: 5, patientName: '张秀英', date: '2026-06-25', testName: '肝功能 ALT', result: '78 U/L', normal: false, reference: '10-40 U/L', interpretation: '转氨酶轻度升高，请遵医嘱调整用药，避免饮酒。' },
  { id: 6, patientName: '黄桂英', date: '2026-06-25', testName: 'HIV 病毒载量', result: '150 IU/mL', normal: false, reference: '<40 IU/mL', interpretation: '病毒载量有反弹趋势，请务必按时服药，必要时与医生沟通。' },
])

const planForm = ref({
  patientId: '',
  medication: '',
  dosage: '',
  frequency: '每日一次',
  time: null,
  reminderTime: null,
  note: '',
})

const followupForm = ref({
  patientName: '',
  examType: '',
  lastDate: null,
  nextDate: null,
  doctor: '',
  reminderTime: null,
})

const showPlanDrawer = ref(false)
const showFollowupDrawer = ref(false)
const showSymptomDialog = ref(false)
const symptomForm = ref({
  patientName: '',
  symptoms: [],
  severity: '轻度',
})

function addPlan() {
  showPlanDrawer.value = false
  ElMessage.success('服药计划已添加')
}

function addFollowup() {
  showFollowupDrawer.value = false
  ElMessage.success('复查计划已添加')
}

function submitSymptom() {
  if (!symptomForm.value.patientName || symptomForm.value.symptoms.length === 0) {
    ElMessage.warning('请填写完整信息')
    return
  }
  const alert = symptomForm.value.symptoms.includes('呼吸困难') || symptomForm.value.severity === '重度'
  symptomReports.value.unshift({
    id: Date.now(),
    patientName: symptomForm.value.patientName,
    symptoms: [...symptomForm.value.symptoms],
    severity: symptomForm.value.severity,
    alert,
  })
  showSymptomDialog.value = false
  ElMessage.success('症状已上报' + (alert ? '，已触发医护预警' : ''))
}
</script>

<style scoped>
/* 等高面板 */
.panel-row {
  align-items: stretch;
}

.panel-col {
  display: flex;
  margin-bottom: 20px;
}

.panel-card {
  flex: 1;
  width: 100%;
  margin-bottom: 0 !important;
  display: flex;
  flex-direction: column;
}

.panel-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow-x: auto;
}

.panel-card :deep(.el-card__header) {
  flex-shrink: 0;
}

.immunity-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px 20px 20px;
}

.chart-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 20px;
}

.chart-row:last-of-type {
  margin-bottom: 12px;
}

.chart-label {
  width: 68px;
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  flex-shrink: 0;
}

.mini-chart {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 120px;
}

.mini-bar {
  flex: 1;
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: height 0.4s ease;
}

.mini-bar--cd4 {
  background: #5B9BD5;
  opacity: 0.85;
}

.mini-bar--viral {
  background: #89CFF0;
}

.chart-months {
  display: flex;
  justify-content: space-between;
  padding-left: 80px;
  font-size: 12px;
  color: var(--text-muted);
}

.missed-item {
  padding: 12px 14px;
  margin: 0 20px 10px;
  background: #FEF2F2;
  border-radius: var(--radius-sm);
  border: 1px solid #FECACA;
}

.missed-item:first-child {
  margin-top: 16px;
}

.missed-item:last-child {
  margin-bottom: 16px;
}

.missed-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.missed-guidance {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}
</style>
