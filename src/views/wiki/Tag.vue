<template>
  <div>
    <el-tag
      v-for="(item, index) in tagsList"
      :key="item.id"
      :type="typeColors[index]">
      {{ item.name }}
    </el-tag>
  </div>
</template>

<script>
  export default {
    name: "Tag",
    data() {
      return {
        tagsList: [],
        typeColors: ['', 'success', 'info', 'danger', 'warning', '', 'success', 'info', 'danger', 'warning', '', 'success', 'info', 'danger', 'warning', '', 'success', 'info', 'danger', 'warning',]
      }
    },
    created() {
      this.getTags();
    },
    methods: {
      //获取标签
      getTags() {
        this.$api.Wiki.wikiTagsGet().then(res => {
          this.tagsList = res.data.results;
          console.log(this.tagsList)
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
    }

  }
</script>

<style scoped>
  .el-tag{
    margin-right: 10px;
  }
</style>
