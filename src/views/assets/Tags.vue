<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      <el-breadcrumb-item>标签</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加标签按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加标签</el-button>
        </el-col>
      </el-row>
      <!--标签列表-->
      <el-table :data="tagsList" stripe>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="标签" prop="name" align="center"></el-table-column>
        <el-table-column label="描述" prop="desc" align="center" min-width="100px"></el-table-column>
        <el-table-column label="创建日期" align="center">
          <template slot-scope="scope">{{scope.row.c_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="更新日期" align="center">
          <template slot-scope="scope">{{scope.row.u_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" size="mini">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeTagById(scope.row.id)" size="mini">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加标签区域-->
    <el-dialog
      title="添加标签"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <el-form
        :model="addTagForm"
        ref="addTagFormRef"
        :rules="addTagFormRules"
        label-width="70px">
        <el-form-item label="标签" prop="name" label-width="90px">
          <el-input v-model="addTagForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="90px">
          <el-input type="textarea" v-model="addTagForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTag">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改标签的对话框 -->
    <el-dialog
      title="修改标签信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <el-form
        :model="editTagForm"
        ref="editTagFormRef"
        :rules="addTagFormRules"
        label-width="70px">
        <el-form-item label="标签" prop="name">
          <el-input v-model="editTagForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="editTagForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editTag">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Tags",
    data() {
      return {
        queryInfo: {
          page: 1,
          page_size: 10
        },
        total: 0,
        tagsList: [],
        addDialogVisible: false,
        addTagForm: {
          name: '',
          desc: ''
        },
        addTagFormRules: {
          name: [
            {required: true, message: '请输入标签名', trigger: 'blur'},
            {
              min: 2,
              max: 10,
              message: '标签名的长度在2～10个字',
              trigger: 'blur'
            }
          ]
        },
        editTagForm: {},
        editDialogVisible: false,
      }
    },
    created() {
      this.getTagsList()
    },
    methods: {
      //获取标签列表
      getTagsList() {
        this.$api.Assets.tagsGet(this.queryInfo).then(res => {
          this.tagsList = res.data.results;
          this.total = res.data.count;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //分页
      handleSizeChange(newSize) {
        this.queryInfo.page_size = newSize;
        this.getTagsList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getTagsList()
      },
      //添加标签
      addTag() {
        this.$refs.addTagFormRef.validate(valid => {
          if (!valid) return;
          this.$api.Assets.tagsPot(this.addTagForm).then(res => {
            this.$message.success('添加标签成功！');
            this.getTagsList()
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
          this.addDialogVisible = false;
        })
      },
      addDialogClosed() {
        this.addTagForm.name = '';
        this.addTagForm.desc = '';
      },
      showEditDialog(id) {
        this.editTagForm = this.tagsList.find(function (obj) {
          return obj.id === id
        });
        this.editDialogVisible = true;
      },
      //编辑标签
      editTag() {
        this.$refs.editTagFormRef.validate(valid => {
          if (!valid) return;
          this.$api.Assets.tagsPut(this.editTagForm.id, {
            name: this.editTagForm.name,
            desc: this.editTagForm.desc,
          }).then(res => {
            this.$message.success('更新标签信息成功！');
            this.getTagsList()
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
          this.editDialogVisible = false;
        })
      },
      editDialogClosed() {
        this.$refs.editTagFormRef.resetFields()
      },
      //删除标签
      async removeTagById(id) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该标签, 是否继续?',
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
        this.$api.Assets.tagsDelete(id).then(res => {
          this.$message.success('删除标签成功！');
          this.getTagsList()
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        });
      }
    }
  }
</script>

<style scoped>

</style>
