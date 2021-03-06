// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import '@/utils/flexible'
import '@/style/index.scss'
import api from '@/lib/api/api.js'
import { ToastPlugin } from 'vux'
Vue.use(ToastPlugin)
Vue.config.productionTip = false
Vue.prototype.$api = api
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
