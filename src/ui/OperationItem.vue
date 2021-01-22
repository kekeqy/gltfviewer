<template>
  <div class="operation-item" @click="onClick()">
    <div
      :class="['iconfont', icon, active ? 'operation-item-active' : '']"
    ></div>
    <div>{{ title }}</div>
  </div>
</template>
<style scoped>
.operation-item {
  width: 32px;
  height: 58px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  margin-top: 4px;
}
.operation-item > div {
  width: 100%;
  text-align: center;
}
.operation-item-active {
  background-color: #e4e9f3 !important;
}
.operation-item > div:nth-child(1) {
  height: 32px;
  line-height: 32px;
  border-radius: 50%;
  border-width: 0px;
  background-color: rgba(228, 233, 243, 0.5);
  color: #0055f3;
}
.operation-item > div:nth-child(2) {
  height: 26px;
  line-height: 26px;
}
</style>

<script>
export default {
  name: "operation-item",
  data() {
    return {
      active: false,
    };
  },
  props: {
    title: String,
    icon: String,
  },
  mounted() {},
  destroyed() {},
  watch: { active: "onActiveChanged" },
  methods: {
    onClick() {
      this.active = true;
      if (
        ["移动", "隐藏", "透明"].includes(this.title) &&
        !this.$root.viewer.picker.pickedMesh
      ) {
        this.$message({
          message: "请先选择模型",
          type: "warning",
        });
      }
      this.$parent.$children.forEach((item) => {
        if (item.active && item !== this) {
          item.active = false;
        }
      });
      if (this.title === "隐藏") {
        this.$root.viewer.picker.hidePickedMesh();
      } else if (this.title === "反隐") {
        this.$root.viewer.picker.hideReverse();
      } else if (this.title === "全显") {
        this.$root.viewer.picker.showAll();
      } else if (this.title === "透明") {
        this.$root.viewer.picker.setTransparent();
      } else if (this.title === "复位") {
        this.$root.viewer.picker.reset();
      }
    },
    onActiveChanged() {
      if (this.title === "移动") {
        this.$root.viewer.picker.moveEnable = this.active;
      }
    },
  },
};
</script>