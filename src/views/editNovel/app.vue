

<template>
  <div class="addNovel">
    <Button class="add_button" type="info" plain hairline size="small" @click="editWork">Save</Button>
    <Field v-model="editObj.book_name" placeholder="Novel Title"></Field>
    <Field v-model="editObj.book_intro" type="textarea" placeholder="Write a description of your novel"></Field>
    <!-- <Cell title="Title" value="content" @click="editText('title')" is-link value-class="value_right"/>
    <Cell center title="Summary" @click="editText('detail')" label="描述信息" is-link /> -->

    <Field v-model="editObj.lead_name" class="select_draft" placeholder="Protagonist name"></Field>

    <Cell @click="selectCategor(1)" class="select_draft" title="First Category" :value="cateWord1" is-link/>
    <Cell v-show="categoryList2.length!=0" @click="selectCategor(2)" title="Second Category" :value="cateWord2" is-link/>

    <!-- <Cell class="select_draft" center title="title" label="描述信息"/> -->
    <Popup
      v-model="popupShow"
      position="bottom"
      :style="{ height: '46%' }"
    >
      <div class="cate_ul">
        <!-- <li v-for="(item, index) in categoryList" :key="index">{{item.class_name}}</li> -->
        <Cell @click="changeCategor(item)" v-for="(item, index) in listData" :key="index" :title="item.class_name"/>
      </div>
    </Popup>

    <div class="chapter_box" v-if="isEdit">
      <Sticky>
      <div class="chapter_nav">
        <span>Chapters</span>

        <span class="cha_button">
          <Button icon="plus" type="primary" size="smail" @click="addChapter"></Button>
        </span>
      </div>
      </Sticky>
      <!-- <Divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">Chapters</Divider> -->
      <List v-model="listLoading" loading-text="loading" :offset="10" :finished="listFinish" finished-text="No More" @load="getChapterList">
        <Cell @click="toEditChapter(item)" v-for="(item, index) in chapterList" :key="index" :title="item.chapter_title" is-link>
          <template slot="label">
            <span class="cha_status" :style="{color: filtChatStatu(item).color}">{{filtChatStatu(item).name}}</span>
            <span class="cha_time">{{item.chapter_addtime}}</span>
          </template>
        </Cell>
      </List>
      <!-- <Field v-model="editObj.book_intro" type="textarea" placeholder="Write a description of your novel"></Field> -->

      

      
    </div>
    
  </div>
</template>
<script>
// import '@/lib/enter'
import {tokenCheck } from '@/lib/token'
import comm from '@/lib/utils/comm'
import utily from '@/lib/utils/utily'
import { Toast, Icon, Cell, Field, Button,Popup, List,Sticky } from 'vant'
import { goTo } from '@/lib/utils/native'
import axios from '@/lib/axios'
import {params} from '@/lib/utils/variable'
import {bookStatus} from '@/lib/utils/norFormat'

