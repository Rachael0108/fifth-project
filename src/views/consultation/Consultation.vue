<template>
  <div class="consultation">
    <div class="page-header">
      <h2>线上问诊</h2>
      <el-tag type="success" round>在线医生: 2</el-tag>
    </div>

    <el-row :gutter="20" style="height: calc(100vh - 180px)">
      <el-col :span="7">
        <el-card shadow="never" class="section-card" style="height: 100%">
          <template #header><span>患者列表</span></template>
          <div class="patient-list">
            <div
              v-for="patient in patientList"
              :key="patient.id"
              class="patient-item"
              :class="{ active: currentPatient?.id === patient.id }"
              @click="selectPatient(patient)"
            >
              <el-badge :value="patient.unread" :hidden="!patient.unread">
                <el-avatar :size="36" :style="{ background: patient.color }">
                  {{ patient.name.charAt(0) }}
                </el-avatar>
              </el-badge>
              <div class="patient-info">
                <div class="patient-top">
                  <span class="patient-name">{{ patient.name }}</span>
                  <span class="patient-time">{{ patient.lastTime }}</span>
                </div>
                <div class="patient-last-msg">{{ patient.lastMsg }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="17">
        <el-card shadow="never" class="section-card chat-card" style="height: 100%">
          <template #header>
            <div class="chat-header">
              <div class="chat-header-left" v-if="currentPatient">
                <el-avatar :size="32" :style="{ background: currentPatient.color }">
                  {{ currentPatient.name.charAt(0) }}
                </el-avatar>
                <span style="font-weight: 600; color: var(--text-primary, #0a2d4d)">{{ currentPatient.name }}</span>
                <div style="font-size: 12px; color: #38a169">● 在线</div>
              </div>
              <span v-else style="color: var(--text-placeholder, #7a9ab5)">请选择左侧患者开始沟通</span>
            </div>
          </template>

          <div v-if="currentPatient" ref="messageListRef" class="message-area">
            <template v-for="group in groupedMessages" :key="group.date">
              <div class="date-divider">{{ group.date }}</div>
              <div
                v-for="msg in group.msgs"
                :key="msg.id"
                class="message-item"
                :class="{ self: msg.isSelf }"
              >
                <el-avatar
                  v-if="!msg.isSelf"
                  :size="32"
                  :style="{ background: currentPatient.color }"
                >{{ currentPatient.name.charAt(0) }}</el-avatar>
                <div class="message-body">
                  <div class="message-bubble">{{ msg.content }}</div>
                  <div class="message-time">{{ msg.time }}</div>
                </div>
                <el-avatar
                  v-if="msg.isSelf"
                  :size="32"
                  style="background: linear-gradient(135deg, #0066cc, #3399ff)"
                >张</el-avatar>
              </div>
            </template>
          </div>

          <div v-else class="no-chat">
            <el-icon :size="48" color="#c8dce8"><ChatDotRound /></el-icon>
            <p>选择患者，开始沟通</p>
          </div>

          <div v-if="currentPatient" class="chat-input-area">
            <el-input
              v-model="inputMsg"
              type="textarea"
              :rows="2"
              placeholder="输入消息..."
              resize="none"
              @keyup.enter.prevent="sendMessage"
            />
            <div class="input-bar">
              <div class="input-tools">
                <el-tooltip content="图片"><el-button text :icon="Picture" /></el-tooltip>
                <el-tooltip content="语音"><el-button text :icon="Microphone" /></el-tooltip>
                <el-tooltip content="表情"><el-button text :icon="Operation" /></el-tooltip>
              </div>
              <el-button type="primary" :icon="Promotion" @click="sendMessage">发送</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { ChatDotRound, Picture, Microphone, Operation, Promotion } from '@element-plus/icons-vue'

const inputMsg = ref('')
const currentPatient = ref(null)
const messageListRef = ref(null)

const patientList = ref([
  { id: 1, name: '陈建国', unread: 2, lastMsg: '好的，谢谢医生', lastTime: '10:30', color: '#e53e3e' },
  { id: 2, name: '王丽华', unread: 0, lastMsg: '明天几点复查？', lastTime: '昨天', color: '#d69e2e' },
  { id: 3, name: '刘志强', unread: 1, lastMsg: '我有点咳嗽', lastTime: '昨天', color: '#38a169' },
  { id: 4, name: '张秀英', unread: 0, lastMsg: '收到了，谢谢', lastTime: '2026-07-05', color: '#0066cc' },
])

const allMessages = {
  1: [
    { id: 1, content: '医生您好，我最近服药后有点恶心', time: '10:00', isSelf: false, date: '今天' },
    { id: 2, content: '这是正常的药物反应，建议饭后服药，如果持续不适请来复诊', time: '10:05', isSelf: true, date: '今天' },
    { id: 3, content: '好的，我试试饭后吃', time: '10:10', isSelf: false, date: '今天' },
    { id: 4, content: '嗯，记得按时服药，下周二来复查', time: '10:15', isSelf: true, date: '今天' },
  ],
  2: [
    { id: 5, content: '明天几点来复查比较方便？', time: '15:20', isSelf: false, date: '昨天' },
    { id: 6, content: '上午 9 点到 11 点都可以，直接来门诊找我', time: '15:25', isSelf: true, date: '昨天' },
    { id: 7, content: '好的，那我明早过去', time: '15:30', isSelf: false, date: '昨天' },
  ],
  3: [
    { id: 8, content: '医生，我这两天有点咳嗽，有关系吗？', time: '14:00', isSelf: false, date: '昨天' },
    { id: 9, content: '咳嗽持续多久了？有没有发热？', time: '14:05', isSelf: true, date: '昨天' },
  ],
  4: [
    { id: 10, content: '上次的检查报告我已经看到了，一切正常', time: '09:00', isSelf: false, date: '2026-07-05' },
    { id: 11, content: '好的，继续保持，按时服药', time: '09:10', isSelf: true, date: '2026-07-05' },
    { id: 12, content: '收到了，谢谢', time: '09:15', isSelf: false, date: '2026-07-05' },
  ],
}

const messages = ref([])

const groupedMessages = computed(() => {
  const map = {}
  messages.value.forEach((m) => {
    if (!map[m.date]) map[m.date] = { date: m.date, msgs: [] }
    map[m.date].msgs.push(m)
  })
  return Object.values(map)
})

function selectPatient(patient) {
  currentPatient.value = patient
  patient.unread = 0
  messages.value = allMessages[patient.id] || []
  nextTick(() => scrollToBottom())
}

function sendMessage() {
  if (!inputMsg.value.trim() || !currentPatient.value) return
  const msg = {
    id: Date.now(),
    content: inputMsg.value.trim(),
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isSelf: true,
    date: '今天',
  }
  messages.value.push(msg)
  inputMsg.value = ''
  nextTick(() => scrollToBottom())
}

function scrollToBottom() {
  const el = messageListRef.value
  if (el) el.scrollTop = el.scrollHeight
}
</script>

<style scoped>
.patient-list {
  overflow-y: auto;
  height: calc(100% - 52px);
  margin: 0 -4px;
}
.patient-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 10px;
  cursor: pointer;
  border-radius: 10px;
  transition: background 0.15s;
  margin-bottom: 2px;
}
.patient-item:hover,
.patient-item.active {
  background: #e0f2fe;
}
.patient-info {
  flex: 1;
  min-width: 0;
}
.patient-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.patient-name {
  font-weight: 600;
  font-size: 14px;
}
.patient-time {
  font-size: 11px;
  color: var(--text-placeholder, #7a9ab5);
}
.patient-last-msg {
  font-size: 12px;
  color: var(--text-placeholder, #7a9ab5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
}
.chat-card { display: flex; flex-direction: column; }
.chat-header {
  display: flex;
  align-items: center;
}
.chat-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.message-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  background: #f0f7ff;
}
.no-chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-placeholder, #7a9ab5);
}
.date-divider {
  text-align: center;
  font-size: 12px;
  color: var(--text-placeholder, #7a9ab5);
  margin: 16px 0;
  position: relative;
}
.date-divider::before,
.date-divider::after {
  content: '';
  display: inline-block;
  width: 60px;
  height: 1px;
  background: #c8dce8;
  vertical-align: middle;
  margin: 0 10px;
}
.message-item {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  align-items: flex-start;
}
.message-item.self {
  flex-direction: row-reverse;
}
.message-body {
  max-width: 60%;
}
.message-bubble {
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.message-item.self .message-bubble {
  background: #0066cc;
  color: #fff;
  border-bottom-right-radius: 4px;
}
.message-item:not(.self) .message-bubble {
  border-bottom-left-radius: 4px;
}
.message-time {
  font-size: 11px;
  color: var(--text-placeholder, #7a9ab5);
  margin-top: 4px;
}
.message-item.self .message-time {
  text-align: right;
}
.chat-input-area {
  border-top: 1px solid #c8dce8;
  padding: 12px 16px;
  background: #fff;
}
.input-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
.input-tools {
  display: flex;
  gap: 2px;
}
</style>
