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
        <div id="posts_list">
          <template v-for="items in postsList">
            <el-card>
              <!--标题--->
              <div class="post_title">{{items.title}}</div>
              <div class="post_title_bottom">
                <span class="post_author"><i class="el-icon-user"></i>: {{items.author}}</span>
                <span class="post_category">分类: {{items.category}}</span>
                <span>
                    <i class="el-icon-collection-tag"></i>:
                    <el-tag style="margin-right: 5px"
                            :type="tagsColors[i]"
                            size="mini"
                            v-for="(item, i) in items.tags"
                            :key="i">{{item}}
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
              <div class="post_time">更新时间: {{items.u_time | dataFormat}}</div>
            </el-card>
          </template>
          <!--分页区域-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.page"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
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
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      // 查看文章详情
      showPostDetail(id) {
        this.$router.push({path: '/wiki/detail', query: {id: id}});
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
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        });
      },
      //编辑文章
      showEditPost(id) {
        this.$router.push({path: '/wiki/edit', query: {id: id}});
      },
      //分页
      handleSizeChange(newSize) {
        this.queryInfo.page_size = newSize;
        this.getPostsList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getPostsList()
      },
    },
  }
</script>

<style scoped>
  #posts_list .el-card {
    margin-bottom: 20px;
    background-color: #f8f8f8;
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

  .post_read {
    margin-top: 10px;
    text-align: center;
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
