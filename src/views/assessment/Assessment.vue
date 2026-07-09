<template>
  <div class="assessment">
    <div class="page-header">
      <h2>评估模块</h2>
      <div class="header-actions">
        <el-select v-model="assessmentType" placeholder="评估类型" style="width: 160px">
          <el-option label="全部评估" value="" />
          <el-option label="症状评估" value="symptom" />
          <el-option label="心理状态评估" value="psychology" />
          <el-option label="营养状况评估" value="nutrition" />
        </el-select>
      </div>
    </div>

    <div class="stat-grid stat-grid--4">
      <el-card
        v-for="s in stats"
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
            <div class="stat-value" :style="{ color: s.color }">{{ s.count }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <el-tabs v-model="activeTab" class="page-tabs" @tab-change="onTabChange">
      <el-tab-pane label="症状评估" name="symptom">
        <el-card shadow="never" class="section-card">
          <template #header>
            <span>常见症状筛查</span>
            <el-button text type="primary" :icon="Plus" @click="openSymptomForm">新增记录</el-button>
          </template>
          <el-table :data="symptomRecords" style="width: 100%">
            <el-table-column prop="patientName" label="患者姓名" min-width="120" />
            <el-table-column prop="date" label="评估日期" min-width="110" />
            <el-table-column label="主要症状" min-width="200">
              <template #default="{ row }">
                <el-tag v-for="s in row.symptoms" :key="s" :type="s === '呼吸困难' ? 'danger' : s === '发热' ? 'warning' : ''" size="small" style="margin-right: 4px">{{ s }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="severity" label="严重程度" min-width="90">
              <template #default="{ row }">
                <el-tag :type="row.severity === '重度' ? 'danger' : row.severity === '中度' ? 'warning' : 'success'" size="small">{{ row.severity }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="doctor" label="评估医生" min-width="100" />
            <el-table-column prop="status" label="状态" min-width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === '已处理' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default>
                <el-button text type="primary" size="small">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="心理状态评估" name="psychology">
        <el-card shadow="never" class="section-card">
          <template #header>
            <span>心理状态问卷</span>
            <el-button text type="primary" :icon="Plus" @click="openPsychologyForm">新增问卷</el-button>
          </template>
          <el-table :data="psychologyRecords" style="width: 100%">
            <el-table-column prop="patientName" label="患者姓名" min-width="120" />
            <el-table-column prop="date" label="评估日期" min-width="110" />
            <el-table-column prop="score" label="总分" min-width="70" />
            <el-table-column label="评估结果" min-width="160">
              <template #default="{ row }">
                <el-tag :type="row.level === '正常' ? 'success' : row.level === '轻度' ? 'warning' : 'danger'" size="small">{{ row.level }}</el-tag>
                <span style="margin-left: 8px; color: var(--text-secondary)">{{ row.summary }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="doctor" label="评估医生" min-width="100" />
            <el-table-column label="操作" width="120" fixed="right">
              <template #default>
                <el-button text type="primary" size="small">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="营养状况评估" name="nutrition">
        <el-card shadow="never" class="section-card">
          <template #header>
            <span>营养状况监测</span>
            <el-button text type="primary" :icon="Plus" @click="openNutritionForm">新增记录</el-button>
          </template>
          <el-table :data="nutritionRecords" style="width: 100%">
            <el-table-column prop="patientName" label="患者姓名" min-width="120" />
            <el-table-column prop="date" label="评估日期" min-width="110" />
            <el-table-column prop="bmi" label="BMI" min-width="70" />
            <el-table-column label="营养状况" min-width="120">
              <template #default="{ row }">
                <el-tag :type="row.status === '正常' ? 'success' : row.status === '营养不良' ? 'danger' : 'warning'" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="weight" label="体重(kg)" min-width="80" />
            <el-table-column prop="recommendation" label="营养建议" min-width="200" show-overflow-tooltip />
            <el-table-column prop="doctor" label="评估医生" min-width="100" />
            <el-table-column label="操作" width="120" fixed="right">
              <template #default>
                <el-button text type="primary" size="small">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="showSymptomDialog" title="症状评估" width="600px">
      <el-form :model="symptomForm" label-width="100px">
        <el-form-item label="患者姓名">
          <el-input v-model="symptomForm.patientName" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="主要症状">
          <el-checkbox-group v-model="symptomForm.symptoms">
            <el-checkbox label="咳嗽" />
            <el-checkbox label="咳痰" />
            <el-checkbox label="发热" />
            <el-checkbox label="胸痛" />
            <el-checkbox label="乏力" />
            <el-checkbox label="盗汗" />
            <el-checkbox label="呼吸困难" />
            <el-checkbox label="恶心" />
            <el-checkbox label="呕吐" />
            <el-checkbox label="皮疹" />
            <el-checkbox label="腹泻" />
            <el-checkbox label="体重下降" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="严重程度">
          <el-radio-group v-model="symptomForm.severity">
            <el-radio label="轻度">轻度</el-radio>
            <el-radio label="中度">中度</el-radio>
            <el-radio label="重度">重度</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="symptomForm.remark" type="textarea" :rows="3" placeholder="其他症状或补充说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSymptomDialog = false">取消</el-button>
        <el-button type="primary" @click="submitSymptom">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showPsychologyDialog" title="心理状态评估" width="600px">
      <el-form :model="psychologyForm" label-width="120px">
        <el-form-item label="患者姓名">
          <el-input v-model="psychologyForm.patientName" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="情绪状态">
          <el-radio-group v-model="psychologyForm.mood">
            <el-radio label="良好">良好</el-radio>
            <el-radio label="一般">一般</el-radio>
            <el-radio label="低落">低落</el-radio>
            <el-radio label="焦虑">焦虑</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="睡眠质量">
          <el-rate v-model="psychologyForm.sleep" :max="5" show-score score-template="{value} 分" />
        </el-form-item>
        <el-form-item label="治疗信心">
          <el-rate v-model="psychologyForm.confidence" :max="5" show-score score-template="{value} 分" />
        </el-form-item>
        <el-form-item label="自评描述">
          <el-input v-model="psychologyForm.description" type="textarea" :rows="3" placeholder="请患者描述近期心理感受" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPsychologyDialog = false">取消</el-button>
        <el-button type="primary" @click="submitPsychology">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showNutritionDialog" title="营养状况评估" width="600px">
      <el-form :model="nutritionForm" label-width="120px">
        <el-form-item label="患者姓名">
          <el-input v-model="nutritionForm.patientName" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="身高(cm)">
          <el-input-number v-model="nutritionForm.height" :min="100" :max="220" />
        </el-form-item>
        <el-form-item label="体重(kg)">
          <el-input-number v-model="nutritionForm.weight" :min="20" :max="200" :precision="1" />
        </el-form-item>
        <el-form-item label="食欲状况">
          <el-radio-group v-model="nutritionForm.appetite">
            <el-radio label="良好">良好</el-radio>
            <el-radio label="一般">一般</el-radio>
            <el-radio label="较差">较差</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="营养建议">
          <el-input v-model="nutritionForm.recommendation" type="textarea" :rows="3" placeholder="输入营养建议" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showNutritionDialog = false">取消</el-button>
        <el-button type="primary" @click="submitNutrition">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Document, Monitor, Apple } from '@element-plus/icons-vue'

const assessmentType = ref('')
const activeTab = ref('symptom')

const stats = ref([
  { icon: 'Document', label: '今日评估', count: 12, color: '#1565C0', iconBg: '#E3F2FD' },
  { icon: 'Monitor', label: '症状评估', count: 58, color: '#2E7D32', iconBg: '#E8F5E9' },
  { icon: 'Document', label: '心理评估', count: 36, color: '#E65100', iconBg: '#FFF3E0' },
  { icon: 'Apple', label: '营养评估', count: 41, color: '#546E7A', iconBg: '#ECEFF1' },
])

const symptomRecords = ref([
  { id: 1, patientName: '张建国', date: '2026-07-06', symptoms: ['咳嗽', '咳痰'], severity: '轻度', doctor: '王敏', status: '已处理' },
  { id: 2, patientName: '李明芳', date: '2026-07-06', symptoms: ['发热', '胸痛'], severity: '中度', doctor: '王敏', status: '已处理' },
  { id: 3, patientName: '王秀英', date: '2026-07-05', symptoms: ['呼吸困难', '乏力'], severity: '重度', doctor: '李刚', status: '待处理' },
  { id: 4, patientName: '赵国强', date: '2026-07-05', symptoms: ['盗汗', '体重下降'], severity: '中度', doctor: '李刚', status: '已处理' },
  { id: 5, patientName: '陈小红', date: '2026-07-04', symptoms: ['恶心', '皮疹'], severity: '轻度', doctor: '王敏', status: '已处理' },
])

const psychologyRecords = ref([
  { id: 1, patientName: '王秀英', date: '2026-07-06', score: 72, level: '正常', summary: '心态积极，配合治疗', doctor: '张丽' },
  { id: 2, patientName: '李明芳', date: '2026-07-06', score: 52, level: '轻度', summary: '轻度焦虑，需心理疏导', doctor: '张丽' },
  { id: 3, patientName: '张建国', date: '2026-07-05', score: 35, level: '中重度', summary: '情绪低落，建议转介心理科', doctor: '张丽' },
  { id: 4, patientName: '赵国强', date: '2026-07-04', score: 68, level: '正常', summary: '状态稳定，持续关注', doctor: '张丽' },
])

const nutritionRecords = ref([
  { id: 1, patientName: '李明芳', date: '2026-07-06', bmi: 18.2, status: '偏瘦', weight: 48.5, recommendation: '增加优质蛋白摄入，少食多餐', doctor: '刘芳' },
  { id: 2, patientName: '王秀英', date: '2026-07-06', bmi: 16.8, status: '营养不良', weight: 43.0, recommendation: '营养科会诊，制定个性化营养方案', doctor: '刘芳' },
  { id: 3, patientName: '张建国', date: '2026-07-05', bmi: 22.5, status: '正常', weight: 65.0, recommendation: '保持均衡饮食，适当运动', doctor: '刘芳' },
  { id: 4, patientName: '赵国强', date: '2026-07-04', bmi: 24.8, status: '超重', weight: 78.2, recommendation: '控制总热量摄入，增加有氧运动', doctor: '刘芳' },
  { id: 5, patientName: '陈小红', date: '2026-07-03', bmi: 17.5, status: '偏瘦', weight: 46.0, recommendation: '加强营养补充，定期监测体重', doctor: '刘芳' },
])

const showSymptomDialog = ref(false)
const showPsychologyDialog = ref(false)
const showNutritionDialog = ref(false)

const symptomForm = ref({
  patientName: '',
  symptoms: [],
  severity: '轻度',
  remark: '',
})

const psychologyForm = ref({
  patientName: '',
  mood: '良好',
  sleep: 3,
  confidence: 3,
  description: '',
})

const nutritionForm = ref({
  patientName: '',
  height: 170,
  weight: 65,
  appetite: '良好',
  recommendation: '',
})

function openSymptomForm() {
  symptomForm.value = { patientName: '', symptoms: [], severity: '轻度', remark: '' }
  showSymptomDialog.value = true
}

function openPsychologyForm() {
  psychologyForm.value = { patientName: '', mood: '良好', sleep: 3, confidence: 3, description: '' }
  showPsychologyDialog.value = true
}

function openNutritionForm() {
  nutritionForm.value = { patientName: '', height: 170, weight: 65, appetite: '良好', recommendation: '' }
  showNutritionDialog.value = true
}

function submitSymptom() {
  showSymptomDialog.value = false
}

function submitPsychology() {
  showPsychologyDialog.value = false
}

function submitNutrition() {
  showNutritionDialog.value = false
}

function onTabChange(tab) {
  activeTab.value = tab
}
</script>
