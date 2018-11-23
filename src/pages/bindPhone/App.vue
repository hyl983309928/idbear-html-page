<template>
  <div class="page">
    <div v-if="!isBindMobile">
      <group>
        <x-input ref="mobile" required v-model="mobile" class="weui-vcode" :max="13" is-type="china-mobile" placeholder="请输入手机号">
        </x-input>
        <x-input ref="code" required v-model="code" class="weui-vcode" placeholder="请输入验证码">
          <template slot="right">
            <a class="send-code" v-if="!sendMsgInfo.isSend" @click="sendCode">获取验证码</a>
            <span class="send-code" style="color: #666;" v-if="sendMsgInfo.isSend">{{`已发送(${sendMsgInfo.time}秒)`}}</span>
          </template>
        </x-input>
      </group>
      <div class="confim-btn">
        <x-button @click.native="submitMobile" class="btn">确定</x-button>
      </div>
    </div>
    <div class="bind-success-box" v-else>
      <div>
        <icon class="success-icon" type="success" is-msg></icon>
      </div>
      <div class="success-text">
        验证成功
      </div>
      <div class="success-desc">
        绑定成功，请返回重新查询！
      </div>
      <div class="back-btn">
        <x-button @click.native="back" class="btn">返回</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { XInput, Group, XButton, Icon } from 'vux'
import { getShareParamter } from '@/utils/common'
export default {
  components: {
    Group,
    XInput,
    XButton,
    Icon
  },
  data () {
    return {
      isBindMobile: false,
      mobile: '',
      code: '',
      sendMsgInfo: {
        isSend: false,
        time: 60
      }
    }
  },
  computed: {},
  created () {
  },
  methods: {
    back () {
      if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) { // IE
        if (history.length > 0) {
          window.history.go(-1)
        } else {
          window.opener = null
          window.open('', '_self')
          window.close()
          WeixinJSBridge.call('closeWindow') // eslint-disable-line
        }
      } else {
        if (navigator.userAgent.indexOf('Firefox') >= 0 ||
          navigator.userAgent.indexOf('Opera') >= 0 ||
          navigator.userAgent.indexOf('Safari') >= 0 ||
          navigator.userAgent.indexOf('Chrome') >= 0 ||
          navigator.userAgent.indexOf('WebKit') >= 0) {
          if (window.history.length > 1) {
            window.history.go(-1)
          } else {
            window.opener = null
            window.open('', '_self')
            window.close()
            WeixinJSBridge.call('closeWindow') // eslint-disable-line
          }
        } else { // 未知的浏览器
          window.history.go(-1)
        }
      }
      // window.history.back()
    },
    submitMobile () {
      this.$refs.mobile.onBlur()
      this.$refs.code.onBlur()
      if (this.mobile && this.code) {
        let params = {
          mobile: this.mobile,
          code: this.code,
          openid: getShareParamter('openid')
        }
        this.$api.user.bindMobileToWechat(params)
          .then(() => {
            this.isBindMobile = true
          })
          .catch((err) => {
            if (err.message.toString().indexOf('timeout') === -1 && err.message !== 'Network Error') {
              let errMsg = '添加失败，请重试'
              Object.keys(err.response.data).forEach((key) => {
                if (Object.prototype.toString.call(err.response.data[key]) === '[object Array]') {
                  errMsg = err.response.data[key][0]
                } else {
                  errMsg = err.response.data[key]
                }
                return ''
              })
              this.$vux.toast.show({
                text: errMsg,
                type: 'text',
                width: '14em'
              })
            }
          })
      }
    },
    sendCode () {
      this.$api.user.smscode(this.mobile, 'bind')
        .then((data) => {
          this.$vux.toast.show({
            text: '发送成功',
            type: 'text'
          })
          this.sendMsgInfo.isSend = true
          this.sendMsgInfo.time = 60
          let timer = setInterval(() => {
            this.sendMsgInfo.time -= 1
            if (this.sendMsgInfo.time === 0) {
              this.sendMsgInfo.isSend = false

              clearInterval(timer)
            }
          }, 1000)
        })
        .catch((err) => {
          if (err.message.toString().indexOf('timeout') === -1 && err.message !== 'Network Error') {
            let errMsg = '发送失败，请重试'
            Object.keys(err.response.data).forEach((key) => {
              errMsg = err.response.data[key][0]
              return ''
            })
            this.$vux.toast.show({
              text: errMsg,
              type: 'text',
              width: '14em'
            })
          }
        })
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
  .page{
    background: #F5F4F9;
    min-height: 100%;
    position: relative;
    overflow: hidden;
  }
  .send-code{
    font-size: 0.24rem;
  }
  .confim-btn{
    margin-top: 0.4rem;
    text-align: center;
    padding: 0 0.2rem;
    .btn{
      background-image: linear-gradient(0deg,
        rgba(18, 115, 232, 1) 0%,
        rgba(40, 163, 241, 1) 100%);
      color: #fff;
      &:active{
        background: #66b1ff;
        color: #fff;
      }
    }
  }

  .bind-success-box{
    text-align: center;
    padding-top: 2.32rem;
    .success-icon{
      font-size: 1.2rem;
    }
    .success-text{
      font-size: 0.34rem;
      font-weight: 400;
      color: #101010;
      margin-top: 0.5rem;
    }
    .success-desc{
      color: #999999;
      margin-top: 0.2rem;
    }
    .back-btn{
      margin-top: 1.5rem;
      text-align: center;
      padding: 0 0.2rem;
      .btn{
        background-image: linear-gradient(0deg,
          rgba(18, 115, 232, 1) 0%,
          rgba(40, 163, 241, 1) 100%);
        color: #fff;
        height: 0.86rem;
        font-size: 0.34rem;
        &:active{
          background: #66b1ff;
          color: #fff;
        }
      }
    }
  }

</style>
