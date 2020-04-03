<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>wiki</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <!--文章-->
      <el-col :span="16">
        <!--文章列表-->
        <div id="posts_list" v-if="!showPostDetailVisible">
          <template v-for="(items, index) in postsList">
            <el-card>
              <!--标题--->
              <div class="post_title">{{items.title}}</div>
              <div class="post_title_bottom">
                <span class="post_author"><i class="el-icon-user"></i>: {{items.author}}</span>
                <span class="post_category">分类: {{items.category}}</span>
                <span>
                    <i class="el-icon-collection-tag"></i>:
                    <el-tag :type="tagsColors[i]" size="mini" v-for="(item, i) in items.tags" :key="i">{{item}}
                    </el-tag>
                  </span>
              </div>
              <!--摘要--->
              <div class="post_excerpt">
                <div v-html="items.excerpt"></div>
              </div>
              <div class="post_read">
                <el-button type="text" @click="showPostDetail(items.id)">继续阅读</el-button>
              </div>
              <div class="post_time">{{items.c_time | dataFormat}}</div>
            </el-card>
          </template>
        </div>
        <!--文章详情-->
        <div id="post_detail" v-else>
          <el-button type="text" icon="el-icon-back" @click="backWiki">返回</el-button>
          <el-card>
            <!--标题--->
            <div class="post_title">{{detailPostForm.title}}</div>
            <div class="post_title_bottom">
              <span class="post_author"><i class="el-icon-user"></i>: {{detailPostForm.author}}</span>
              <span>
                  <i class="el-icon-collection-tag"></i>:
                  <el-tag :type="tagsColors[i]" size="mini" v-for="(tag, i) in detailPostForm.tags" :key="i">{{tag}}
                  </el-tag>
                </span>
            </div>
            <!--主体--->
            <div class="post_body">
              <div v-html="detailPostForm.body"></div>
            </div>
            <div class="post_operation">
              <el-button type="text" icon="el-icon-edit" @click="deletePost(detailPostForm.id)">删除</el-button>
              <el-button type="text" icon="el-icon-delete" @click="showEditPost(detailPostForm.id)">编辑</el-button>
            </div>
            <div class="post_time">创建时间:{{detailPostForm.c_time | dataFormat}}</div>
          </el-card>
        </div>
      </el-col>
      <!--侧边栏-->
      <el-col :span="6">
        <div id="aside_right">
          <el-card>
            <div slot="header" class="aside_header">
              <span>分类</span>
            </div>
            <Category/>
          </el-card>
          <el-card>
            <div slot="header" class="aside_header">
              <span>标签</span>
            </div>
            <Tag/>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  import Category from "./Category";
  import Tag from "./Tag";


  export default {
    name: "Wiki",
    data() {
      return {
        queryInfo: {
          // 当前页数
          page: 1,
          // 每页显示多少数据
          page_size: 5
        },
        total: 0,
        postsList: [],
        tagsColors: ['success', 'info', 'warning', 'danger', 'success', 'info', 'warning', 'danger'],
        showPostDetailVisible: false,
        detailPostForm: [],
      }
    },
    components: {
      Category,
      Tag
    },

    created() {
      this.getPostsList();
    },
    methods: {
      //获取文章
      getPostsList() {
        this.$api.postsGet(this.queryInfo).then(res => {
          this.postsList = res.data.results;
          this.total = res.data.count;
          console.log(this.postsList)
        }).catch(onerror => {
          console.log(onerror);
          return this.$message.error('获取wiki文章失败！')
        })
      },
      // 查看文章详情
      showPostDetail(id) {
        this.detailPostForm = this.postsList.find(function (obj) {
          return obj.id === id
        });
        this.showPostDetailVisible = true
      },
      //删除文章
      async deletePost(id) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该文章, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        this.$api.postDelete(id).then(res => {
          this.$message.success('删除成功！');
          this.getPostsList()
          this.showPostDetailVisible = false;
        }).catch(onerror => {
          console.log(onerror);
          return this.$message.error('删除失败！')
        });
      },
      //返回wiki文章列表
      backWiki() {
        this.showPostDetailVisible = false;
      },
      //编辑文章
      showEditPost(id) {
        this.$router.push({path: '/wiki/edit',query: {id: id}});
      }
    },
  }
</script>

<style scoped>
  #posts_list .el-card {
    margin-bottom: 20px;
    background-color: #eeeeee;
  }

  .post_title {
    text-align: center;
    font-size: 20px;
  }

  .el-row {
    margin: 0;
  }

  .post_title_bottom {
    font-size: 10px;
    text-align: center;
    margin-bottom: 30px;
  }

  .post_author, .post_category {
    margin-right: 10px
  }

  .post_excerpt {
    width: 890px;
  }

  .post_body {
    width: 890px;
  }

  .post_read {
    margin-top: 10px;
    text-align: center;
  }

  .post_operation {
    margin-top: 10px;
  }

  .post_time {
    float: right;
    margin-bottom: 10px
  }

  #aside_right .el-card {
    margin-bottom: 20px;
  }

  .aside_header {
    height: 10px
  }
</style>
