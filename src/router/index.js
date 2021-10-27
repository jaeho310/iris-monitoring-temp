import Router from 'vue-router'
import Setting from '@/views/settings/SettingIndex'
import Status from '@/views/status/StatusIndex'
import Alarm from '@/views/status/AlarmStatus'
import History from '@/views/status/HistoryStatus'
import Vue from 'vue'

Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/status',
      name: "status",
      component: Status
    },
    {
      path: '/status/history',
      name: "history",
      component: History
    },
    {
      path: '/status/alarm',
      name: "alarm",
      component: Alarm
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting
    },
  ]
})
