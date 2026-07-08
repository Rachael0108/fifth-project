<template>
  <div class="education">
    <div class="page-header">
      <h2>健康教育</h2>
      <div class="header-actions">
        <el-select v-model="filterCategory" placeholder="内容分类" clearable style="width: 150px">
          <el-option label="全部内容" value="" />
          <el-option label="结核专区" value="tb" />
          <el-option label="HIV 专区" value="hiv" />
          <el-option label="通用内容" value="general" />
        </el-select>
        <el-button type="primary" :icon="Plus">新建文章</el-button>
      </div>
    </div>

    <div class="stat-grid">
      <el-card v-for="s in eduStats" :key="s.label" shadow="never" class="stat-card">
        <div class="stat-icon">{{ s.icon }}</div>
        <div class="stat-value" :style="{ color: s.color }">{{ s.count }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </el-card>
    </div>

    <el-tabs v-model="activeTab" class="edu-tabs">
      <el-tab-pane label="健康宣教" name="push">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="10">
            <el-card shadow="never" class="section-card">
              <template #header><span>推送配置</span></template>
              <el-form :model="pushForm" label-width="90" size="small">
                <el-form-item label="选择患者">
                  <el-select v-model="pushForm.patients" multiple placeholder="可选多位患者" style="width: 100%">
                    <el-option v-for="p in patientOptions" :key="p.value" :label="p.label" :value="p.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="推送文章">
                  <el-select v-model="pushForm.articleId" placeholder="选择健康文章" style="width: 100%">
                    <el-option v-for="a in articles" :key="a.id" :label="a.title" :value="a.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="推送方式">
                  <el-radio-group v-model="pushForm.channel">
                    <el-radio label="wechat">微信</el-radio>
                    <el-radio label="sms">短信</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="推送时间">
                  <el-radio-group v-model="pushForm.timing" style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start">
                    <el-radio label="immediate">立即推送</el-radio>
                    <el-radio label="scheduled">定时推送</el-radio>
                    <el-radio label="recurring">周期性推送</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="pushForm.timing === 'scheduled'" label="推送时间">
                  <el-date-picker v-model="pushForm.scheduledTime" type="datetime" placeholder="选择推送时间" style="width: 100%" />
                </el-form-item>
                <el-form-item v-if="pushForm.timing === 'recurring'" label="推送周期">
                  <el-select v-model="pushForm.recurringInterval" placeholder="选择周期" style="width: 100%">
                    <el-option label="每天一次" value="daily" />
                    <el-option label="每周一次" value="weekly" />
                    <el-option label="每月一次" value="monthly" />
                  </el-select>
                </el-form-item>
                <el-form-item v-if="pushForm.timing === 'recurring'" label="推送时间">
                  <el-time-picker v-model="pushForm.recurringTime" placeholder="选择推送时间" style="width: 100%" />
                </el-form-item>
                <el-form-item label-width="0">
                  <el-button type="primary" @click="submitPush" style="width: 100%">确认推送</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="14">
            <el-card shadow="never" class="section-card">
              <template #header><span>推送记录</span></template>
              <el-table :data="pushRecords" stripe size="small">
                <el-table-column prop="patients" label="推送对象" width="120" show-overflow-tooltip />
                <el-table-column prop="article" label="文章" width="140" show-overflow-tooltip />
                <el-table-column label="方式" width="70">
                  <template #default="{ row }">
                    <el-tag :type="row.channel === 'wechat' ? 'primary' : 'success'" size="small">{{ row.channel === 'wechat' ? '微信' : '短信' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="推送类型" width="80">
                  <template #default="{ row }">
                    <span style="font-size: 12px">{{ row.timingLabel }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="pushTime" label="推送时间" width="140" />
                <el-table-column label="状态" width="70">
                  <template #default="{ row }">
                    <el-tag :type="row.status === '已推送' ? 'success' : row.status === '已取消' ? 'info' : 'warning'" size="small">{{ row.status }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="健康教育文章" name="articles">
        <div class="article-grid">
          <div
            v-for="article in filteredArticles"
            :key="article.id"
            class="article-card"
            @click="previewArticle(article)"
          >
            <div class="article-tag-row">
              <el-tag :type="article.category === 'tb' ? 'success' : article.category === 'hiv' ? 'warning' : 'primary'" size="small" round>
                {{ article.categoryLabel }}
              </el-tag>
            </div>
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-desc">{{ article.desc }}</p>
            <div class="article-footer">
              <span class="article-date">{{ article.date }}</span>
              <el-button text type="primary" size="small" @click.stop="previewArticle(article)">
                阅读全文 →
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="结核密接者管理" name="contacts">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="never" class="section-card">
              <template #header>
                <span>新增密接者</span>
              </template>
              <el-form :model="contactForm" label-width="70" size="small">
                <el-form-item label="患者姓名">
                  <el-input v-model="contactForm.patientName" placeholder="登记患者" />
                </el-form-item>
                <el-form-item label="密接者">
                  <el-input v-model="contactForm.contactName" placeholder="密接者姓名" />
                </el-form-item>
                <el-form-item label="关系">
                  <el-select v-model="contactForm.relation" placeholder="关系" style="width: 100%">
                    <el-option label="配偶" value="配偶" />
                    <el-option label="子女" value="子女" />
                    <el-option label="父母" value="父母" />
                    <el-option label="兄弟姐妹" value="兄弟姐妹" />
                    <el-option label="室友" value="室友" />
                    <el-option label="同事" value="同事" />
                  </el-select>
                </el-form-item>
                <el-form-item label="手机号">
                  <el-input v-model="contactForm.phone" placeholder="手机号码" />
                </el-form-item>
                <el-form-item label-width="0">
                  <el-button type="primary" @click="addContact" style="width: 100%">录入密接者</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card shadow="never" class="section-card">
              <template #header>
                <span>密接者筛查记录</span>
              </template>
              <el-table :data="contactRecords" stripe size="small">
                <el-table-column prop="patientName" label="登记患者" width="100" />
                <el-table-column prop="contactName" label="密接者" width="90" />
                <el-table-column prop="relation" label="关系" width="70" />
                <el-table-column prop="phone" label="手机号" width="120" />
                <el-table-column label="筛查状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.screeningStatus === '已完成' ? 'success' : row.screeningStatus === '筛查中' ? 'warning' : 'info'" size="small">
                      {{ row.screeningStatus }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="screeningDate" label="筛查日期" width="100" />
                <el-table-column prop="result" label="结果" width="80">
                  <template #default="{ row }">
                    <span v-if="row.result" :style="{ color: row.result === '正常' ? 'var(--el-color-success)' : 'var(--el-color-danger)', fontWeight: 600 }">{{ row.result }}</span>
                    <span v-else style="color: var(--text-placeholder)">待查</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template #default>
                    <el-button text type="primary" size="small">提醒</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-drawer v-model="showPreview" :title="previewArticleData?.title" direction="rtl" size="520px">
      <div class="preview-body">
        <div class="preview-meta">
          <el-tag :type="previewArticleData?.category === 'tb' ? 'success' : previewArticleData?.category === 'hiv' ? 'warning' : 'primary'" size="small" round>
            {{ previewArticleData?.categoryLabel }}
          </el-tag>
          <span style="color: var(--text-placeholder, #7a9ab5); font-size: 13px">{{ previewArticleData?.date }}</span>
        </div>
        <h3 style="margin: 16px 0; font-size: 20px; color: var(--text-primary, #0a2d4d)">{{ previewArticleData?.title }}</h3>
        <div class="preview-content" v-html="previewArticleData?.content"></div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const filterCategory = ref('')
const activeTab = ref('push')
const showPreview = ref(false)
const previewArticleData = ref(null)

const eduStats = ref([
  { icon: '📨', label: '健康宣教', count: 4, color: '#0066cc' },
  { icon: '📚', label: '知识文章', count: 24, color: '#0066cc' },
  { icon: '🔬', label: '结核专区', count: 8, color: '#38a169' },
  { icon: '❤️', label: 'HIV 专区', count: 6, color: '#d69e2e' },
  { icon: '📖', label: '密接者', count: 15, color: '#e67e22' },
])

const articles = ref([
  {
    id: 1, title: '肺结核居家隔离指导',
    desc: '详细说明肺结核患者居家期间的隔离要求，包括房间通风、痰液处理、个人防护等措施，帮助患者科学隔离减少家庭传播风险。',
    category: 'tb', categoryLabel: '结核专区', date: '2026-06-15',
    content: `<h4>一、房间通风要求</h4><p>每日开窗通风 3-4 次，每次不少于 30 分钟。保持空气流通，降低空气中结核菌浓度。患者应独居一间，保持房门关闭。</p><h4>二、痰液处理方法</h4><p>患者应使用带盖的专用痰杯，痰液加入含氯消毒液(1:100 稀释的84消毒液)浸泡 2 小时后倒入马桶。痰杯每日煮沸消毒 15 分钟。</p><h4>三、个人防护措施</h4><p>患者外出时应佩戴外科口罩。咳嗽、打喷嚏时用纸巾捂住口鼻，纸巾丢弃于专用垃圾桶。勤洗手，使用肥皂和流动水或含酒精的免洗洗手液。</p><h4>四、家庭消毒指南</h4><p>患者接触过的物品表面(门把手、开关、桌面等)每日用含氯消毒液擦拭。餐具单独使用，煮沸消毒 15-20 分钟。被褥、衣物勤洗勤晒。</p>`,
  },
  {
    id: 2, title: '家庭消毒与个人防护指南',
    desc: '日常消毒方法、口罩正确佩戴、手卫生等防护措施，为家庭成员提供全面的防护指导。',
    category: 'tb', categoryLabel: '结核专区', date: '2026-06-10',
    content: `<h4>一、日常消毒方法</h4><p>含氯消毒液(500mg/L)擦拭家具、地面，作用 30 分钟后清水擦净。手机、钥匙等小件物品可用 75% 酒精擦拭。</p><h4>二、口罩正确佩戴</h4><p>佩戴口罩前洗手，分清内外上下，鼻夹按压贴合鼻梁。口罩潮湿或污染后立即更换，废弃口罩投入专用垃圾桶。</p><h4>三、手卫生规范</h4><p>接触患者前后、进食前、如厕后必须洗手。洗手采用七步洗手法，时长不少于 20 秒。</p>`,
  },
  {
    id: 3, title: 'HIV 暴露前预防（PrEP）指南',
    desc: 'PrEP 适用人群、使用方法、注意事项及常见问题解答，帮助高风险人群科学预防 HIV 感染。',
    category: 'hiv', categoryLabel: 'HIV 专区', date: '2026-06-20',
    content: `<h4>一、什么是 PrEP？</h4><p>PrEP 是指 HIV 阴性人群通过每日服用抗病毒药物来预防 HIV 感染的有效措施。正确服用 PrEP 可将感染风险降低 99% 以上。</p><h4>二、适用人群</h4><p>HIV 阳性者的阴性配偶或性伴侣、多性伴者、未坚持使用安全套者、静脉吸毒者等高风险人群。</p><h4>三、使用方法</h4><p>每日一次，每次一片，固定时间服用。建议连续服用 7 天后达到最佳保护效果。漏服后 24 小时内补服，超过 24 小时则跳过。</p>`,
  },
  {
    id: 4, title: '安全套正确使用指南',
    desc: '如何正确选择和使用安全套，常见错误用法纠正，以及预防性传播疾病的综合建议。',
    category: 'hiv', categoryLabel: 'HIV 专区', date: '2026-06-18',
    content: `<h4>一、选择安全套</h4><p>使用合格产品，注意生产日期和有效期。选择合适尺寸，过大易滑脱，过小易破裂。</p><h4>二、正确使用步骤</h4><p>检查包装是否完好 → 撕开包装(勿用牙齿) → 捏住顶端气囊排出空气 → 延展至根部 → 使用后打结丢弃。</p><h4>三、常见误区</h4><p>双重佩戴反而增加破裂风险。使用油性润滑剂会损坏乳胶。安全套不能重复使用。</p>`,
  },
  {
    id: 5, title: '抗病毒药物服药须知',
    desc: '常见抗 HIV 药物的用法、副作用管理及注意事项，帮助患者提高服药依从性。',
    category: 'hiv', categoryLabel: 'HIV 专区', date: '2026-06-12',
    content: `<h4>一、服药原则</h4><p>按时按量服药，不可随意停药或减量。建议设置每日闹钟提醒。外出时随身携带药物。</p><h4>二、常见副作用</h4><p>初期可能出现恶心、腹泻、头晕等症状，通常 2-4 周内缓解。如出现严重皮疹、黄疸、呼吸困难等及时就医。</p><h4>三、漏服处理</h4><p>漏服不超过 2 小时立即补服，超过 2 小时则跳过，按原计划服用下次剂量。切勿双倍剂量服用。</p>`,
  },
  {
    id: 6, title: '结核病防治核心知识',
    desc: '结核病的传播途径、常见症状识别、治疗原则和预后管理，帮助患者全面了解疾病。',
    category: 'tb', categoryLabel: '结核专区', date: '2026-06-08',
    content: `<h4>一、传播途径</h4><p>结核病主要通过飞沫传播，患者咳嗽、打喷嚏、大声说话时排出的含菌飞沫被他人吸入后可能感染。</p><h4>二、常见症状</h4><p>持续咳嗽咳痰超过 2 周、咯血或痰中带血、胸痛、午后低热、夜间盗汗、乏力、食欲减退、体重下降。</p><h4>三、治疗原则</h4><p>早期、联合、适量、规律、全程。初治患者通常治疗 6 个月，耐药患者治疗 18-24 个月。不可自行停药。</p>`,
  },
  {
    id: 7, title: '健康生活方式指南',
    desc: '合理膳食、适量运动、心理调适、戒烟限酒等健康生活方式的综合建议。',
    category: 'general', categoryLabel: '通用内容', date: '2026-06-05',
    content: `<h4>一、合理膳食</h4><p>保证优质蛋白摄入(鱼、蛋、奶、豆制品)，多食新鲜蔬菜水果。少食油炸、腌制食品。</p><h4>二、适量运动</h4><p>每周至少 150 分钟中等强度运动，如快走、慢跑、太极拳等。运动后感觉舒适为宜。</p><h4>三、心理调适</h4><p>保持积极乐观心态，培养兴趣爱好。遇到困扰时与家人朋友沟通或寻求专业心理帮助。</p>`,
  },
  {
    id: 8, title: '定期复查的重要性',
    desc: '为什么需要按时复查，各阶段复查项目说明及注意事项，帮助患者建立定期复查意识。',
    category: 'general', categoryLabel: '通用内容', date: '2026-06-01',
    content: `<h4>一、为什么需要定期复查？</h4><p>定期复查可及时评估治疗效果、监测药物不良反应、发现潜在问题、调整治疗方案，是确保治疗成功的关键环节。</p><h4>二、复查项目</h4><p>痰涂片/培养、影像学检查、肝肾功能、血常规、尿常规。HIV 患者还需检测 CD4 计数和病毒载量。</p><h4>三、复查频率</h4><p>强化期每月复查一次，巩固期每 2-3 月复查一次。耐药患者根据医生要求增加复查频率。</p>`,
  },
])

const contactForm = ref({
  patientName: '',
  contactName: '',
  relation: '',
  phone: '',
})

const contactRecords = ref([
  { id: 1, patientName: '张建国', contactName: '李秀英', relation: '配偶', phone: '138****5566', screeningStatus: '已完成', screeningDate: '2026-06-20', result: '正常' },
  { id: 2, patientName: '李明芳', contactName: '王强', relation: '子女', phone: '139****2233', screeningStatus: '已完成', screeningDate: '2026-06-18', result: '正常' },
  { id: 3, patientName: '王秀英', contactName: '刘伟', relation: '配偶', phone: '137****8899', screeningStatus: '筛查中', screeningDate: '', result: '' },
  { id: 4, patientName: '赵国强', contactName: '赵敏', relation: '子女', phone: '136****1122', screeningStatus: '待筛查', screeningDate: '', result: '' },
  { id: 5, patientName: '陈小红', contactName: '陈大明', relation: '父亲', phone: '135****3344', screeningStatus: '已完成', screeningDate: '2026-06-10', result: '正常' },
])

const filteredArticles = computed(() => {
  if (!filterCategory.value) return articles.value
  return articles.value.filter((a) => a.category === filterCategory.value)
})

function previewArticle(article) {
  previewArticleData.value = article
  showPreview.value = true
}

const patientOptions = ref([
  { value: '1', label: '陈建国 - 肺结核（初治）' },
  { value: '2', label: '王丽华 - HIV 感染' },
  { value: '3', label: '刘志强 - 耐多药结核' },
  { value: '4', label: '张秀英 - HIV 合并乙肝' },
  { value: '5', label: '李明辉 - 肺结核（复治）' },
  { value: '6', label: '周美玲 - 肺结核（初治）' },
  { value: '7', label: '杨伟 - 结核性胸膜炎' },
  { value: '8', label: '黄桂英 - HIV 感染' },
])

const pushForm = ref({
  patients: [],
  articleId: '',
  channel: 'wechat',
  timing: 'immediate',
  scheduledTime: null,
  recurringInterval: 'daily',
  recurringTime: null,
})

const pushRecords = ref([
  { id: 1, patients: '陈建国, 王丽华', article: '肺结核居家隔离指导', channel: 'wechat', timingLabel: '立即推送', pushTime: '2026-07-06 09:00', status: '已推送' },
  { id: 2, patients: '刘志强', article: '结核病防治核心知识', channel: 'wechat', timingLabel: '定时推送', pushTime: '2026-07-07 08:00', status: '已推送' },
  { id: 3, patients: '张秀英, 黄桂英', article: 'HIV 暴露前预防（PrEP）指南', channel: 'sms', timingLabel: '周期性(每周)', pushTime: '每周一 09:00', status: '进行中' },
  { id: 4, patients: '李明辉', article: '家庭消毒与个人防护指南', channel: 'wechat', timingLabel: '立即推送', pushTime: '2026-07-08 10:30', status: '已取消' },
])

function submitPush() {
  const f = pushForm.value
  if (f.patients.length === 0 || !f.articleId || !f.channel) {
    ElMessage.warning('请选择患者、文章和推送方式')
    return
  }
  const article = articles.value.find(a => a.id === f.articleId)
  const selectedPatients = f.patients.map(id => patientOptions.value.find(p => p.value === id)?.label.split(' - ')[0]).join(', ')
  let timingLabel = '立即推送'
  let pushTime = new Date().toLocaleString('zh-CN', { hour12: false })
  if (f.timing === 'scheduled' && f.scheduledTime) {
    timingLabel = '定时推送'
    pushTime = new Date(f.scheduledTime).toLocaleString('zh-CN', { hour12: false })
  } else if (f.timing === 'recurring') {
    const intervalMap = { daily: '每天', weekly: '每周', monthly: '每月' }
    timingLabel = `周期性(${intervalMap[f.recurringInterval] || f.recurringInterval})`
    pushTime = f.recurringTime ? `${intervalMap[f.recurringInterval]} ${new Date(f.recurringTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })}` : ''
  }
  pushRecords.value.unshift({
    id: Date.now(),
    patients: selectedPatients,
    article: article?.title || '',
    channel: f.channel,
    timingLabel,
    pushTime,
    status: f.timing === 'immediate' ? '已推送' : '进行中',
  })
  pushForm.value = { patients: [], articleId: '', channel: 'wechat', timing: 'immediate', scheduledTime: null, recurringInterval: 'daily', recurringTime: null }
  ElMessage.success('推送任务已创建')
}

function addContact() {
  const f = contactForm.value
  if (!f.patientName || !f.contactName || !f.relation) {
    ElMessage.warning('请填写完整信息')
    return
  }
  contactRecords.value.unshift({
    id: Date.now(),
    patientName: f.patientName,
    contactName: f.contactName,
    relation: f.relation,
    phone: f.phone || '未提供',
    screeningStatus: '待筛查',
    screeningDate: '',
    result: '',
  })
  contactForm.value = { patientName: '', contactName: '', relation: '', phone: '' }
  ElMessage.success('密接者已录入，系统将自动发送筛查提醒')
}
</script>

<style scoped>
.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
.edu-tabs {
  margin-top: -4px;
}
.edu-tabs :deep(.el-tabs__header) {
  margin-bottom: 16px;
}
.edu-tabs :deep(.el-tabs__item.is-active) {
  color: var(--el-color-primary);
  font-weight: 600;
}
.edu-tabs :deep(.el-tabs__active-bar) {
  background: var(--el-color-primary);
}
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.article-card {
  background: #fff;
  border: 1px solid #c8dce8;
  border-radius: var(--radius-card);
  padding: 20px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  display: flex;
  flex-direction: column;
}
.article-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}
.article-tag-row {
  margin-bottom: 10px;
}
.article-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #0a2d4d);
  margin-bottom: 8px;
  line-height: 1.4;
}
.article-desc {
  font-size: 13px;
  color: var(--text-muted, #4a7a9a);
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #c8dce8;
}
.article-date {
  font-size: 12px;
  color: var(--text-placeholder, #7a9ab5);
}
.preview-body {
  padding: 0 8px;
}
.preview-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}
.preview-content {
  color: var(--text-secondary, #2c5282);
  line-height: 1.8;
  font-size: 15px;
}
.preview-content h4 {
  color: var(--text-primary, #0a2d4d);
  font-size: 16px;
  margin: 20px 0 8px;
}
.preview-content p {
  margin-bottom: 10px;
}
</style>
