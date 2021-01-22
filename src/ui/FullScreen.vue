<template>
  <el-button
    @click="handleFullScreen()"
    :icon="
      isFullScreen.value
        ? 'iconfont icon-tuichuzhuanhuan'
        : 'iconfont icon-quanping1'
    "
    circle
  ></el-button>
</template>

<style scoped>
.el-button {
  width: 42px;
  height: 42px;
  bottom: 20px;
  right: 20px;
  background-color: #002971;
  border: none;
  color: white;
}
.el-button /deep/ .iconfont {
  font-size: 18px;
}
</style>

<script>
import { exitFullscreen, enterFullScreen } from "./fullscreen.js";

export default {
  name: "full-screen",
  props: {
    isFullScreen: {
      value: Boolean,
    },
  },
  methods: {
    handleFullScreen() {
      if (this.isFullScreen.value) {
        //退出全屏
        exitFullscreen();
      } else {
        //进入全屏
        enterFullScreen(this.$parent.$el);
      }
    },
  },
};
</script>