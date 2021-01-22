<template>
  <div class="popup">
    <div class="popup-left"></div>
  </div>
</template>

<style scoped>
.popup {
  position: relative;
}
.popup-left {
  width: 0;
  height: 32px;
  border-right: 102px solid rgba(0, 71, 201, 0.7);
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
}
</style>

<script>
export default {
  name: "popup",
};
</script>