export default {
  name: 'editNovel',
  components: { 
    Toast,
    Icon,
    Cell,
    Field,
    Button,
    Popup,
    List,
    Sticky
  },
  data(){
    return {
      editObj:{},
      paramObj:{},
      isEdit: false,
      listData:[],
      categoryList1:[],
      categoryList2:[],
      chapterList:[],
      class_id:'',
      subclass_id:'',
      popupShow:false,
      selectNum:'',
      cateWord1:'',
      cateWord2:'',
      listLoading: false,
      listFinish: false,
      currentPage:1
    }
  },
  filters:{
    
  },
  created(){
    this.paramObj = params
    // console.log('params',this.paramObj);
    if(this.paramObj.type=='edit'){
      this.isEdit = true
      this.$loading.show()
    }
    this.getInitData()
    // this.$loading.show()
  },
  mounted(){
   
  },
  computed:{
    
  },
  methods:{
    getInitData(){
      let _this = this
      tokenCheck().then((data)=>{
        if(_this.isEdit){
          axios.get('/v1/writeCenter.bookInfo?original_book_id='+_this.paramObj.book_id).then((res)=>{
            _this.editObj = res.data
            _this.bookCategory(0,1,(()=>{
              _this.categoryList1.forEach((re)=>{
                if(re.class_id == _this.editObj.class_id){
                  _this.cateWord1 = re.class_name  
                  _this.class_id = re.class_id             
                }
              })
               _this.bookCategory(_this.editObj.class_id,2,(()=>{
                  _this.categoryList2.forEach((re)=>{
                    if(re.class_id == _this.editObj.subclass_id){
                      _this.cateWord2 = re.class_name
                      _this.subclass_id = re.class_id
                    }
                  })
                }))
                _this.$loading.hide()
            }))
            // _this.cateWord1 = bookStatus('')
          })
          // _this.getChapterList()
        }else{
          _this.bookCategory(_this.editObj.class_id,1)
        }
        
      })
    },
    // editText(type){
    //   // this.$router.push('/textArea')
    //   goTo('textArea.html?book_id=')
    // },
    afterRead(file){
      console.log(file.file);
      let _this = this
      let url = URL.createObjectURL(file.file)
      this.croption.img = url
      // this.$nextTick(()=>{
      //   console.log('55555',_this.$refs.cropper);
        
      //   _this.$refs.cropper.cropW = '300px'      
      //   _this.$refs.cropper.cropH = '400px'     
      // })
    },
    getChapterList(){
      let _this = this
      tokenCheck().then((data)=>{
        axios.get('/v1/writeCenter.chapterList?original_book_id='+this.paramObj.book_id+'&page='+this.currentPage).then((res)=>{
          _this.chapterList = _this.chapterList.concat(res.data.data)
          _this.listLoading = false
          if(_this.currentPage==res.data.last_page || res.data.data.length==0){
            _this.listFinish = true
          }
          _this.currentPage = res.data.current_page + 1
        })
      })
    },
    bookCategory(book_id, type, callback){
      let _this = this
      axios.get('/v1/writeCenter.bookSubClass?class_id='+book_id).then((res)=>{
        if(type==1){
          _this.categoryList1 = res.data
        }else{
          _this.categoryList2 = res.data
        }
        callback()
      })
    },
    editWork(){
      let _this = this
      let data = {
        original_book_id:this.paramObj.book_id,
        book_name:this.editObj.book_name,
        class_id:this.class_id,
        subclass_id:this.subclass_id,
        lead_name:this.editObj.lead_name,
        book_intro:this.editObj.book_intro
      }
      this.$loading.show()
      let url = ''
      if(this.isEdit){
        url = '/v1/writeCenter.editBook'
      }else{
        url = '/v1/writeCenter.addBook'
      }
      axios.post(url,data).then((res)=>{
        if(res.data.code == 200){
          Toast({
            message: 'success!',
            position: 'bottom'
          })
          _this.$loading.hide()
          if(!_this.isEdit){
            // goTo('editChapter.html?type=add&book_id=')
            goTo('myNovels.html')
          }
        }
      })
    },
    selectCategor(num){
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

        this.subclass_id = ''
        this.cateWord2 = ''
      }else if(this.selectNum==2){
        this.subclass_id = item.class_id
        this.cateWord2 = item.class_name
      }
      if(this.selectNum==1){
        this.$loading.show()
        this.bookCategory(item.class_id,2,(()=>{
          _this.$loading.hide()
        }))
      }
    },
    addChapter(){
      let _this = this
      this.$loading.show()
      axios.get('/v1/writeCenter.addChapterVerifi?original_book_id='+this.paramObj.book_id).then((res)=>{
        this.$loading.hide()
        // if(res.data.book_vip===0){
        goTo('editChapter.html?type=add&book_id='+_this.paramObj.book_id)
        // }
      })
    },
    toEditChapter(item){
      goTo('editChapter.html?type=edit&book_id='+this.paramObj.book_id+'&chapter_id='+item.original_chapter_id)
    },
    filtChatStatu(item){
      let obj = {}
      //审核通过
      if(item.chapter_checked==1 && item.edit_status==0){
        obj = {name: 'Audit pass', color: '#07c160'}
      }
      //审核不通过
      else if(item.chapter_checked==3){
        obj = {name: 'Audit failed', color: '#ee0a24'}
      }
      //待审核状态
      else if(item.chapter_checked==0){
        obj = {name: 'To be audited', color: '#969799'}
      }
      //修改待审
      else if((item.chapter_checked==1 || item.chapter_checked==3) && item.edit_status==2){
        obj = {name: 'Modify to be approved', color: '#969799'}
      }
      //草稿
      else if(item.edit_status ==1){
        obj = {name: 'Draft Saved', color: '#969799'}
      }else{
        obj ={name:'',color:''}
      }
      return obj
    }
    

  }
}
</script>
<style lang="less" scoped>
  .addNovel{
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
    .cate_ul{
      width: 100%;
      height: 100%;
    }
    .chapter_nav{
      // text-indent: 6px;
      // height: 55px;
      // line-height: 63px;
      background-color: #f5f5f3;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px;

      .cha_button{
        float: right;
        .van-button{
          height: auto;
          padding: 1px 8px;
          line-height: 33px;
        }
      }
    }
    .chapter_box{
      .cha_status{
        padding-right: 8px;
      }
    }
  }
  
</style>
