<template>
  <div
    class="root"
    oncontextmenu="return false"
    @fullscreenchange="handleFullScreen"
    @webkitfullscreenchange="handleFullScreen"
    @mozfullscreenchange="handleFullScreen"
  >
    <canvas ref="renderCanvas" class="render-canvas"></canvas>
    <render-mode v-show="loaded"></render-mode>
    <full-screen v-show="loaded" :isFullScreen="isFullScreen"></full-screen>
    <menu-list
      ref="menuList"
      v-show="loaded"
      :hasAni="hasAni"
      :canSplit="canSplit"
    ></menu-list>
    <progress-bar v-if="loading" :percentage="loadingPercentage"></progress-bar>
  </div>
</template>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  position: relative;
  font-family: "PingFang-SC-Regular", "Helvetica Neue", "PingFang SC", Helvetica,
    "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 14px;
  user-select: none;
}
.root > * {
  position: absolute;
}
.render-canvas {
  width: 100%;
  height: 100%;
  background-color: #9c9e93;
  outline: none;
  background-color: black;
}
</style>

<script>
import "./iconfont.css";
import FullScreen from "./FullScreen.vue";
import MenuList from "./MenuList.vue";
import RenderMode from "./RenderMode.vue";
import { getFullScreenElement } from "./fullscreen.js";
import ProgressBar from "./ProgressBar.vue";

export default {
  name: "ui",
  components: {
    FullScreen,
    MenuList,
    RenderMode,
    ProgressBar,
  },
  data() {
    return {
      isFullScreen: {
        value: false,
      },
      loading: false,
      loadingPercentage: 0,
      loaded: false,
      hasAni: false,
      canSplit: false,
    };
  },
  methods: {
    handleFullScreen() {
      this.isFullScreen.value = getFullScreenElement() === this.$el;
    },
  },
};
</script>