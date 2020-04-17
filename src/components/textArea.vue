<template>
  <div class="textArea">
    <div class="content" :style="{height:screenH}" contenteditable="true">
      
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'textArea',
  data(){
    return{
      screenH:''
    }
  },
  mounted(){
    this.screenH = window.screen.availHeight+'px'
    
  }

}
</script>

<style lang="less" scoped>
.textArea{
    .content{
      width: 100%;
      overflow-y: auto;
      padding: 10px;
      box-sizing: border-box;
    }
}
</style>
