<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>wiki</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="text"
               icon="el-icon-back"
               @click="backWiki"
               v-show="showBack">返回
    </el-button>
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
                <span class="post_author"
                      @click="searchByAuthor(items.author)">
                  <i class="el-icon-user"></i>: <span>{{items.author}}</span></span>
                <span class="post_category"><i class="el-icon-price-tag"></i>: <span>{{items.category}}</span></span>
                <span>
                    <i class="el-icon-collection-tag"></i>:
                    <el-tag style="margin-right: 5px"
                            :type="typeColors[i]"
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
          <div class="search_input">
            <el-input placeholder="搜索文章 (用户 | 标题 | 文章主体)"
                      v-model="queryInfo.search"
                      @change="clickSearch"
                      prefix-icon="el-icon-search">
            </el-input>
          </div>
          <el-card>
            <div slot="header" class="aside_header">
              <span>分类</span>
            </div>
            <el-tag
              v-for="(item, index) in categoriesList"
              :key="item.id"
              :type="typeColors[index]"
              @click="searchByCategory(item.name)"
              effect="plain">
              {{ item.name }}
            </el-tag>
          </el-card>
          <el-card>
            <div slot="header" class="aside_header">
              <span>标签</span>
            </div>
            <el-tag
              v-for="(item, index) in tagsList"
              :key="item.id"
              :type="typeColors[index]"
              @click="searchByTag(item.name)">
              {{ item.name }}
            </el-tag>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "Wiki",
    inject: ['reload'],
    data() {
      return {
        queryInfo: {
          page: 1,
          page_size: 5,
          search: null,
          category: null,
          tags: null,
          author: null
        },
        total: 0,
        postsList: [],
        categoriesList: [],
        tagsList: [],
        showBack: false,
        typeColors: ['', 'success', 'info', 'danger', 'warning', '', 'success', 'info', 'danger', 'warning', '', 'success', 'info', 'danger', 'warning', '', 'success', 'info', 'danger', 'warning',]
      }
    },
    created() {
      this.getPostsList();
      this.getCategories();
      this.getTags();
    },
    methods: {
      //获取文章
      getPostsList() {
        this.$api.Wiki.postsGet(this.queryInfo).then(res => {
          this.postsList = res.data.results;
          this.total = res.data.count;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      initQueryInfo() {
        this.queryInfo.search = null;
        this.queryInfo.category = null;
        this.queryInfo.tags = null;
        this.queryInfo.author = null;
      },
      //获取分类
      getCategories() {
        this.$api.Wiki.wikiCategoriesGet().then(res => {
          this.categoriesList = res.data.results;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //获取标签
      getTags() {
        this.$api.Wiki.wikiTagsGet().then(res => {
          this.tagsList = res.data.results;
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
        this.$api.Wiki.postDelete(id).then(res => {
          this.$message.success('删除成功！');
          this.getPostsList()
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        });
      },
      backWiki() {
        this.showBack = false;
        this.reload();
        this.initQueryInfo();
      },
      clickSearch() {
        this.queryInfo.category = null;
        this.queryInfo.tags = null;
        this.queryInfo.author = null;
        this.getPostsList();
        this.showBack = true;
      },
      searchByAuthor(username) {
        this.queryInfo.author = username;
        this.queryInfo.category = null;
        this.queryInfo.tags = null;
        this.queryInfo.search = null;
        this.getPostsList();
        this.showBack = true;
      },
      searchByCategory(name) {
        this.queryInfo.category = name;
        this.queryInfo.search = null;
        this.queryInfo.tags = null;
        this.queryInfo.author = null;
        this.getPostsList();
        this.showBack = true;
      },
      searchByTag(name) {
        this.queryInfo.tags = name;
        this.queryInfo.category = null;
        this.queryInfo.search = null;
        this.queryInfo.author = null;
        this.getPostsList();
        this.showBack = true;
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
    font-size: 12px;
    text-align: center;
    margin-bottom: 30px;
  }

  .post_author span {
    cursor: pointer;
    color: #4f4ce7;
  }

  .post_category span {
    color: #801221;
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

  .el-tag {
    margin-right: 10px;
  }

  #aside_right .el-tag {
    cursor: pointer;
  }

  .search_input {
    margin-bottom: 20px;
  }
</style>
