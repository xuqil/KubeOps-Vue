<template>
  <div id="post_edit">
    <div style="margin-top: 20px">
      <el-form :model="postForm" :rules="postFormRules" ref="postFormRef" label-position="top" size="small">
        <el-form-item label="标题" prop="title">
          <el-input v-model="postForm.title"></el-input>
        </el-form-item>
        <el-form-item label="正文" prop="body">
          <quill-editor
            ref="myQuillEditor"
            v-model="postForm.body"/>
        </el-form-item>
        <el-form-item label="摘要" prop="excerpt">
          <el-input type="textarea" v-model="postForm.excerpt"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="postForm.category" clearable placeholder="请选择">
            <el-option
              v-for="item in categoriesList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button @click="addCategoryDialogVisible = true"><i class="el-icon-plus"></i></el-button>
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-select v-model="postForm.tags" multiple placeholder="请选择">
            <el-option
              v-for="item in tagsList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button @click="addTagDialogVisible = true"><i class="el-icon-plus"></i></el-button>
        </el-form-item>
      </el-form>
      <div style="float: right">
        <el-button type="primary" @click="subPost">添加</el-button>
        <el-button type="info" @click="restPost">重置</el-button>
      </div>
    </div>
    <el-dialog title="添加标签" :visible.sync="addTagDialogVisible" width="40%">
      <el-form :model="addTag" rel="addTagRef">
        <el-form-item label="标签" prop="name">
          <el-input v-model="addTag.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addTagDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subTag">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加分类" :visible.sync="addCategoryDialogVisible" width="40%">
      <el-form :model="addCategory" rel="addCategoryRef">
        <el-form-item label="分类" prop="name">
          <el-input v-model="addCategory.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "Add",
    data() {
      return {
        postId: '',
        postForm: {},
        postFormRules: {
          title: [{required: true, message: '请输入标题', trigger: 'blur'}],
          body: [{required: true, message: '请输入文章内容', trigger: 'blur'}]
        },
        editor: '',
        tagsList: [],
        categoriesList: [],
        addTag: {
          name: ''
        },
        addTagDialogVisible: false,
        addCategory: {
          name: ''
        },
        addCategoryDialogVisible: false
      }
    },
    computed:
      {
        ...mapGetters([
          //登录的用户名
          'getUserId'
        ]),
      },
    created() {
      this.getTagsList();
      this.getCategoriesList();
    },
    methods: {
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
          this.postForm['author'] = this.getUserId;
          this.$api.Wiki.postPost(this.postForm).then(res => {
            this.$message.success('添加成功！');
            this.$router.push('/wiki/');
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
        })
      },
      subTag() {
        if (this.addTag.name) {
          this.$api.Wiki.wikiTagsPost(this.addTag).then(res => {
            this.addTagDialogVisible = false;
            this.getTagsList();
            this.$message.success('添加成功！');
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
          this.addTag.name = ''
        }
      },
      subCategory() {
        if (this.addCategory.name) {
          this.$api.Wiki.wikiCategoryPost(this.addCategory).then(res => {
            this.addCategoryDialogVisible = false;
            this.getCategoriesList();
            this.$message.success('添加成功！');
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
          this.addCategory.name = ''
        }
      },
      restPost() {
        this.$refs.postFormRef.resetFields();
        this.postForm.content = null;
      },
    }
  }
</script>

<style scoped>

</style>
