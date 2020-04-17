<template>
  <div class="test" >
    <Button type="primary" block @click="btnClick(1)">{{'获取用户信息'}}</Button>
    <Button type="primary" block @click="btnClick(2)">{{'获取app信息'}}</Button>
    <Button type="primary" block @click="btnClick(3)">{{'跳到登陆页'}}</Button>
    <Button type="primary" block @click="btnClick(4)">{{'跳到首页'}}</Button>
    <!-- <Button type="primary" block @click="btnClick(5)">打开默认应用市场</Button> -->
    <Button type="primary" block @click="btnClick(6)">{{'跳到支付'}}</Button>
    <Button type="primary" block @click="btnClick(7)">{{'调用后端接口'}}</Button>
    
    <Field v-model="value1" placeholder="APP内支付进行付款"></Field>
    <Button type="primary" block @click="btnClick(8)">{{'APP内支付进行付款带回掉'}}</Button>
    <Field v-model="value2" id="aaa" placeholder="打开指定的Uri页面"></Field>
    <Button type="primary" block @click="btnClick(9)">{{'打开指定的Uri页面'}}</Button>
    <Field v-model="value3" placeholder="校验Uri是否被APP支持"></Field>
    <Button type="primary" block @click="btnClick(10)">{{'校验Uri是否被APP支持'}}</Button>


    <Field v-model="value4" placeholder="事件的名称"></Field>
    <Field v-model="value5" placeholder="事件的行为"></Field>
    <Button type="primary" block @click="btnClick(11)">{{'测试打点'}}</Button>
  </div>
</template>

<script>
import {Button, Field} from 'vant'

export default {
  name: 'test',
  components: { 
    Button,
    Field
  },
  data(){
    return {
      btnBgUrl: require('../../assets/images/btnbg.png'),
      value1:'cqsc.coins.10',
      value2:'hrxsapp://navigator/novel/book/13193',
      value3:'hrxsapp://navigator/novel/book/13193',
      value4:'请求活动接口',
      value5: JSON.stringify({user_id:48,time:new Date().getTime()})
    }
  },
  created(){
    
  },
  mounted(){
    // const self = this;
    // window.onresize = () => {
    //   console.log('调起了键盘');
      
    // };
  },
  methods:{
    getInitData(){
      let _this = this
      this.$loading.show()
        this.$axios.get('/v1/event.recharge_activity?event_id=141&channel_code=apple&currency=USD').then((res)=>{
            _this.$loading.hide()
            alert(JSON.stringify(res.data))
        })
    },
    
    btnClick(index){
      if(index==1){
        // console.log(this.btnBgUrl);
        let info = window.InteractorProxy.getUserInfo()
        console.log('getUserInfo',window.InteractorProxy.getUserInfo());
        alert(JSON.stringify(info))
      }else if(index==2){
        let appinfo = window.InteractorProxy.app
        console.log('appinfo', appinfo);
        alert(JSON.stringify(appinfo))
      }else if(index==3){
        window.InteractorProxy.login()
      }else if(index==4){
        window.InteractorProxy.open("open.page.HOME")
      }
      // else if(index==5){
      //   window.InteractorProxy.openAppMarket()
      // }
      else if(index==6){
        window.InteractorProxy.open("open.page.PAY")
      }else if(index==7){
          // console.log('fdfd');
        this.getInitData()
      }else if(index==8){
        console.log(this.value1, "function(skuId){alert(JSON.stringify(skuId)))}");
        window.InteractorProxy.purchase(this.value1,function(skuId){
          alert(JSON.stringify(skuId))
          console.log("skuId",JSON.stringify(skuId))
        })
      }else if(index==9){
        console.log(this.value2);
        let isTrue = window.InteractorProxy.openUri(this.value2)
        console.log(isTrue)
        if(isTrue==false || isTrue=='false' || isTrue=='0'){
          alert(isTrue)
        }

      }else if(index==10){
        console.log(this.value3);
        var isSupport = InteractorProxy.isUriValid(this.value3)
        alert(isSupport)
      }else if(index==11){
        console.log(this.value4, this.value5);
        InteractorProxy.logEvent(this.value4, this.value5)
    
      }
    },
    // custInput1(){
    //   // var inputTextBox = document.getElementById('aaa');
    //   // setInterval(function(){
    //   //   inputTextBox.scrollIntoView(true);
    //   // },200)
    // },
    // custInput2(){
    //   // console.log('fouce');
    //   // setTimeout(function(){
    //   //   document.body.scrollTop = document.body.scrollHeight;
    //   // },300)
      
    // }
    

  }
}
</script>
<style lang="less" scoped>
  .test{
      padding: 30px 20px;
      box-sizing: border-box;
      height: 100%;
    //   background-color: #FFA18A;
      // overflow-y: auto;
      button{
          margin-bottom: 22px;
      }
      #aaa{
        width: 100%;
        height: 40px;
      }
  }
  
</style>
