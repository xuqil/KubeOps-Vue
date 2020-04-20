<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>应用部署</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="不允许使用制表键(Tab)缩进!"
        type="warning"
        effect="dark"
        show-icon
        center>
      </el-alert>
      <Editor></Editor>
      <div class="submit_button">
        <el-form
          :inline="true"
          ref="deployInfoRef"
          :model="deployInfo"
          :rules="deployInfoRule">
          <el-form-item prop="type">
            <el-select v-model="deployInfo.type" clearable placeholder="请选择部署的类型">
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item"
                :value="item"
                :disabled="item !== 'Pod' && item !== 'Deployment'"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="namespace">
            <el-select v-model="deployInfo.namespace" clearable placeholder="请选择命名空间">
              <el-option
                v-for="(item, index) in namespaceList"
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="clearPush">清空</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="deployPush">部署</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  import Editor from "components/common/editor/Editor";
  import {mapGetters} from "vuex";

  export default {
    name: "Deployment",
    components: {Editor},
    inject: ['reload'],
    data() {
      return {
        deployInfo: {
          namespace: '',
          type: '',
          body: ''
        },
        deployInfoRule: {
          namespace: [{required: true, message: '请选择命名空间的名称', trigger: 'change'}],
          type: [{required: true, message: '请选择部署类型', trigger: 'change'}]
        },
        namespaceList: '',
        typeList: ['Pod', 'Deployment', 'Job', 'Daemon', 'Stateful', 'Replica']
      }
    },
    created() {
      this.initCodeMirror();
      this.getNamespaceList()
    },
    methods: {
      ...mapGetters([
        'getCodeValue'
      ]),
      initCodeMirror() {
        this.$store.commit('saveCodeType', 'yaml')
      },
      initCodeValue(value) {
        this.$store.commit('saveCodeValue', value)
      },
      //获取命名空间列表
      getNamespaceList() {
        this.$api.K8S.namespacesGet(this.queryInfo).then(res => {
          if (res.data.status === 200) {
            this.namespaceList = res.data.results;
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
      //部署
      deployPush() {
        this.deployInfo.body = this.getCodeValue();
        this.$refs.deployInfoRef.validate(valid => {
          if (!valid) {
            return;
          }
          if (this.deployInfo.type === "Pod") {
            this.startPush(this.$api.K8S.podCreate);
          } else if (this.deployInfo.type === "Deployment") {
            this.startPush(this.$api.K8S.deploymentCreate)
          }
        })
      },
      //部署
      startPush(api) {
        api(this.deployInfo).then(res => {
          if (res.data.status !== 200) {
            return Promise.reject(res)
          }
          this.$message.success(res.data.msg);
        }).catch(err => {
          console.log(err);
          try {
            return this.$message.error(err.data.msg)
          } catch (e) {
            if (err.response.status === 500) {
              return this.$message.error('可能已经部署或者不符合规范!')
            } else {
              return this.$message.error(err.response.data.detail)
            }
          }
        });
      },
      clearPush() {
        this.deployInfo.namespace = '';
        this.deployInfo.type = '';
        this.deployInfo.body = '';
        this.$store.commit('saveCodeValue', '')
        this.reload()
      }
      ,
    }
  }
</script>

<style scoped>
  .submit_button {
    float: right;
    margin-bottom: 10px;
  }
  .el-alert{
    margin-bottom: 10px;
  }
</style>
