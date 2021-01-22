<template>
  <div class="progress-bar">
    <div>{{ format(percentage) }}</div>
    <div>
      <el-progress
        :percentage="percentage"
        :show-text="false"
        :stroke-width="10"
        color="#0a1c3b"
      ></el-progress>
    </div>
    <div>加载中...</div>
  </div>
</template>

<style scoped>
.progress-bar {
  color: #666666;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 50%;
  height: 80px;
  display: flex;
  flex-direction: column;
}
.progress-bar > div {
  width: 100%;
  height: 33.33%;
  text-align: center;
  line-height: 100%;
}
.progress-bar /deep/ .el-progress-bar__outer {
  background-color: #232d3c;
}
</style>

<script>
export default {
  name: "progress-bar",
  props: {
    percentage: Number,
  },
  methods: {
    format(value) {
      return `${parseFloat(value.toFixed(2))}%`;
    },
  },
};
</script>