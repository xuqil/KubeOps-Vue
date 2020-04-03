<template>
  <div>
    <el-tag
      v-for="(item, index) in categoriesList"
      :key="item.id"
      :type="typeColors[index]"
      effect="plain">
      {{ item.name }}
    </el-tag>
  </div>
</template>

<script>
  export default {
    name: "Category",
    data() {
      return {
        categoriesList: [],
        typeColors: ['', 'success', 'info', 'danger', 'warning', '', 'success', 'info', 'danger', 'warning', '', 'success', 'info', 'danger', 'warning', '', 'success', 'info', 'danger', 'warning',]
      }
    },
    created() {
      this.getCategories();
    },
    methods: {
      //获取分类
      getCategories() {
        this.$api.wikiCategoriesGet().then(res => {
          this.categoriesList = res.data.results;
          console.log(this.categoriesList)
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
