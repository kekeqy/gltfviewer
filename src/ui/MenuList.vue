<template>
  <div class="menu-list">
    <menu-item
      title="背景"
      :icons="['icon-757bianjiqi_beijing']"
      componentName="BackgroundPopup"
    >
    </menu-item>
    <menu-item
      title="尺寸"
      :icons="['icon-icon_chicun', 'icon-guanbichicun']"
    ></menu-item>
    <menu-item
      ref="animation"
      v-if="hasAni"
      title="动画"
      :icons="['icon-bofang', 'icon-zanting']"
    ></menu-item>
    <menu-item
      v-if="canSplit"
      title="拆分"
      :icons="['icon-chanpin']"
      componentName="SplitPopup"
    ></menu-item>
    <menu-item
      ref="rotation"
      title="旋转"
      :icons="['icon-xuanzhuan', 'icon-guanbixuanzhuan']"
    ></menu-item>
    <menu-item
      title="操作"
      :icons="['icon-caozuo']"
      componentName="OperationPopup"
    ></menu-item>
    <menu-item
      title="参数"
      :icons="['iconinfo']"
      componentName="InfoPopup"
    ></menu-item>
  </div>
</template>

<style scoped>
.menu-list {
  width: 100px;
  bottom: 20px;
  background-image: linear-gradient(to right, #00205a, rgba(0, 32, 90, 0));
}
</style>

<script>
import MenuItem from "./MenuItem.vue";

export default {
  components: {
    MenuItem,
  },
  name: "menu-list",
  props: {
    hasAni: Boolean,
    canSplit: Boolean,
  },
};
</script>