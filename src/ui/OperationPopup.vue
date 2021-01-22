<template>
  <div class="popup">
    <div class="popup-left"></div>
    <div class="popup-right">
      <operation-item
        icon="icon-caozuojiemiantubiao--_yidong"
        title="移动"
      ></operation-item>
      <operation-item icon="icon-fuwei" title="复位"></operation-item>
      <operation-item
        icon="icon-yincangmima1"
        title="隐藏"
      ></operation-item>
      <operation-item
        icon="icon-xianyinhuhuan"
        title="反隐"
      ></operation-item>
      <operation-item icon="icon-yulan1" title="全显"></operation-item>
      <operation-item
        icon="icon-touming"
        title="透明"
      ></operation-item>
    </div>
  </div>
</template>

<style scoped>
.popup {
  position: absolute;
  top: -5px;
}
.popup > div {
  position: absolute;
}
.popup-left {
  width: 0;
  height: 32px;
  border-right: 102px solid rgba(0, 71, 201, 0.7);
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
}
.popup-right {
  left: 102px;
  width: 310px;
  height: 62px;
  background-color: #0055f3;
  bottom: -62px;
  display: flex;
  justify-content: space-around;
}
</style>

<script>
import OperationItem from "./OperationItem.vue";
export default {
  components: { OperationItem },
  name: "operation-popup",
};
</script>