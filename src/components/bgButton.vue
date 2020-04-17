<template>
  <div class="button" :class="{is_invalid: isInvalid}">
    <div class="img_btn" :style="{width: bWidth, height: bHeight}" @click="panicBuy()">
      <div class="btn_word" :style="{color: ableClickColor,fontSize:bFontSize, fontWeight:bIsWeight}">{{btnWord}}</div>
      <img class="btn_bg" :src="btnBgUrl">
    </div>
  
  </div>
</template>

<script>
import utily from '../lib/utils/utily'
export default {
  // props:['btnBgUrl', 'btnWord', 'isInvalid'],
  props:{
    btnBgUrl: String,
    btnWord: String,
    isInvalid:{
      type: Boolean,
      default: false
    },
    width:{
      type: Number,
      default: 150
    },
    height:{
      type: Number,
      default: 36
    },
    wordColor:{
      type: String,
      default: '#ffffff'
    },
    isWeight:{
      type: Boolean,
      default: false
    },
    fontSize:{
      type: Number,
      default: 12
    }
  },
  name: 'buttons',
  mounted(){
    
  },
  data(){
    return {
      
    }
  },
  computed:{
    bWidth(){
      return utily.linePxToRem(this.width)
    },
    bHeight(){
      return utily.linePxToRem(this.height)
    },
    bFontSize(){
      return utily.linePxToRem(this.fontSize)
    },
    bIsWeight(){
      if(this.isWeight){
        return 'bold'
      }
    },
    ableClickColor(){
      if(!this.isInvalid){
        return this.wordColor
      }else{
        return '#ffffff'
      }
    }
  },
  methods:{
    panicBuy(){
      this.$emit('btnClick')
    }
  }

}
</script>

<style lang="less" scoped>
  .img_btn{
      position: relative;
      text-align: center;
      margin: 2px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      .btn_word{
        font-size: 12px;
        z-index: 9;
      }
      .btn_bg{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
  }
  .is_invalid{
    pointer-events: none;
  }
</style>
