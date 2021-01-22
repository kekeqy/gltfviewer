import { Viewer } from './Viewer';
import { ViewerComponent } from './ViewerComponent';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { LinesBuilder } from '@babylonjs/core/Meshes/Builders/linesBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { PlaneBuilder } from '@babylonjs/core/Meshes/Builders/planeBuilder';

/**
 * 渲染引擎
 */
export class RenderEngine extends ViewerComponent {
    /**
     * 实例化一个渲染引擎对象
     * @param {Viewer} viewer 预览
     */
    constructor(viewer) {
        super(viewer);
        /**
         * 引擎
         */
        this.engine = new Engine(this.viewer.renderCanvas, true, {
            deterministicLockstep: true,
            lockstepMaxSteps: 4,
            timeStep: 1 / 60,
            premultipliedAlpha: false,
            preserveDrawingBuffer: true
        });
        /**
         * 场景
         */
        this.scene = new Scene(this.engine);
        this.scene.useRightHandedSystem = true;
        this.scene.doNotHandleCursors = true;
        this.scene.useDelayedTextureLoading = false;
        this.scene.imageProcessingConfiguration.exposure = 1.0;
        this.scene.imageProcessingConfiguration.contrast = 2.0;
        this._renderLoop();
    }
    destroy() {
        this.engine.stopRenderLoop();
        this.scene.dispose();
        this.scene = null;
        this.engine.dispose();
        this.engine = null;
        this.viewer = null;
    }
    _renderLoop() {
        this.engine.runRenderLoop(() => {
            if (this.viewer.size.with !== this.viewer.renderCanvas.clientWidth || this.viewer.size.height != this.viewer.renderCanvas.clientHeight) {
                this.viewer.size.with = this.viewer.renderCanvas.clientWidth;
                this.viewer.size.height = this.viewer.renderCanvas.clientHeight;
                this.engine.resize();
            }
            this.scene.render();
        });
    }
    /**
     * 显示坐标轴
     * @param {number} size 大小
     */
    showAxis(size) {
        let axisX = LinesBuilder.CreateLines('axisX', {
            points: [
                Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
                new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
            ]
        });
        axisX.color = new Color3(1, 0, 0);
        let xChar = this.makeTextPlane("X", "red", size / 10);
        xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);

        let axisY = LinesBuilder.CreateLines("axisY", {
            points: [
                Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
                new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
            ]
        });
        axisY.color = new Color3(0, 1, 0);
        let yChar = this.makeTextPlane("Y", "green", size / 10);
        yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

        let axisZ = LinesBuilder.CreateLines("axisZ", {
            points: [
                Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
                new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
            ]
        });
        axisZ.color = new Color3(0, 0, 1);
        let zChar = this.makeTextPlane("Z", "blue", size / 10);
        zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
    }
    /**
     * 创建文本面板
     * @param {string} text 文本
     * @param {string} color 颜色
     * @param {number} size 大小
     */
    makeTextPlane(text, color, size) {
        var dynamicTexture = new DynamicTexture("DynamicTexture", 50);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
        var plane = PlaneBuilder.CreatePlane("TextPlane", { size: size });
        plane.material = new StandardMaterial("TextPlaneMaterial", this.scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
        return plane;
    }
}