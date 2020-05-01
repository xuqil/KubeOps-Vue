//获取数组内元素索引
indexArray = function(val, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === val) return i;
  }
  return -1;
};
//删除数组中指定元素
removeArray = function(val, array) {
  let index = this.indexArray(val, array);
  if (index > -1) {
    array.splice(index, 1);
  }
};

