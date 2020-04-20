<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!--文章详情-->
    <div>
      <el-button type="text" icon="el-icon-back" @click="backWiki">返回</el-button>
      <el-card>
        <!--标题--->
        <div class="post_title">{{detailPostForm.title}}</div>
        <div class="post_title_bottom">
          <span class="post_author"><i class="el-icon-user"></i>: {{detailPostForm.author}}</span>
          <span class="post_category">分类: {{detailPostForm.category}}</span>
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
        <div class="post_time">更新时间:{{detailPostForm.u_time | dataFormat}}</div>
      </el-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Detail",
    data() {
      return {
        postId: '',
        detailPostForm: '',
        tagsColors: ['success', 'info', 'warning', 'danger', 'success', 'info', 'warning', 'danger'],
      }
    },
    created() {
      this.postId = this.$route.query.id;
      this.getPostDetail(this.postId);
    },
    methods: {
      getPostDetail(id) {
        this.$api.Wiki.postDetailGet(id).then(res => {
          this.detailPostForm = res.data;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //返回
      backWiki() {
        this.$router.go(-1);
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
          this.backWiki()
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        });
      },
      showEditPost(id) {
        this.$router.push({path: '/wiki/edit', query: {id: id}});
      }
    }
  }
</script>

<style scoped>
  .post_title {
    text-align: center;
    font-size: 20px;
  }

  .post_title_bottom {
    font-size: 12px;
    text-align: center;
    margin-bottom: 30px;
  }

  .post_author, .post_category {
    margin-right: 10px
  }

  .post_operation {
    margin-top: 10px;
  }

  .post_time {
    float: right;
    margin-bottom: 10px;
    margin-right: 10px;
  }
</style>
