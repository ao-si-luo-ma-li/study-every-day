<template>
  <div class="ppd">
    啦啦啦,哈哈哈 {{ll}}
  </div>
</template>

<script>
export default {
  data() {
    return {
      ll: 'vue 运行成功！'
    }
  },
}
</script>

<style lang="less" scoped>
.ppd {
  color: red;
}
</style>
