<template>
  <div class="header_btn">
    <Button type="info" plain hairline size="small" @click="saveEdit">
        
    </Button>
  </div>
</template>

<script>
import { Button } from 'vant'

export default {
  mounted(){
    
  },
  props:{
      
  },
  data(){
      return{

      }
  },
  components:{
      Button
  }

}
</script>

<style lang="less" scoped>
.header_btn{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  
}
</style>
