<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      <el-breadcrumb-item>IDC</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加IDC机房按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加机房</el-button>
        </el-col>
      </el-row>
      <!--IDC机房列表-->
      <el-table :data="IDCList" @sort-change="sortChange" :header-cell-style="getTableHeaderStyle">
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="机房名" prop="name" align="center" sortable="custom"></el-table-column>
        <el-table-column label="地址" prop="address" align="center" sortable="custom"></el-table-column>
        <el-table-column label="联系方式" prop="mobile" align="center"></el-table-column>
        <el-table-column label="楼层" prop="floor" align="center" sortable="custom"></el-table-column>
        <el-table-column label="创建日期" prop="c_time" align="center" sortable="custom">
          <template slot-scope="scope">{{scope.row.c_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="更新日期" prop="u_time" align="center" sortable="custom">
          <template slot-scope="scope">{{scope.row.u_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" size="mini">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeIDCById(scope.row.id)" size="mini">删除
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
    <!--添加机房区域-->
    <el-dialog
      title="添加机房"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <el-form
        :model="addIDCForm"
        ref="addIDCFormRef"
        :rules="addIDCFormRules"
        label-width="90px">
        <el-form-item label="机房名" prop="name">
          <el-input v-model="addIDCForm.name"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="addIDCForm.address"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="addIDCForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="楼层">
          <el-input v-model="addIDCForm.floor"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addIDC">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改机房的对话框 -->
    <el-dialog
      title="修改机房信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <el-form
        :model="editIDCForm"
        ref="editIDCFormRef"
        :rules="addIDCFormRules"
        label-width="70px">
        <el-form-item label="机房名" prop="name">
          <el-input v-model="editIDCForm.name"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="editIDCForm.address"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input  v-model="editIDCForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="楼层">
          <el-input v-model="editIDCForm.floor"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editIDC">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "IDC",
    data() {
      return {
        queryInfo: {
          page: 1,
          page_size: 10,
          ordering: null,
        },
        total: 0,
        IDCList: [],
        addDialogVisible: false,
        addIDCForm: {
          name: '',
          address: '',
          mobile: '',
          floor: ''
        },
        addIDCFormRules: {
          name: [{required: true, message: '请输入机房名称', trigger: 'blur'}]
        },
        editDialogVisible: false,
        editIDCForm: {},
      }
    },
    created() {
      this.getIDCList()
    },
    computed: {
      ...mapGetters([
        'getTableHeaderStyle'
      ]),
    },
    methods: {
      //获取IDC列表
      getIDCList() {
        this.$api.Assets.IDCGet(this.queryInfo).then(res => {
          this.IDCList = res.data.results;
          this.total = res.data.count;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //排序
      sortChange(order) {
        if (order.order === 'ascending') {
          this.queryInfo.ordering = order.prop
        } else if (order.order === 'descending') {
          this.queryInfo.ordering = '-' + order.prop
        } else {
          this.queryInfo.ordering = null
        }
        this.getIDCList()
      },
      //分页
      handleSizeChange(newSize) {
        this.queryInfo.page_size = newSize;
        this.getIDCList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getIDCList()
      },
      addIDC() {
        this.$refs.addIDCFormRef.validate(valid => {
          if (!valid) return;
          this.$api.Assets.IDCPot(this.addIDCForm).then(res => {
            this.$message.success('添加IDC机房成功！');
            this.getIDCList()
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
          this.addDialogVisible = false;
        })
      },
      addDialogClosed() {
        this.addIDCForm.name = '';
        this.addIDCForm.address = '';
        this.addIDCForm.mobile = '';
        this.addIDCForm.floor = '';
      },
      showEditDialog(id) {
        this.editIDCForm = this.IDCList.find(function (obj) {
          return obj.id === id
        });
        this.editDialogVisible = true
      },
      editIDC() {
        this.$refs.editIDCFormRef.validate(valid => {
          if (!valid) return;
          this.$api.Assets.IDCPut(this.editIDCForm.id, {
            name: this.editIDCForm.name,
            address: this.editIDCForm.address,
            mobile: this.editIDCForm.mobile,
            floor: this.editIDCForm.floor
          }).then(res => {
            this.$message.success('更新DC机房信息成功！');
            this.getIDCList()
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
          this.editDialogVisible = false;
        })
      },
      editDialogClosed() {
        this.$refs.editIDCFormRef.resetFields()
      },
      async removeIDCById(id) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该机房, 是否继续?',
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
        this.$api.Assets.IDCDelete(id).then(res => {
          this.$message.success('删除机房成功！');
          this.getIDCList()
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
