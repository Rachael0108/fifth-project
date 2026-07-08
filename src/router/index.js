import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layout/AppLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { title: '运营看板', icon: 'DataBoard' },
      },
      {
        path: 'patient',
        name: 'PatientList',
        component: () => import('@/views/patient/PatientList.vue'),
        meta: { title: '患者档案', icon: 'User' },
      },
      {
        path: 'patient/:id',
        name: 'PatientDetail',
        component: () => import('@/views/patient/PatientDetail.vue'),
        meta: { title: '患者详情', hidden: true },
      },
      {
        path: 'alert',
        name: 'AlertList',
        component: () => import('@/views/alert/AlertList.vue'),
        meta: { title: '智能预警', icon: 'WarningFilled' },
      },
      {
        path: 'consultation',
        name: 'Consultation',
        component: () => import('@/views/consultation/Consultation.vue'),
        meta: { title: '线上问诊', icon: 'ChatDotRound' },
      },
      {
        path: 'assessment',
        name: 'Assessment',
        component: () => import('@/views/assessment/Assessment.vue'),
        meta: { title: '评估模块', icon: 'List' },
      },
      {
        path: 'medication',
        name: 'Medication',
        component: () => import('@/views/medication/Medication.vue'),
        meta: { title: '服药复诊', icon: 'AlarmClock' },
      },
      {
        path: 'education',
        name: 'Education',
        component: () => import('@/views/education/Education.vue'),
        meta: { title: '健康教育', icon: 'Reading' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
