<template>
  <div>
    <div class="add_button">
      <el-form :inline="true"
               :model="addedNamespace"
               ref="addedNamespaceRef"
               :rules="addedNamespaceRule">
        <el-form-item prop="namespace">
          <el-input v-model="addedNamespace.namespace" placeholder="命名空间"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addNamespace">创建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="namespaceList"
      border>
      <el-table-column
        prop="name"
        label="命名空间"
        width="180">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'Active'" type="primary" disable-transitions>{{scope.row.status}}
          </el-tag>
          <el-tag v-else-if="scope.row.status === 'Terminating'" type="success" disable-transitions>{{scope.row.status}}
          </el-tag>
          <el-tag v-else type="info" disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.name === 'default' || scope.row.name === 'kube-system'"
            disabled
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="deleteNamespace(scope.row.name)">
            删除
          </el-button>
          <el-button
            v-else
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="deleteNamespace(scope.row.name)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "Namespace",
    data() {
      return {
        queryInfo: {
          // 当前页数
          page: 1,
          // 每页显示多少数据
          page_size: 5
        },
        total: 0,
        namespaceList: '',
        addedNamespace: {
          namespace: ''
        },
        addedNamespaceRule: {
          namespace: [{required: true, message: '请输入命名空间的名称', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.getNamespaceList(this.queryInfo);
    },
    methods: {
      //获取Pod列表
      getNamespaceList() {
        this.$api.namespacesGet(this.queryInfo).then(res => {
          if (res.data.status === 200) {
            this.namespaceList = res.data.results;
            console.log(this.namespaceList)
          } else {
            return Promise.reject(res)
          }
        }).catch(err => {
          if (err.data.status === 400) {
            return this.$message.error(err.data.msg)
          } else {
            return this.$message.error(err.response.data.detail)
          }
        })
      },
      //删除命名空间
      async deleteNamespace(namespace) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该命名空间, 是否继续?',
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
        this.$api.namespacesDelete({'namespace': namespace}).then(res => {
          if (res.data.status !== 200) {
            return Promise.reject(res)
          }
          this.$message.success('删除成功！');
          this.getNamespaceList()
        }).catch(err => {
          console.log(err);
          try {
            return this.$message.error(err.data.msg)
          } catch (e) {
            if (err.response.status === 500) {
              return this.$message.error('服务器错误!')
            } else {
              return this.$message.error(err.response.data.detail)
            }
          }
        });
      },
      addNamespace() {
        this.$refs.addedNamespaceRef.validate(valid => {
          if (!valid) return;
          this.$api.namespacesPost(this.addedNamespace).then(res => {
            if (res.data.status !== 200) {
              return Promise.reject(res)
            }
            this.$message.success('创建成功！');
            this.getNamespaceList();
            this.addedNamespace = ''
          }).catch(err => {
            console.log(err);
            try {
              return this.$message.error(err.data.msg)
            } catch (e) {
              if (err.response.status === 500) {
                return this.$message.error('服务器错误!')
              } else {
                return this.$message.error(err.response.data.detail)
              }
            }
          });
        })
      }
    }
  }
</script>

<style scoped>
.add_button{
  margin-bottom: 20px
}
</style>
