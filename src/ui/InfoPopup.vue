<template>
  <div class="popup">
    <div class="popup-left"></div>
    <div class="popup-right">
      <div class="info">
        <div>大小：{{ objectInfo.fileSize }}</div>
        <div>尺寸：{{ objectInfo.size }}</div>
        <div>节点：{{ objectInfo.objectCount }}</div>
        <div>网格：{{ objectInfo.meshCount }}</div>
        <div>材质：{{ objectInfo.materialCount }}</div>
        <div>贴图：{{ objectInfo.textureCount }}</div>
        <div>顶点：{{ objectInfo.vertexCount }}</div>
        <div>三角面：{{ objectInfo.triangleCount }}</div>
      </div>
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
  left: 102px;
  width: 400px;
  height: 200px;
  background-color: #0055f3;
  bottom: -52px;
  padding: 10px;
}
.info {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
}
.info > div {
  line-height: 50px;
  overflow: hidden;
}
.info > div:nth-child(odd) {
  width: 40%;
}
.info > div:nth-child(even) {
  width: 60%;
}
</style>

<script>
export default {
  name: "info-popup",
  data() {
    return {
      objectInfo: {
        fileSize: "0",
        size: "0",
        objectCount: 0,
        meshCount: 0,
        materialCount: 0,
        textureCount: 0,
        vertexCount: 0,
        triangleCount: 0,
      },
    };
  },
  mounted() {
    let objectInfo = this.$root.viewer.objectInfo;
    this.objectInfo.fileSize = objectInfo.fileSize;
    this.objectInfo.size = objectInfo.size;
    this.objectInfo.objectCount = objectInfo.objectCount;
    this.objectInfo.meshCount = objectInfo.meshCount;
    this.objectInfo.materialCount = objectInfo.materialCount;
    this.objectInfo.textureCount = objectInfo.textureCount;
    this.objectInfo.vertexCount = objectInfo.vertexCount;
    this.objectInfo.triangleCount = objectInfo.triangleCount;
  },
};
</script>