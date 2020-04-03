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
        this.$api.wikiTagsGet().then(res => {
          this.tagsList = res.data.results;
          console.log(this.tagsList)
        }).catch(onerror => {
          console.log(onerror);
          return this.$message.error('获取wiki标签失败！')
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
