import request from "./request";

export default {
  /*****************wiki相关******************/
  //添加文章
  postPost(data) {
    return request.post('/wiki/posts/', data)
  },
  //获取文章
  postsGet(params = null) {
    return request.get('/wiki/posts/', params)
  },
  //获取某文章
  postDetailGet(suffix) {
    return request.get('/wiki/posts/' + suffix + '/')
  },
  //修改文章
  postPut(suffix, data) {
    return request.noQsPut('/wiki/posts/' + suffix + '/', data)
  },
  //删除文章
  postDelete(suffix) {
    return request.delete('/wiki/posts/' + suffix + '/')
  },

  //添加wiki标签
  wikiTagsPost(data) {
    return request.post('/wiki/tags/', data)
  },
  //获取wiki标签
  wikiTagsGet(params = null) {
    return request.get('/wiki/tags/', params)
  },
  //修改文章
  wikiTagPut(suffix, data) {
    return request.put('/wiki/tags/' + suffix + '/', data)
  },
  //删除文章
  wikiTagDelete(suffix) {
    return request.delete('/wiki/tags/' + suffix + '/')
  },

  //添加wiki分类
  wikiCategoryPost(data) {
    return request.post('/wiki/categories/', data)
  },
  //获取wiki分类
  wikiCategoriesGet(params = null) {
    return request.get('/wiki/categories/', params)
  },
  //修改分类
  wikiCategoryPut(suffix, data) {
    return request.put('/wiki/categories/' + suffix + '/', data)
  },
  //删除分类
  wikiCategoryDelete(suffix) {
    return request.delete('/wiki/categories/' + suffix + '/')
  },


  //添加wiki评论
  wikiCommentPost(data) {
    return request.post('/wiki/comments/', data)
  },
  //获取wiki评论
  wikiCommentsGet(params = null) {
    return request.get('/wiki/comments/', params)
  },
  //修改评论
  wikiCommentPut(suffix, data) {
    return request.put('/wiki/comments/' + suffix + '/', data)
  },
  //删除评论
  wikiCommentDelete(suffix) {
    return request.delete('/wiki/comments/' + suffix + '/')
  },
}
