import { Viewer } from './Viewer';
import { ViewerComponent } from './ViewerComponent';
import { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture';
import { Layer } from '@babylonjs/core/Layers/layer';
import { BoxBuilder } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { VertexBuffer } from '@babylonjs/core/Meshes/buffer';
import '@babylonjs/core/Helpers/sceneHelpers';

/**
 * 环境
 */
export class Environment extends ViewerComponent {
    /**
     * 实例化一个环境对象
     * @param {Viewer} viewer 预览
     */
    constructor(viewer) {
        super(viewer);
        /**
         * 背景
         */
        this.background = new Layer('背景');
        /**
         * 天空盒子
         */
        this.skybox = BoxBuilder.CreateBox('skybox', { size: 1000, updatable: true });
        this.skybox.setEnabled(false);
        this.skybox.infiniteDistance = true;
        let skyboxMaterial = new PBRMaterial('skybox', this.viewer.renderEngine.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.twoSidedLighting = true;
        // skyboxMaterial.microSurface = 1 - 0.8;
        this.skybox.material = skyboxMaterial;
        // /**
        //  * 平行光
        //  */
        // this.directionalLight = new DirectionalLight('平行光', new Vector3(-1, -1, -1));
        // /**
        //  * 半球光
        //  */
        // this.hemisphericLight = new HemisphericLight('半球光', new Vector3(0, 1, 0));
        this.viewer.renderEngine.scene.createDefaultLight();
    }
    destroy() {
        this.background.dispose();
        this.background = null;
        this.skybox.dispose(false, true);
        this.skybox = null;
        this.viewer = null;
    }
    setSkyBox() {
        /**@type {CubeTexture} */
        // let cubeTexture = this.viewer.resPool.getRes('gltfviewer/cubetexture/skybox1/', true);
        let cubeTexture = this.viewer.resPool.getRes('gltfviewer/equirectangularcubetexture/skybox.png', true);
        cubeTexture.coordinatesMode = Texture.SKYBOX_MODE;
        this.skybox.material.reflectionTexture = cubeTexture;
        //修改盒子大小
        let positions = this.skybox.getVerticesData(VertexBuffer.PositionKind);
        let r = this.viewer.object3d.boundingInfo.boundingSphere.radius * 500;
        for (let i = 0; i < positions.length; i++) {
            positions[i] = positions[i] > 0 ? r : -r;
        }
        this.skybox.updateVerticesData(VertexBuffer.PositionKind, positions);
        this.skybox.setEnabled(true);
    }
    setEnvironmentTexture() {
        /**@type {CubeTexture} */
        let cubeTexture = this.viewer.resPool.getRes('gltfviewer/cubetexture/skybox1/', true);
        this.viewer.renderEngine.scene.environmentTexture = cubeTexture;
    }
    setBackground(id) {
        this.skybox.setEnabled(false);
        this.background.texture = this.viewer.resPool.getRes(`gltfviewer/texture/background${id}.jpg`);
    }
}