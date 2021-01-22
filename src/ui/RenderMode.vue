<template>
  <div class="render-mode">
    <el-radio-group v-model="renderMode">
      <el-radio-button label="默认"></el-radio-button>
      <el-radio-button label="线框"></el-radio-button>
    </el-radio-group>
  </div>
</template>

<style scoped>
.render-mode {
  width: 188px;
  height: 42px;
  margin: 0 auto;
  top: 5px;
  left: 0;
  right: 0;
}
.render-mode .el-radio-group {
  background-color: #00215c;
  width: 100%;
  border-radius: 20px;
  border: 1px solid #00215c;
  box-sizing: border-box;
}
.render-mode .el-radio-button {
  width: 50%;
}
.render-mode /deep/ .el-radio-button__inner {
  font-size: 16px;
  border-radius: 20px;
  width: 100%;
  background-color: #00215c;
  border: none;
  color: white;
}
.is-active /deep/ .el-radio-button__inner {
  background-color: #0055f3 !important;
}
</style>

<script>
export default {
  name: "render-mode",
  data() {
    return {
      renderMode: "默认",
    };
  },
  watch: {
    renderMode: "onRenderModeChanged",
  },
  methods: {
    onRenderModeChanged() {
      this.$root.viewer.object3d.setRenderMode(this.renderMode === "线框");
    },
  },
};
</script>