import { EventDispatcher } from "./EventDispatcher";
import { Viewer } from './Viewer';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { InstantiatedEntries } from '@babylonjs/core/assetContainer';
import { BoundingInfo } from '@babylonjs/core/Culling/boundingInfo';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { BoxBuilder } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Vector3, Vector4 } from '@babylonjs/core/Maths/math.vector';
import { PlaneBuilder } from '@babylonjs/core/Meshes/Builders/planeBuilder';
import '@babylonjs/core/Rendering/boundingBoxRenderer';

/**
 * 3D物体
 */
export class Object3D extends EventDispatcher {
    /**
     * 实例化一个3D物体对象
     * @param {Viewer} viewer 预览
     */
    constructor(viewer) {
        super();
        /**
         * 预览
         */
        this.viewer = viewer;
        /**
         * 节点
         */
        this.node = new TransformNode('3D物体');
    }
    destroy() {
        this.node.dispose(false, true);
        this.node = null;
        this.rootMesh = null;
        this.entity = null;
        this.sizeNode = null;
        this.viewer = null;
    }
    computeInfo() {
        let objectInfo = this.viewer.objectInfo;
        objectInfo.size = `${parseFloat((this.boundingInfo.boundingBox.extendSize.x * 2).toFixed(2))}x${parseFloat((this.boundingInfo.boundingBox.extendSize.y * 2).toFixed(2))}x${parseFloat((this.boundingInfo.boundingBox.extendSize.z * 2).toFixed(2))}`;
        let nodes = this.rootMesh.getChildTransformNodes();
        objectInfo.objectCount = nodes.length;
        nodes.forEach(item => {
            if (item instanceof Mesh && item.geometry) {
                objectInfo.meshCount += 1;
                objectInfo.triangleCount += item.geometry.getTotalIndices();
                objectInfo.vertexCount += item.geometry.getTotalVertices();
                if (item.material) {
                    objectInfo.materialCount += 1;
                    objectInfo.textureCount += item.material.getActiveTextures().length;
                }
            }
        });
    }
    /**
     * 设置实体
     */
    setEntity() {
        /**
         * 实体
         * @type {InstantiatedEntries}
         */
        this.entity = this.viewer.resPool.getRes(this.viewer.url, true);
        /**
         * 根网格
         * @type {Mesh}
         */
        this.rootMesh = this.entity.rootNodes[0];
        this.rootMesh.setParent(null);
        this.rootMesh.parent = this.node;
        this.computeBoundingInfo();
        this.viewer.environment.setSkyBox();
        this.createSizeNode();
        this.computeInfo();
        this.initNode();
    }
    initNode() {
        this.rootMesh.getChildren(item => item, false).forEach(item => {
            //计算当前节点的包围盒
            let { min, max } = item.getHierarchyBoundingVectors(true);
            let boundingInfo = new BoundingInfo(min, max);
            let center = boundingInfo.boundingBox.center;
            let dir = center.subtract(this.boundingInfo.boundingBox.center);
            item._cacheData = {
                position: item.position.clone(),
                distance: dir.length(),
                dir: dir.normalize(),
                visibility: item.visibility,
                transparent: false
            };
            if (item.material) {
                item._cacheData.emissiveColor = item.material.emissiveColor.clone();
            }
        });
    }
    /**
     * 重置
     */
    reset() {
        this.rootMesh.getChildMeshes().forEach(item => {
            let cacheData = item._cacheData;
            cacheData.transparent = false;
            item.position.copyFrom(cacheData.cacheData.position);
            item.visibility = cacheData.visibility;
            item.material.emissiveColor.copyFrom(cacheData.emissiveColor);
        });
    }
    /**
     * 判断指定网格是否为子网格
     * @param {Mesh} mesh 
     */
    isChildMesh(mesh) {
        for (let child of this.rootMesh.getChildMeshes()) {
            if (child === mesh) {
                return true;
            }
        }
        return false;
    }
    createSizeNode() {
        this.sizeNode = new TransformNode('尺寸节点');
        this.sizeNode.setEnabled(false);
        this.sizeNode.parent = this.node;
        let pivot = this.boundingInfo.boundingBox.center.clone();
        pivot.y -= (this.boundingInfo.boundingBox.maximum.y - this.boundingInfo.boundingBox.minimum.y) * 0.5;
        this.sizeNode.position.set(pivot.x, pivot.y, pivot.z);

        let width = this.boundingInfo.boundingBox.extendSize.y * 2;
        let itemY = this.createSizeItem(width);
        itemY.rotation.z = Math.PI / 2;
        itemY.position.y = width * 0.5;
        itemY.position.x = -(this.boundingInfo.boundingBox.extendSize.x + this.boundingInfo.boundingSphere.radius * 0.25);
        itemY.parent = this.sizeNode;

        width = this.boundingInfo.boundingBox.extendSize.x * 2;
        let itemX = this.createSizeItem(width);
        itemX.position.y = this.boundingInfo.boundingBox.extendSize.y * 2 + this.boundingInfo.boundingSphere.radius * 0.25;
        itemX.parent = this.sizeNode;

        width = this.boundingInfo.boundingBox.extendSize.z * 2;
        let itemZ = this.createSizeItem(width);
        itemZ.rotation.y = Math.PI / 2;
        itemZ.position.x = this.boundingInfo.boundingBox.extendSize.x + this.boundingInfo.boundingSphere.radius * 0.25;
        itemZ.parent = this.sizeNode;
    }
    createSizeItem(width) {
        let r = this.boundingInfo.boundingSphere.radius * 0.5;
        let item = new TransformNode('尺寸节点项');
        let lineWidth = 0.01 * r;
        let material = new StandardMaterial('线材质', this.viewer.renderEngine.scene);
        material.disableLighting = true;
        material.emissiveColor.set(1, 1, 1);
        let line1 = BoxBuilder.CreateBox('横线', {
            width: width,
            height: lineWidth,
            depth: lineWidth
        });
        line1.material = material;
        line1.parent = item;
        let line2 = BoxBuilder.CreateBox('左竖线', {
            width: lineWidth,
            height: lineWidth * 10,
            depth: lineWidth
        });
        line2.material = material;
        line2.position.x = -width / 2;
        line2.parent = item;
        let line3 = BoxBuilder.CreateBox('右竖线', {
            width: lineWidth,
            height: lineWidth * 10,
            depth: lineWidth
        });
        line3.material = material;
        line3.position.x = width / 2;
        line3.parent = item;
        let plane = this.makeSizePlane(width);
        plane.scaling.setAll(r);
        plane.parent = item;
        plane.position.y = 0.125 * r;
        return item;
    }
    /**
     * 
     * @param {number} width 平面宽度 
     */
    makeSizePlane(width) {
        let dynamicTexture = new DynamicTexture("DynamicTexture", {
            height: 64,
            width: 128
        });
        dynamicTexture.hasAlpha = true;
        dynamicTexture.wrapU = Texture.WRAP_ADDRESSMODE;
        dynamicTexture.wrapV = Texture.WRAP_ADDRESSMODE;
        let text = `${parseFloat(width.toFixed(2))}米`;
        let ctx = dynamicTexture.getContext();
        let font_type = "Arial";
        let size = 12;
        ctx.font = size + "px " + font_type;
        let textWidth = ctx.measureText(text).width;
        let ratio = textWidth / size;
        let font_size = Math.floor(128 / (ratio * 1));
        if (font_size > 24) {
            font_size = 24;
        }
        let font = font_size + "px " + font_type;
        dynamicTexture.drawText(text, null, 45, font, "white", "transparent", true);
        dynamicTexture.update();
        let frontUVs = new Vector4(0, 0, -1, 1);
        let backUVs = new Vector4(0, 0, 1, 1);
        let plane = PlaneBuilder.CreatePlane("TextPlane", { width: 0.5, height: 0.25, frontUVs: frontUVs, backUVs: backUVs, sideOrientation: Mesh.DOUBLESIDE });
        let material = new StandardMaterial("TextPlaneMaterial", this.viewer.renderEngine.scene);
        material.disableLighting = true;
        material.emissiveColor.set(1, 1, 1);
        material.diffuseTexture = dynamicTexture;
        plane.material = material;
        return plane;
    }
    computeBoundingInfo() {
        if (this.entity.skeletons.length > 0) {
            this.rootMesh.getChildMeshes().forEach(item => {
                if (item.skeleton) {
                    item.refreshBoundingInfo(true);
                }
            });
        }
        this.rootMesh.computeWorldMatrix(true);
        let { min, max } = this.rootMesh.getHierarchyBoundingVectors(true);
        this.boundingInfo = new BoundingInfo(min, max);
        this.rootMesh.setBoundingInfo(this.boundingInfo);
    }
    playAni() {
        if (this.entity.animationGroups.length > 0) {
            this.entity.animationGroups.forEach(item => {
                item._onAnimationGroupEndObservable = item.onAnimationGroupEndObservable.add(() => {
                    let index = this.entity.animationGroups.indexOf(item);
                    let lastItem = index == this.entity.animationGroups.length - 1 ? this.entity.animationGroups[0] : this.entity.animationGroups[index + 1];
                    lastItem.play(false);
                });
            });
            this.entity.animationGroups[0].play(false);
        }
    }
    stopAni() {
        this.entity.animationGroups.forEach(item => {
            item.onAnimationGroupEndObservable.remove(item._onAnimationGroupEndObservable);
            item._onAnimationGroupEndObservable = null;
            if (item.isStarted) {
                item.stop();
                item.reset();
            }
        })
    }
    /**
     * 设置渲染模式
     * @param {boolean} wireframe 线框模式
     */
    setRenderMode(wireframe) {
        this.rootMesh.getChildMeshes().forEach(item => {
            if (item.material) {
                item.material.wireframe = wireframe;
            }
        })
    }
    /**
     * 是否显示尺寸
     * @param {boolean} value 
     */
    showSize(value) {
        this.sizeNode.setEnabled(value);
        this.rootMesh.showBoundingBox = value;
    }
    /**
     * 拆分
     * @param {number} value 百分比，值为0~100
     */
    split(value) {
        this.rootMesh.getChildren().forEach(item => {
            let cacheData = item._cacheData;
            /**@type {Vector3} */
            let newPosition = cacheData.position.add(cacheData.dir.scale(value * cacheData.distance / 100));
            item.position.copyFrom(newPosition);
        });
    }
}