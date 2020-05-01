<template>
  <div id="post_edit">
    <div>
      <el-button type="text" icon="el-icon-d-arrow-left" @click="backWiki">返回</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-form :model="postForm" :rules="postFormRules" ref="postFormRef" label-position="top" size="small">
        <el-form-item label="标题:" prop="title">
          <el-input v-model="postForm.title"></el-input>
        </el-form-item>
        <el-form-item label="正文:">
          <quill-editor
            ref="myQuillEditor"
            v-model="postForm.content"/>
        </el-form-item>
        <el-form-item label="摘要:">
          <el-input type="textarea" v-model="postForm.excerpt"></el-input>
        </el-form-item>
        <el-form-item label="分类:" prop="category">
          <el-select v-model="postForm.category" clearable placeholder="请选择">
            <el-option
              v-for="item in categoriesList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签:" prop="tag">
          <el-select v-model="postForm.tags" multiple placeholder="请选择">
            <el-option
              v-for="item in tagsList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="float: right">
        <el-button type="primary" @click="subPost">修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Edit",
    data() {
      return {
        postId: '',
        postForm: {},
        postFormRules: {
          title: [{required: true, message: '请输入标题', trigger: 'blur'}],
          content: [{required: true, message: '请输入文章内容', trigger: 'blur'}]
        },
        editor: '',
        tagsList: [],
        categoriesList: []
      }
    },
    created() {
      this.postId = this.$route.query.id;
      this.getPostDetail(this.postId);
      this.getTagsList();
      this.getCategoriesList();
    },
    methods: {
      //获取具体文章
      getPostDetail(id) {
        this.$api.Wiki.postDetailGet(id).then(res => {
          this.postForm = res.data;
          this.postForm.content = this.postForm.body
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      getTagsList() {
        this.$api.Wiki.wikiTagsGet().then(res => {
          this.tagsList = res.data.results;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      getCategoriesList() {
        this.$api.Wiki.wikiCategoriesGet().then(res => {
          this.categoriesList = res.data.results;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //提交
      subPost() {
        this.$refs.postFormRef.validate(valid => {
          if (!valid) return;
          this.postForm['body'] = this.postForm.content;
          this.$api.Wiki.postPut(this.postId, this.postForm).then(res => {
            this.$message.success('修改成功！');
            this.backWiki();
          }).catch(err => {
            console.log(err.response.status);
            return this.$message.error(err.response.data.detail)
          });
        })
      },
      //返回
      backWiki() {
        this.$router.go(-1);
      }
    }

  }
</script>

<style scoped>

</style>
