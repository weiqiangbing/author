<template>
  <div class="myNovels">
    <Button
      class="add_button"
      icon="plus"
      type="info"
      plain
      hairline
      size="small"
      @click="addWork"
    >Add</Button>
    <ul class="novel_ul">
      <List v-model="listLoading" loading-text="loading" :offset="10" :finished="listFinish" finished-text="No More" @load="getNovelList">
        <li
          class="novel_li"
          v-for="(item, index) in novesList"
          :key="index"
          @click="goToEdit(item)"
        >
          <img :src="novelImg" />
          <div class="novel_info">
            <div class="novel_user">
              <p>{{item.book_name}}</p>
              <Icon name="arrow" />
            </div>
            <!-- <div class="novel_num">
              <Icon name="eye-o" />
              <span>0</span>
              <Icon name="star-o" />
              <span>0</span>
              <Icon name="comment-o" />
              <span>0</span>
            </div>-->
            <div class="novel_dec">Chapters Number: {{item.book_chapters}}</div>
            <div class="novel_dec">{{item.book_status | filterstatus}}</div>
            <!-- <div class="novel_dec">
              Chapters Number: {{item.book_chapters}}
            </div>-->
            <div
              class="novel_statu"
              :style="{color: item.book_checked==1?'#07c160':'red'}"
            >{{formatStatus(item.book_checked)}}</div>
            <div></div>
          </div>
        </li>
      </List>
    </ul>
  </div>
</template>

<script>
import { tokenCheck } from "@/lib/token";
import comm from "@/lib/utils/comm";
import { Toast, Icon, Button, List } from "vant";
import { goTo } from "@/lib/utils/native";
import axios from "@/lib/axios";
import { bookStatus } from "@/lib/utils/norFormat";

export default {
  name: "myNovels",
  components: {
    Toast,
    Icon,
    Button,
    List
  },
  data() {
    return {
      novesList: [],
      novelImg: require("@/assets/images/novel_page.jpg"),
      listLoading: false,
      listFinish: false,
      currentPage:1
    };
  },
  filters:{
    filterstatus(val){
      if(val==1){
        return 'Series'
      }else if(val==2){
        return 'Completed'
      }else{
        return 'Prompt update'
      }
    }
  },
  created() {
    // this.$loading.show();
    // this.getNovelList();
  },
  mounted() {},
  computed: {},
  methods: {
    // getInitData() {
    //   let _this = this;
    //   tokenCheck().then(data => {
    //     // axios.get("/v1/writeCenter.bookList?page="+this.currentPage).then(res => {
    //     //   // _this.novesList = _this.novesList.concat(res.data.data)
    //     //   _this.$loading.hide();
    //     // });
    //     // _this.getNovelList()
    //   });
    // },
    getNovelList(){
      let _this = this
      console.log("eeeee", this.currentPage);
      // this.$loading.show()
      // http://hrxsrest.liwenhua.moqing.com
      tokenCheck().then(data => {
        axios.get("/v1/writeCenter.bookList?page="+this.currentPage).then(res => {
          _this.novesList = _this.novesList.concat(res.data.data)
          _this.listLoading = false
          // _this.novesList = res.data.data;
          // _this.$loading.hide();
          if(_this.currentPage==res.data.last_page || res.data.data.length==0){
            _this.listFinish = true
          }
          _this.currentPage = res.data.current_page + 1
        });
      });
    },
    goToEdit(item) {
      goTo("editNovel.html?type=edit&book_id=" + item.original_book_id);
      // this.$router.push('/editNovel')
      // location.href =
    },
    addWork() {
      let _this = this
      this.$loading.show()
      axios.get("/v1/writeCenter.addBookVerifi").then(res => {
        _this.$loading.hide()
        if(res.data.code==200){
          goTo("editNovel.html?type=add");
        }else{
          
        } 
      });
    },
    formatStatus(val) {
      let obj = bookStatus("value", val);
      return obj.en;
    },
  }
};
</script>
<style lang="less" scoped>
.myNovels {
  width: 100%;
  height: 100%;
  .novel_ul {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    clear: both;
    // padding-top: 0;
    .novel_li {
      display: flex;
      margin-bottom: 10px;
      img {
        width: 80px;
        height: 100px;
        // background-color: #ddd;
      }
      .novel_info {
        flex: 1;
        background-color: #ffffff;
        padding: 10px;

        .novel_user {
          font-weight: bold;
          display: flex;
          font-size: 14px;
          justify-content: space-between;
          color: #525252;
          p {
            font-size: 14px;
            max-width: 200px;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .van-icon {
            font-weight: bold;
            font-size: 16px;
            color: #909090;
          }
        }
        .novel_num {
          margin: 8px 0;
          span {
            font-size: 14px;
            margin: 0px 7px 0 3px;
            position: relative;
            top: -2px;
          }
          .van-icon {
            font-size: 14px;
          }
        }
        .novel_dec {
          margin-top: 7px;
        }
        .novel_statu {
          color: red;
          margin-top: 4px;
        }
      }
    }
  }
  .add_button {
    float: right;
    margin: 10px;
  }
  // .van-button--normal{
  //   padding: 0;
  //   width: 45px;
  //   height: 45px;
  // }
}
</style>
