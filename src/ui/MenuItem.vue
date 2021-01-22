<template>
  <div class="menu-item">
    <div class="menu-item-popup" v-if="isOpen">
      <component
        ref="component"
        v-if="!!componentName"
        :is="componentName"
      ></component>
    </div>
    <div>
      <span>{{ title }}</span>
      <el-button :icon="icon" @click="onclick()" circle></el-button>
    </div>
  </div>
</template>

<style scoped>
.menu-item {
  width: 85px;
  height: 52px;
  color: white;
  margin-top: 10px;
  margin-left: 15px;
  position: relative;
}
.menu-item > * {
  position: absolute;
}
.menu-item > span {
  line-height: 52px;
}
.el-button {
  width: 42px;
  height: 42px;
  color: white;
  background-color: #0055f3;
  border: none;
  font-size: 18px;
}
.menu-item-popup {
  left: 50px;
  top: -5px;
}
</style>

<script>
import BackgroundPopup from "./BackgroundPopup.vue";
import InfoPopup from "./InfoPopup.vue";
import SplitPopup from "./SplitPopup.vue";
import OperationPopup from "./OperationPopup.vue";

export default {
  components: {
    BackgroundPopup,
    SplitPopup,
    InfoPopup,
    OperationPopup,
  },
  name: "menu-item",
  data() {
    return {
      isOpen: false,
    };
  },
  props: {
    title: String,
    icons: Array,
    componentName: String,
  },
  computed: {
    icon() {
      if (this.isOpen) {
        if (this.icons.length === 1) {
          return `iconfont ${this.icons[0]}`;
        } else {
          return `iconfont ${this.icons[1]}`;
        }
      } else {
        return `iconfont ${this.icons[0]}`;
      }
    },
  },
  watch: {
    isOpen: "stateChanged",
  },
  mounted() {
    if (this.title === "动画") {
      this.isOpen = this.$root.viewer.autoAnimate;
    }
  },
  methods: {
    onclick() {
      this.isOpen = !this.isOpen;
      this.$parent.$children.forEach((item) => {
        if (item.isOpen && item !== this) {
          item.isOpen = false;
        }
      });
      if (this.title === "旋转" && this.isOpen) {
        return;
      }
      this.$root.viewer.cameraCtrl.fit();
    },
    stateChanged() {
      if (this.title === "动画") {
        if (this.isOpen) {
          //播放动画
          this.$root.viewer.object3d.playAni();
        } else {
          this.$root.viewer.object3d.stopAni();
        }
      } else if (this.title === "尺寸") {
        this.$root.viewer.object3d.showSize(this.isOpen);
      } else if (this.title === "旋转") {
        if (this.isOpen) {
          this.$root.viewer.cameraCtrl.fit(() => {
            this.$root.viewer.cameraCtrl.setAutoRotate(this.isOpen);
          });
        } else {
          this.$root.viewer.cameraCtrl.setAutoRotate(this.isOpen);
        }
      } else if (this.title === "操作") {
        this.$root.viewer.picker.pickEnable = this.isOpen;
        this.$root.viewer.picker.moveEnable = false;
        if (!this.isOpen) {
          this.$root.viewer.picker.reset();
        }
      }
    },
  },
};
</script>