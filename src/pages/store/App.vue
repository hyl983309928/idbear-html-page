<template>
  <div id="app">
    <div class="shopInfo">
      <div class="shopInfo_text">
        <div class="name">{{ storeInfo.chs_name }}</div>
        <div class="price">人均价{{storeInfo.per_head}}元</div>
      </div>
      <img class="shopHeadImg" :src="storeInfo.logo_url" />
    </div>
    <div class="openTime business_time">
      <div class="openTime_text">
        <img src="/static/imgs/time.png">
        <span>营业时间：{{storeInfo.business_time}}</span>
      </div>
    </div>
    <div class="openTime">
      <div class="openTime_text">
        <img src="/static/imgs/address.png">
        <span @click="goMap">{{storeInfo.location}}</span>
      </div>
      <div class="phone">
        <a :href="`tel:${storeInfo.phone}`"><img src="/static/imgs/phone.png"></a>
      </div>
    </div>
    <div class="grayBar"></div>
    <div class="hotspot">
      <div class="hotspot_title">
        <img class="hot" src="/static/imgs/hot.png">
        <span>热点推荐</span>
      </div>
      <div class="hotspot_info">
        <div class="hotspot_info_item" v-for="(item) in storeInfo.hotspot" :key="item.ordering" v-if="item.pic_url">
          <div class="hotspot_info_item_box">
            <img src="/static/imgs/hotLogo.jpg" class="hotText" />
            <img :src="item.pic_url">
            <span class="item_name">{{item.desc}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="grayBar"></div>
    <div class="information">
      <div class="information_title">
        <img src="/static/imgs/msg.png">
        <span>品牌资讯</span>
      </div>
      <div class="information_info">
        <div class="information_info_item" v-for="item in storeInfo.informations" :key="item.ordering" v-if="item.desc">
          <span class="spot"></span>
          <span @click="item.click_url?openUrl(item.click_url):''">{{item.desc}}</span>
        </div>
      </div>
    </div>
    <div class="grayBar"></div>
    <div class="classify">
      <div class="classify_item" v-for="(item,index) in classifyIconInfo" :key="index">
        <img
          @click="storeInfo.funcs[index].click_url ? openUrl(storeInfo.funcs[index].click_url) : ''"
          :src="`/static/imgs/addStore/${item.iconName}`"
          :class="[storeInfo.funcs[index].click_url ? '' : 'filter-gray']"
        />
        <span>{{classifyIconInfo[index].name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/lib/config'
import { getShareParamter, setWechatTitle } from '@/utils/common'
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      id: '',
      robotId: '',
      robotInfo: {},
      classifyIconInfo: config.classifyIconInfo,
      storeInfo: {
        chs_name: '',
        logo_url: '',
        cover_log_url: { thumb_url: '', expand: [], parse_expand: [] },
        hotspot: [{ desc: '', pic_url: '', ordering: 1, design_type: 1 }, { desc: '', pic_url: '', ordering: 2, design_type: 1 }, { desc: '', pic_url: '', ordering: 3, design_type: 1 }],
        store_area_list: [],
        store_area: '',
        location: '',
        map_location: '',
        informations: [{ desc: '', click_url: '', design_type: 3, ordering: 1 }, { desc: '', click_url: '', design_type: 3, ordering: 2 }, { desc: '', click_url: '', design_type: 3, ordering: 3 }],
        business_time: '',
        per_head: '',
        funcs: [{ click_url: '', design_type: 2, ordering: 1 }, { click_url: '', design_type: 2, ordering: 2 }, { click_url: '', design_type: 2, ordering: 3 }, { click_url: '', design_type: 2, ordering: 4 }, { click_url: '', design_type: 2, ordering: 5 }, { click_url: '', design_type: 2, ordering: 6 }, { click_url: '', design_type: 2, ordering: 7 }, { click_url: '', design_type: 2, ordering: 8 }]
      }
    }
  },
  created () {
    this.id = getShareParamter('id')
    this.robotId = getShareParamter('robot_id')
    this.getStoreInfo()
    this.getRobotInfo()
  },
  methods: {
    openUrl (url) {
      window.open(url)
    },
    getRobotInfo () {
      return this.$api.user.getRobotInfo(this.robotId)
        .then((data) => {
          this.robotInfo = data
          let wechatname = data.wechataccount_name || '商户中间页'
          setWechatTitle(`${wechatname}`)
        })
    },
    getStoreInfo () {
      this.$api.store.getStoreInfo(this.id, this.robotId)
        .then((data) => {
          this.storeInfo = data
        })
    },
    goMap () {
      if (this.storeInfo.map_location) {
        let mapLink = `http://api.map.baidu.com/geocoder?location=${this.storeInfo.map_location}&output=html&src=webapp.baidu.openAPIdemo`
        this.openUrl(mapLink)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/style/variate.scss";
  .shopInfo{
    height: 1.9rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 0.3rem;
    .shopInfo_text{
      display: inline-block;
      margin-right: 0.2rem;
      text-align: right;
      .name{
        font-size: 0.4rem;
        margin-bottom: 0.1rem;
        color: #000;
      }
      .price{
        font-size: 0.18rem;
        color: rgb(153,153,153);
      }
    }
    .shopHeadImg{
      width:1.24rem;
      height:1.24rem;
      border-radius: 50% 50%;
    }
  }
  .openTime{
    padding: 0.3rem;
    position: relative;
    .openTime_text{
      display: inline-flex;
      align-items: center;
      i{
        font-size: 0.28rem;
        color: #000;
        font-weight: bold;
      }
      img{
        width:0.36rem;
      }
      span{
        display: inline-block;
        font-size: 0.24rem;
        color: #666666;
        margin-left: 0.20rem;
      }
    }
    .phone{
      width:1.2rem;
      text-align: center;
      display: inline-block;
      position: absolute;
      right: 0.4rem;
      font-size: 0.32rem;
      border-left: 1px solid #e8e8e8;
      img{
        width:0.36rem;
      }
    }
  }
  .hotspot{
    padding: 0.30rem;
    .hotspot_title{
      display: flex;
      align-items: center;
      margin-bottom: 0.2rem;
      i{
        font-size: 0.36rem;
      }
      img{
        width:0.36rem;
      }
      span{
        display: inline-block;
        font-size: 0.24rem;
        color: #000;
        margin-left: 0.20rem;
      }
    }
    .hotspot_info{
      font-size: 0;
      display: flex;
      .hotspot_info_item{
        width: 33.33%;
        text-align: center;
        position: relative;
      }
      .hotspot_info_item_box{
        display: inline-block;
        width: 2.2rem;
        height: 1.8rem;
        position: relative;
        .hotText{
          width:0.5rem;
          height: 0.24rem;
          position: absolute;
          top: 0;
          left: 0;
        }
        .item_name{
          width: 100%;
          position: absolute;
          bottom: 0;
          left: 0;
          font-size: 0.28rem;
          display: inline-block;
          background: rgba(0,0,0,0.3);
          color: #fff;
          text-align: center;
        }
        img{
          width:100%;
          height: 100%;
        }
      }
    }
  }

  .information{
    padding: 0.3rem;
    .information_title{
      display: flex;
      align-items: center;
      padding-bottom: 0.24rem;
      border-bottom: 1px solid #e8e8e8;
      img{
        width:0.34rem;
      }
      span{
        display: inline-block;
        font-size: 0.24rem;
        color: #000;
        margin-left: 0.20rem;
      }
    }
    .information_info{
      padding: 0 0.16rem;
      .information_info_item{
        color: #333;
        margin-top: 0.26rem;
        display: flex;
        align-items: center;
        .spot{
          display: inline-block;
          width: 0.08rem;
          height: 0.08rem;
          border-radius: 50% 50%;
          background: #b8b8b8;
          margin-right: 0.1rem;
        }
      }
    }
  }
  .classify{
    padding: 0.3rem;
    padding-bottom: 0;
    display: flex;
    flex-wrap: wrap;
    .classify_item{
      text-align: center;
      width:25%;
      margin-bottom: 0.3rem;
      img{
        width: 0.9rem;
        height: 0.9rem;
      }
      span{
        display: block;
      }
    }
  }

  .filter-gray{
    filter: grayscale(100%);
    filter: gray;
  }
</style>
