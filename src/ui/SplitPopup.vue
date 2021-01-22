<template>
  <div class="popup">
    <div class="popup-left"></div>
    <div class="popup-right">
      <el-slider v-model="value" :show-tooltip="false"></el-slider>
    </div>
  </div>
</template>

<style scoped>
.popup {
  position: absolute;
}
.popup > div {
  position: absolute;
}
.popup-left {
  width: 0;
  height: 32px;
  border-right: 102px solid rgba(0, 71, 201, 0.7);
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
}
.popup-right {
  left: 80px;
  width: 210px;
  height: 52px;
  line-height: 52px;
  background-color: #0055f3;
  border-radius: 26px;
}
.el-slider {
  margin-top: 7px;
  width: 168px;
  margin-left: 21px;
}
</style>

<script>
export default {
  name: "split-popup",
  data() {
    return {
      value: 0,
    };
  },
  watch: {
    value: "onValueChanged",
  },
  destroyed() {
    this.$root.viewer.object3d.split(0);
  },
  methods: {
    onValueChanged() {
      this.$root.viewer.object3d.split(this.value);
    },
  },
};
</script>