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
              size="mini">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        rolesList: [],
        updateRights: []
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      getRolesList() {
        this.$api.rolesGet().then(res => {
          this.rolesList = res.data.results;
        }).catch(onerror => {
          console.log(onerror);
          return this.$message.error('获取角色列表失败！')
        })
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
        console.log(this.updateRights);
        this.removeArray(rightId, this.updateRights);
        console.log(this.updateRights);
        this.$api.rolesPut(role.id, {
          permissions: this.updateRights,
        }).then(res => {
          console.log(res);
          this.$message.success("删除成功");
          this.getRolesList()
        }).catch(onerror => {
          console.log(onerror);
          return this.$message.error('删除权限失败！')
        });
        this.updateRights = [];
      }
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }
</style>
