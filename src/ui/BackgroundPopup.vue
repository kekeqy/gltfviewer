<template>
  <div class="popup">
    <div class="popup-left"></div>
    <div class="popup-right">
      <el-button @click="changeBackground(1)">背景一</el-button>
      <el-button @click="changeBackground(2)">背景二</el-button>
      <el-button @click="changeBackground(3)">背景三</el-button>
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
  text-align: center;
}
.el-button {
  border: none;
  width: 50px;
  height: 32px;
  line-height: 32px;
  background-color: rgba(228, 233, 243, 0.5);
  color: #0055f3;
  padding: 0;
  border-radius: 16px;
}
</style>

<script>
export default {
  name: "background-popup",
  methods: {
    changeBackground(id) {
      this.$root.viewer.environment.setBackground(id);
    },
  },
};
</script>