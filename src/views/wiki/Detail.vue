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
                <span class="post_author">
                  <i class="el-icon-user"></i>: <span>{{detailPostForm.author}}</span></span>
          <span class="post_category"><i class="el-icon-price-tag"></i>: <span>{{detailPostForm.category}}</span></span>
          <span>
            <i class="el-icon-collection-tag"></i>:
            <el-tag style="margin-right: 5px"
                    :type="typeColors[i]"
                    size="mini"
                    v-for="(item, i) in detailPostForm.tags"
                    :key="i">{{item}}
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
      <el-card style="margin-top: 5px">
        <div slot="header">
          <span>评论 ({{commentCount}})</span>
        </div>
        <!--一级评论-->
        <div class="comment" v-if="commentCount !== 0">
          <div class="comment_item" v-for="item1 in comment" :key="item1.id">
            <div class="comment_parent">
              <span class="comment_user">{{item1.user}}:</span>
              <span class="comment_content">{{item1.content}}</span>
              <div class="comment_bottom">
                <span>{{item1.c_time | dataFormat}}</span>
                <el-button type="text" class="comment_chat" @click="showAddComment(item1.id, item1.user)">
                  <i class="el-icon-chat-square"></i>回复
                </el-button>
              </div>
            </div>
            <!--二级评论-->
            <template v-if="item1.children" v-for="item2 in item1.children">
              <div class="comment_children">
                <span class="comment_user">{{item2.user}}:</span>
                <span class="comment_content">{{item2.content}}</span>
                <div class="comment_bottom">
                  <span>{{item2.c_time | dataFormat}}</span>
                  <el-button type="text" class="comment_chat" @click="showAddComment(item2.id, item2.user)">
                    <i class="el-icon-chat-square"></i>回复
                  </el-button>
                </div>
              </div>
              <!--三级评论-->
              <template v-if="item2.children" v-for="item3 in item2.children">
                <div class="comment_children2">
                  <span class="comment_user">{{item3.user}}:</span>
                  <span class="comment_content">{{item3.content}}</span>
                  <div class="comment_bottom">
                    <span>{{item3.c_time | dataFormat}}</span>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
        <template v-if="commentCount === 0">
          <div class="comment_no">暂时没有评论</div>
        </template>
        <el-button type="text" class="comment_chat2" @click="showAddComment(null)">
          <i class="el-icon-chat-square"></i>添加评论
        </el-button>
        <div v-show="writeComment">
          <el-input
            type="textarea"
            :rows="10"
            placeholder="请输入评论"
            v-model="addComment.content">
          </el-input>
          <div class="comment_submit">
            <el-button type="primary" @click="subComment">提交</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "Detail",
    data() {
      return {
        postId: '',
        detailPostForm: '',
        typeColors: ['', 'success', 'info', 'danger', 'warning', '', 'success', 'info', 'danger', 'warning', '', 'success', 'info', 'danger', 'warning', '', 'success', 'info', 'danger', 'warning',],
        comment: '',
        commentCount: 0,
        addComment: {
          content: '',
          user: '',
          post: '',
          pid: null,
        },
        writeComment: true
      }
    },
    computed:
      {
        ...mapGetters([
          'getUserId'
        ]),
      },
    created() {
      this.postId = this.$route.query.id;
      this.getPostDetail(this.postId);
      this.getComments(this.postId);
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
      getComments(id) {
        this.$api.Wiki.wikiCommentsGet({'post': id}).then(res => {
          this.comment = res.data.results;
          this.commentCount = res.data.count;
          if (this.commentCount) {
            this.writeComment = false
          }
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
      },
      showAddComment(pid, p_user) {
        if (p_user) {
          this.addComment.content = '@' + p_user + ': '
        } else {
          this.addComment.content = ''
        }
        this.addComment.pid = pid;
        this.writeComment = true;
      },
      subComment() {
        if (this.addComment.content) {
          const then = this;
          this.addComment.user = this.getUserId;
          this.addComment.post = Number(this.postId);
          this.$api.Wiki.wikiCommentPost(this.addComment).then(res => {
            this.getComments(this.postId);
            this.writeComment = false;
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          })
        }
      },
    }
  }
</script>

<style scoped>
  .post_title {
    text-align: center;
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 30px;
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

  .post_operation {
    margin-top: 10px;
  }

  .post_time {
    float: right;
    margin-bottom: 10px;
    margin-right: 10px;
  }

  .comment_user {
    color: #419FFF;
    margin-right: 5px;
  }

  .comment_content {
    color: #666666;
  }

  .comment, .comment_item {
    margin-bottom: 20px;
  }

  .comment_parent {
    font-size: 17px;
  }

  .comment_children {
    padding-top: 10px;
    margin-left: 20px;
  }

  .comment_children2 {
    padding-top: 10px;
    margin-left: 40px;
  }

  .comment_children::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 1px;
    margin-right: 2px;
    vertical-align: middle;
    background: #a6aebd;
  }

  .comment_children2::before {
    content: '';
    display: inline-block;
    width: 40px;
    height: 1px;
    margin-right: 2px;
    vertical-align: middle;
    background: #a6aebd;
  }

  .comment_parent .comment_bottom,
  .comment_children .comment_bottom,
  .comment_children2 .comment_bottom,
  .comment .el-button {
    font-size: 15px;
    color: #8b8b8b;
  }

  .comment_children .comment_bottom {
    margin-left: 20px;
  }

  .comment_children2 .comment_bottom {
    margin-left: 40px;
  }

  .comment_chat {
    margin-left: 30px;
    color: #8b8b8b;
  }

  .comment_chat2 {
    color: #8b8b8b;
  }

  .comment_no {
    margin-bottom: 10px;
  }

  .comment_submit {
    margin: 10px 0;
    float: right;
  }
</style>
