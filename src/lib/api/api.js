import { apiRequest } from '@/utils/request.js'

export default {
  store: {
    getStoreInfo (id, robotId) {
      return apiRequest(`/store/${id}/?robot_id=${robotId}`, 'get')
    }
  },
  user: {
    /*
    * desc: 发送短信验证码
    * params mobile: 手机号
    * params type: 短信验证码的类型
    * */
    smscode (mobile, type) {
      let params = {
        mobile
      }
      if (type === 'bind') {
        params.template_code = 'SMS_135029793'
      }
      return apiRequest('/smscode/', 'post', params)
    },
    /*
    * desc: 绑定手机号到微信用户上
    * */
    bindMobileToWechat (params) {
      return apiRequest('/bindmobiletowechat/', 'post', params)
    },
    getRobotInfo (robotId) {
      return apiRequest('/robot/detail/', 'get', { robot_id: robotId })
    }
  }
}
