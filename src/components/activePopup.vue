<template>
  <div class="active_popup" v-show="popupAll">
    <!-- <transition name="bounce"> -->
      <Popup v-model="popupShow" @close="onClose" :close-on-click-overlay="shadwClose" :overlay-style="{backgroundColor:'rgba(0, 0, 0, 0.29)'}">
        <div class="pop_box">
          <img id="imgId" class="pop_header" :src="headerUrl">
          <div class="pop_content">
            <div class="pop_tip" v-html="$t(popTitle)"></div>
            <div class="pop_list" v-html="$t(popContent)">
              
            </div>
            <div class="pop_btn" @click="onClose">
              <bgButton :wordColor="btnColor" :btnBgUrl="btnBgUrl" :btnWord="$t('I_got_it')"></bgButton>
            </div>
            <div class="end_time" v-if="endDate">
              {{$t('event_deadline')}}：{{endDate}}
            </div>
          </div>
        </div>
      </Popup>
    <!-- </transition> -->
  </div>
</template>

<script>
import {Popup} from 'vant'
import bgButton from './bgButton'
export default {
  // props:['headerUrl', 'endDate'],
  props:{
    headerUrl: {
      type: String
    },
    endDate:{
      type: String,
      default: ''
    },
    shadwClose:{
      type: Boolean,
      default: true
    },
    btnColor:{
      type: String
    }
  },
  name: 'activePopup',
  components:{Popup, bgButton},
  mounted(){
    
  },
  data(){
    return {
      popupAll: false,
      popupShow: false,
      popTitle:'',
      popContent:'',
      expiryTime:'',
      btnBgUrl: require('../assets/images/btnbg.png'),
    }
  },
  computed:{
    
  },
  methods:{
    // panicBuy(){
    //   this.$emit('btnClick')
    // },
    onClose(){
      this.popupShow = false
      
    },
    isShowPopup(isTrue, title, content, expiryTime){
      if(isTrue){
        this.popupShow = true
        this.popTitle = title
        this.popContent = content
        this.expiryTime = expiryTime
        this.$nextTick(()=>{
          let imgId = document.getElementById('imgId')
          imgId.onload=(()=>{
            this.popupAll = true
          })
        })
      }else{
        this.popupShow = false
      }
    }
  }

}
</script>

<style lang="less" scoped>
.van-popup{
  background-color: transparent;
}
.pop_box{
    width: 260px;
    .pop_header{
      width: 260px;
      // height: 120px;
    }
    .pop_content{
      text-align: center;
      width:260px;
      border-radius:0px 0px 8px 8px;
      margin: 0 auto;
      margin-top: -1px;
      .pop_tip{
        font-size:18px;
        font-weight: bold;
        line-height: 25px;
        padding-top: 7px;
      }
      .pop_list{
        font-weight:500;
        line-height:22px;
        font-size:16px;
        margin-top: 4px;
      }
      .pop_btn{
        padding-top: 6px;
        // padding-bottom: 10px;
      }
      .end_time{
        padding: 7px;
      }
    }
    
  }

</style>
