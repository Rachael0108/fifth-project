<template>
  <div class="consultation">
    <div class="page-header">
      <h2>线上问诊</h2>
      <el-tag type="success" effect="light" size="small">
        <span class="online-dot" />在线医生 2 人
      </el-tag>
    </div>

    <div class="chat-layout">
      <!-- 患者列表 -->
      <div class="patient-panel">
        <div class="panel-header">
          <span>患者列表</span>
          <el-input
            v-model="searchKey"
            placeholder="搜索患者"
            :prefix-icon="Search"
            size="small"
            clearable
            class="search-input"
          />
        </div>
        <div class="patient-list">
          <div
            v-for="patient in filteredPatients"
            :key="patient.id"
            class="patient-item"
            :class="{ active: currentPatient?.id === patient.id }"
            @click="selectPatient(patient)"
          >
            <el-badge :value="patient.unread" :hidden="!patient.unread" :max="99">
              <el-avatar :size="42" class="patient-avatar">
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
      </div>

      <!-- 聊天区域 -->
      <div class="chat-panel">
        <template v-if="currentPatient">
          <div class="chat-topbar">
            <div class="chat-topbar-left">
              <el-avatar :size="36" class="patient-avatar">
                {{ currentPatient.name.charAt(0) }}
              </el-avatar>
              <div>
                <div class="chat-patient-name">{{ currentPatient.name }}</div>
                <div class="chat-patient-status"><span class="online-dot" />在线</div>
              </div>
            </div>
          </div>

          <div ref="messageListRef" class="message-area">
            <template v-for="group in groupedMessages" :key="group.date">
              <div class="date-divider">
                <span>{{ group.date }}</span>
              </div>
              <div
                v-for="msg in group.msgs"
                :key="msg.id"
                class="message-item"
                :class="{ self: msg.isSelf }"
              >
                <el-avatar
                  v-if="!msg.isSelf"
                  :size="36"
                  class="patient-avatar"
                >{{ currentPatient.name.charAt(0) }}</el-avatar>
                <div class="message-body">
                  <div class="message-bubble">{{ msg.content }}</div>
                  <div class="message-time">{{ msg.time }}</div>
                </div>
                <el-avatar
                  v-if="msg.isSelf"
                  :size="36"
                  class="doctor-avatar"
                >张</el-avatar>
              </div>
            </template>
          </div>

          <div class="chat-input-area">
            <el-input
              v-model="inputMsg"
              type="textarea"
              :rows="3"
              placeholder="输入消息，Enter 发送..."
              resize="none"
              @keydown.enter.exact.prevent="sendMessage"
            />
            <div class="input-bar">
              <div class="input-tools">
                <el-tooltip content="图片"><el-button text :icon="Picture" /></el-tooltip>
                <el-tooltip content="常用回复"><el-button text :icon="ChatLineSquare" /></el-tooltip>
              </div>
              <el-button type="primary" :icon="Promotion" @click="sendMessage">发送</el-button>
            </div>
          </div>
        </template>

        <div v-else class="no-chat">
          <div class="no-chat-icon">
            <el-icon :size="48"><ChatDotRound /></el-icon>
          </div>
          <p>选择左侧患者开始沟通</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { ChatDotRound, Promotion, Picture, ChatLineSquare, Search } from '@element-plus/icons-vue'

const inputMsg = ref('')
const searchKey = ref('')
const currentPatient = ref(null)
const messageListRef = ref(null)

const patientList = ref([
  { id: 1, name: '陈建国', unread: 2, lastMsg: '好的，谢谢医生', lastTime: '10:30' },
  { id: 2, name: '王丽华', unread: 0, lastMsg: '明天几点复查？', lastTime: '昨天' },
  { id: 3, name: '刘志强', unread: 1, lastMsg: '我有点咳嗽', lastTime: '昨天' },
  { id: 4, name: '张秀英', unread: 0, lastMsg: '收到了，谢谢', lastTime: '07-05' },
])

const filteredPatients = computed(() => {
  if (!searchKey.value.trim()) return patientList.value
  const kw = searchKey.value.trim()
  return patientList.value.filter((p) => p.name.includes(kw))
})

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
.online-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
  margin-right: 4px;
  vertical-align: middle;
}

.chat-layout {
  display: flex;
  gap: 16px;
  height: calc(100vh - var(--navbar-height) - 100px);
  min-height: 520px;
}

/* 患者列表 */
.patient-panel {
  width: 300px;
  flex-shrink: 0;
  background: #fff;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.panel-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.panel-header span {
  font-weight: 600;
  font-size: 15px;
  color: var(--text-primary);
}
.search-input {
  width: 100%;
}
.patient-list {
  flex: 1;
  overflow-y: auto;
}
.patient-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #F3F4F6;
}
.patient-item:hover {
  background: #F9FAFB;
}
.patient-item.active {
  background: #E6F4FF;
}
.patient-avatar {
  background: #6B7280;
  font-size: 15px;
  flex-shrink: 0;
}
.patient-info {
  flex: 1;
  min-width: 0;
}
.patient-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.patient-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}
.patient-time {
  font-size: 11px;
  color: var(--text-placeholder);
  flex-shrink: 0;
}
.patient-last-msg {
  font-size: 13px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 聊天面板 */
.chat-panel {
  flex: 1;
  background: #fff;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}
.chat-topbar {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-light);
  background: #fff;
}
.chat-topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.chat-patient-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--text-primary);
}
.chat-patient-status {
  font-size: 12px;
  color: var(--color-success);
  margin-top: 2px;
}

/* 消息区 */
.message-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  background: #F0F2F5;
}
.date-divider {
  text-align: center;
  margin: 8px 0 20px;
}
.date-divider span {
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  color: var(--text-muted);
  background: rgba(0, 0, 0, 0.06);
  border-radius: 10px;
}
.message-item {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: flex-start;
}
.message-item.self {
  justify-content: flex-end;
}
.message-body {
  max-width: 62%;
}
.message-bubble {
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.65;
  word-break: break-word;
  position: relative;
}
.message-item:not(.self) .message-bubble {
  background: #fff;
  color: var(--text-regular);
  border-radius: 4px 12px 12px 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.message-item.self .message-bubble {
  background: var(--el-color-primary);
  color: #fff;
  border-radius: 12px 4px 12px 12px;
  box-shadow: 0 1px 2px rgba(22, 119, 255, 0.2);
}
.message-time {
  font-size: 11px;
  color: var(--text-placeholder);
  margin-top: 6px;
  padding: 0 4px;
}
.message-item.self .message-time {
  text-align: right;
}
.doctor-avatar {
  background: var(--el-color-primary);
  font-size: 14px;
  flex-shrink: 0;
}

/* 空状态 */
.no-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-muted);
  background: #FAFAFA;
}
.no-chat-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #F0F2F5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #C0C4CC;
}
.no-chat p {
  font-size: 14px;
}

/* 输入区 */
.chat-input-area {
  border-top: 1px solid var(--border-light);
  padding: 16px 20px;
  background: #fff;
}
.input-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.input-tools {
  display: flex;
  gap: 4px;
}
</style>
