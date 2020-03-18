<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表-->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row>
              <el-col>
                <template v-for="item in scope.row.permissions">
                  <el-tag v-if="item.action==='add'"
                          @close="removeRightById(scope.row, item.id)"
                          closable>{{ item.title }}
                  </el-tag>
                  <el-tag v-else-if="item.action==='delete'"
                          type="danger"
                          @close="removeRightById(scope.row, item.id)"
                          closable>{{ item.title }}
                  </el-tag>
                  <el-tag v-else-if="item.action==='edit'"
                          type="warning"
                          @close="removeRightById(scope.row, item.id)"
                          closable>{{ item.title }}
                  </el-tag>
                  <el-tag v-else-if="item.action==='list'"
                          type="success"
                          @close="removeRightById(scope.row, item.id)"
                          closable>{{ item.title }}
                  </el-tag>
                  <el-tag v-else type="info"
                          @close="removeRightById(scope.row, item.id)"
                          closable>{{ item.title }}
                  </el-tag>
                </template>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="title"></el-table-column>
        <el-table-column label="角色描述" prop="desc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRights(scope.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
    </el-card>
    <!--分配权限-->
    <el-dialog
      title="分配权限"
      :visible.sync="rightsDialogVisible"
      width="50%">
      <el-tree
        :data="rightsTree"
        :props="rightsProps"
        ref="rightsRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultRights"></el-tree>
      <span slot="footer" class="dialog-footer">
                <el-button @click="rightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleRights">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        queryInfo: {
          // 当前页数
          page: 1,
          // 每页显示多少数据
          page_size: 5
        },
        //总条目
        total: 0,
        //角色列表
        rolesList: [],
        //更新的权限
        updateRights: [],
        //分配权限会话框
        rightsDialogVisible: false,
        //选中的权限ID
        selectRightsId: [],
        defaultRights: [],
        //权限分配树形列表
        rightsTree: [],
        //显示规则
        rightsProps: {
          children: 'children',
          label: 'title'
        },
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      //获取角色列表
      getRolesList() {
        this.$api.rolesGet(this.queryInfo).then(res => {
          this.rolesList = res.data.results;
          this.total = res.data.count;
        }).catch(onerror => {
          console.log(onerror);
          return this.$message.error('获取角色列表失败！')
        })
      },
      //分页
      handleSizeChange(newSize) {
        this.queryInfo.page_size = newSize;
        this.getRolesList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getRolesList()
      },
      //获取数组内元素索引
      indexArray(val, array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i] === val) return i;
        }
        return -1;
      },
      //删除数组中指定元素
      removeArray(val, array) {
        let index = this.indexArray(val, array);
        if (index > -1) {
          array.splice(index, 1);
        }
      },
      //删除权限
      async removeRightById(role, rightId) {
        const rightConfirm = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (rightConfirm !== 'confirm') {
          return this.$message.info("已取消删除")
        }
        role.permissions.forEach(value => this.updateRights.push(value.id));
        this.removeArray(rightId, this.updateRights);
        this.$api.rolesPut(role.id, {
          permissions: this.updateRights,
        }).then(res => {
          // console.log(res);
          this.$message.success("删除成功");
          this.getRolesList()
        }).catch(onerror => {
          console.log(onerror);
          return this.$message.error('删除权限失败！')
        });
        this.updateRights = [];
      },
      //显示分配权限对话框
      showSetRights(roles) {
        this.currentRoleId = roles.id;
        this.$api.rightsGet().then(res => {
          this.rightsTree = res.data.results;
          this.rightFlag = true;
        }).catch(onerror => {
          console.log(onerror);
          return this.$message.error("获取权限列表失败")
        });
        console.log("ok")
        //获取默认的权限
        this.defaultRights = [];
        roles.permissions.forEach(value => this.defaultRights.push(value.id));
        console.log(this.defaultRights);
        this.rightsDialogVisible = true;
      },
      //保持修改的权限
      saveRoleRights() {
        const permissionsKeys = [
          ...this.$refs.rightsRef.getCheckedKeys(),
          ...this.$refs.rightsRef.getHalfCheckedKeys()
        ];
        this.$api.rolesPut(this.currentRoleId, {
          permissions: permissionsKeys,
        }).then(res => {
          // console.log(res);
          this.$message.success("分配成功");
          this.getRolesList()
        }).catch(onerror => {
          console.log(onerror);
          return this.$message.error('分配权限失败！')
        });
        this.rightsDialogVisible = false;
      }
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }
</style>
