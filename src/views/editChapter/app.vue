<template>
  <div class="editChapter">
    <Button class="add_button" type="info" plain hairline size="small" @click="saveChapter('release')">Publish this Chapter</Button>
    <Button class="add_button" type="primary" plain hairline size="small" @click="saveChapter('save')">save as draft</Button>
    <Button class="add_button" v-if="isEdit" type="primary" plain hairline size="small" @click="saveChapter('view')">Preview</Button>

    <div class="edit_box">
      <!-- <div class="content" :style="{height:screenH}" contenteditable="true"> -->
      <Field class="input" v-model="chapter_title" center placeholder="Chapter Title"></Field>
      <Field
        v-model="chapter_content"
        type="textarea"
        :maxlength="maxlength"
        :minlength="minlength"
        :autosize="{maxHeight:screenH, minHeight: screenH}"
        show-word-limit
        placeholder="Start writing your story"
      ></Field>
    </div>
  </div>
</template>

<script>
import { Field, Button, Toast } from "vant";
import axios from "@/lib/axios";
import { params } from "@/lib/utils/variable";
import { tokenCheck } from "@/lib/token";
import { goTo } from '@/lib/utils/native'

export default {
  name: "editChapter",
  components: {
    Field,
    Button,
    Toast,
  },
  data() {
    return {
      chapter_title: "",
      screenH: "",
      isEdit: false,
      chapter_content: "",
      maxlength: 3000,
      minlength: 800,
      paramObj: {}
    };
  },
  created() {
    this.paramObj = params;
    if (this.paramObj.type == "edit") {
      this.isEdit = true;
    }
    if (this.isEdit) {
      let _this = this;
      this.$loading.show();
      tokenCheck().then(data => {
        axios
          .get("/v1/writeCenter.chapterInfo?original_chapter_id=" +
              _this.paramObj.chapter_id
          ).then(res => {
            _this.$loading.hide();
            _this.chapter_title = res.data.chapter_title;
            _this.chapter_content = res.data.content.modification;
          });
      });
    }
  },
  mounted() {
    this.screenH = window.screen.availHeight - 138;
  },
  methods: {
    saveChapter(type){
      let _this = this;
      if(type == 'save' || type=='release'){
        let data = {
          original_book_id: this.paramObj.book_id,
          chapter_title: this.chapter_title,
          content: this.chapter_content,
        }
        if(type=='save'){
          data.status = '1'
        }
        let url = "";
        if (this.isEdit) {
          data.original_chapter_id = this.paramObj.chapter_id
          url = "/v1/writeCenter.editChapter";
        } else {
          url = "/v1/writeCenter.addChapter";
        }
        this.$loading.show();
        axios.post(url, data).then(res => {
          if (res.data.code == 200) {
            Toast({
              message: "success!",
              position: "bottom"
            });
            _this.$loading.hide();
            goTo("editNovel.html?type=edit&book_id="+_this.paramObj.book_id)
          }
        });
      }else if(type=='view'){
        goTo("viewChapter.html?chapter_id="+_this.paramObj.chapter_id+"&book_id="+_this.paramObj.book_id)
      }
    }
  }
};
</script>

<style lang="less" scoped>
.editChapter {
  .edit_box {
    width: 100%;
    overflow-y: auto;
    .input /deep/ .van-field__control {
      text-align: center;
    }
  }
  .add_button {
    float: right;
    margin: 10px;
  }
}
</style>
