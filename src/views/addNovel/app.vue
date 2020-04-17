<template>
  <div class="editNovel">
    <Button class="add_button" type="info" plain hairline size="small" @click="saveEdit">Save</Button>
    <Cell title="Title" :value="editObj.book_name" @click="editText('title')" is-link value-class="value_right"/>
    <Cell center title="Summary" @click="editText('detail')" :label="editObj.book_intro" is-link />
    
    <!-- <Uploader :after-read="afterRead">
      <Cell is-link class="select_img">
          <template #title>
            <div class="img_user">
              <img src="">
              <span type="danger">Edit Cover</span>
            </div>
          </template>
      </Cell>
    </Uploader> -->

    <Cell @click="selectCategor(1)" class="select_draft" title="First Category" :value="cateWord1" is-link/>
    <Cell @click="selectCategor(2)" title="Second Category" :value="cateWord2" is-link/>

    <!-- <Cell title="Language" value="ms" is-link/>
    <Cell title="Status" value="Series" is-link/>
    <Cell title="Chapters" is-link/> -->

    <!-- <Cell class="select_draft" center title="title" label="描述信息"/>
    <Cell center title="title" label="描述信息"/> -->

     <!-- <div class="cropper_box" v-if="showCropper">
      <Icon name="cross" @click="closeCropper"/>
      <Icon name="success" @click="selectCropper"/>
     <vueCropper
        ref="cropper"
        :img="croption.img"
        :outputSize="croption.size"
        :outputType="croption.outputType"
        :info="true"
        :full="croption.full"
        :canMove="croption.canMove"
        :canMoveBox="croption.canMoveBox"
        :original="croption.original"
        :autoCrop="croption.autoCrop"
        :fixed="croption.fixed"
        :fixedNumber="croption.fixedNumber"
        :centerBox="croption.centerBox"
        :infoTrue="croption.infoTrue"
        :fixedBox="croption.fixedBox"
        :autoCropWidth="croption.autoCropWidth"
        :autoCropHeight="croption.autoCropHeight"
      >
      </vueCropper>
    </div> -->
    <Popup
      v-model="popupShow"
      position="bottom"
      :style="{ height: '46%' }"
    >
      <div class="cate_ul">
        <Cell @click="changeCategor(item)" v-for="(item, index) in listData" :key="index" :title="item.class_name"/>
      </div>
    </Popup>
  </div>
</template>

<script>
// import '@/lib/enter'
import {tokenCheck } from '../../lib/token'
import comm from '../../lib/utils/comm'
import utily from '../../lib/utils/utily'
import { Toast, Icon, Cell, Button,Popup } from 'vant'
// import {VueCropper}  from 'vue-cropper' 
import { goTo } from '@/lib/utils/native'
import {params} from '@/lib/utils/variable'
import axios from '@/lib/axios'


export default {
  name: 'editNovel',
  components: { 
    Toast,
    Icon,
    Cell,
    // Uploader,
    Button,
    Popup
    // VueCropper
  },
  data(){
    return {
      // showCropper:false,
      book_id:'',
      cateWord1:'',
      cateWord2:'',
      popupShow:false,
      selectNum:'',
      editObj:{},
      listData:[],
      categoryList1:[],
      categoryList2:[],
      // selectFile:{},
      croption:{
        // img: '', // 裁剪图片的地址
        // info: true, // 裁剪框的大小信息
        // outputSize: 0.8, // 裁剪生成图片的质量
        // outputType: 'jpeg', // 裁剪生成图片的格式
        // canScale: false, // 图片是否允许滚轮缩放
        // autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 300, // 默认生成截图框宽度
        // autoCropHeight: 400, // 默认生成截图框高度
        // fixedBox: false, // 固定截图框大小 不允许改变
        // fixed: true, // 是否开启截图框宽高固定比例
        // fixedNumber: [3, 4], // 截图框的宽高比例
        // // full: true, // 是否输出原图比例的截图
        // canMove: false,
        // canMoveBox: true, // 截图框能否拖动
        // original: false, // 上传图片按照原始比例渲染
        // centerBox: false, // 截图框是否被限制在图片里面
        // infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      }
    }
  },
  created(){
    this.$loading.show()
    this.getInitData()
  },
  mounted(){
    
  },
  computed:{
    

  },
  methods:{
    getInitData(){
      let _this = this
      tokenCheck().then((data)=>{
        axios.get('/v1/writeCenter.bookInfo?original_book_id='+params.book_id).then((res)=>{
          _this.editObj = res.data
          _this.$loading.hide()
          // 获取一级类别
          axios.get('/v1/writeCenter.bookSubClass?class_id=0').then((res)=>{
            _this.categoryList1 = res.data
          })
        })
      })
    },
    selectCategor(num){
      console.log(num);
      
      this.selectNum = num
      if(num==1){
        this.listData = this.categoryList1
      }else{
        this.listData = this.categoryList2
      }
      this.popupShow = true
    },
    changeCategor(item){
      console.log(item);
      let _this = this
      this.popupShow = false
      if(this.selectNum==1){
        this.class_id = item.class_id
        this.cateWord1 = item.class_name
      }else if(this.selectNum==2){
        this.subclass_id = item.class_id
        this.cateWord2 = item.class_name
      }
      if(this.selectNum==1){
        this.$loading.show()
        axios.get('/v1/writeCenter.bookSubClass?class_id='+item.class_id).then((res)=>{
            _this.categoryList2 = res.data
            _this.$loading.hide()
        })
      }
    },
    editText(type){
      // this.$router.push('/textArea')
      goTo('textArea.html?type=')

    },
    // afterRead(file){
    //   console.log(file.file);
    //   let _this = this
    //   let url = URL.createObjectURL(file.file)
    //   this.croption.img = url
    //   this.showCropper = true
    // },
    // closeCropper(){
    //   this.showCropper = false
    // },
    selectCropper(){
      // let _this = this
      // if(this.$refs.cropper.cropW > 600){
      //   Toast({
      //     message: 'Please take a picture smaller than 600px',
      //     position: 'bottom'
      //   })
      //   return false
      // }
      // if(this.$refs.cropper.cropW < 80){
      //   Toast({
      //     message: 'Please take a picture larger than 100px',
      //     position: 'bottom'
      //   })
      //   return false
      // }
      // if(this.$refs.cropper.cropW < 80){
      //   Toast({
      //     message: '请求超时',
      //     position: 'bottom'
      //   })
      //   return false
      // }
      // this.$refs.cropper.getCropData((data) => {
      //   console.log('base64文件',data)  
      // })
    },
    saveEdit(){

    }
    

  }
}
</script>
<style lang="less" scoped>
  .editNovel{
    width: 100%;
    height: 100%;
    .van-uploader{
      display: block;
    }
    .van-uploader /deep/ .van-uploader__input-wrapper{
      width: 100%;
    }
    .value_right{
      float: right;
    }
    .select_img{
      margin: 10px 0;
      display: flex;
      align-items: center;
      .img_user{
        display: flex;
        align-items: center;
        img{
          width: 60px;
          height: 80px;
        }
        span{
          padding-left: 8px;
        }
      }
    }
    .select_draft{
      margin-top: 10px;
    }
    .vue-cropper{
      position: fixed;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, .7);
      background-image: none;
    }
    .cropper_box{
      position: fixed;
      display: flex;
      justify-content: space-between;
      top: 0;
      width: 100%;
      display: flex;
      .van-icon{
        font-size: 26px;
        color: #fff;
        z-index: 9;
        margin: 10px;
      }
      
    }
    .add_button{
      float: right;
      margin: 10px;
    }
  }
  
</style>

