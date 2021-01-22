import { ViewerComponent } from './ViewerComponent';
import { Viewer } from './Viewer';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { FramingBehavior } from '@babylonjs/core/Behaviors/Cameras/framingBehavior';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { BoundingInfo } from '@babylonjs/core/Culling/boundingInfo';
import { Animation } from '@babylonjs/core/Animations/animation';
import { Animatable } from '@babylonjs/core/Animations/animatable';

/**
 * 相机控制
 */
export class CameraCtrl extends ViewerComponent {
    /**
     * 实例化一个相机控制
     * @param {Viewer} viewer 预览
     */
    constructor(viewer) {
        super(viewer);
        this.camera = new ArcRotateCamera('MainCamera', 0, 0, 10, Vector3.Zero(), this.viewer.renderEngine.scene);
        this.camera.attachControl(this.viewer.renderCanvas, true);
        this.camera.lowerRadiusLimit = 0.01;
        /**@type {Animatable[]} */
        this.animatables = [];
        this.onBeforeRenderObservable = this.viewer.renderEngine.scene.onBeforeRenderObservable.add(() => {
            this.camera.minZ = this.camera.radius * 0.01;
            if (this.camera.minZ < this.camera.lowerRadiusLimit) {
                this.camera.minZ = 0.01;
            }
        });
    }
    destroy() {
        this.animatables.splice(0);
        this.viewer.renderEngine.scene.onBeforeRenderObservable.remove(this.onBeforeRenderObservable);
        this.onBeforeRenderObservable = null;
        this.camera.detachControl();
        this.camera.dispose();
        this.camera = null;
        this.viewer = null;
    }
    /**
     * 自适应视角
     * @param {()=>void} onEndCallback
     */
    fit(onEndCallback = undefined) {
        this.focusOn(this.viewer.object3d.boundingInfo, onEndCallback);
    }
    /**
     * 聚焦
     * @param {BoundingInfo} boundingInfo 
     * @param {()=>void} onEndCallback
     */
    focusOn(boundingInfo, onEndCallback = undefined) {
        this.stopAni();
        this.camera.upperRadiusLimit = boundingInfo.boundingSphere.radius * 50;
        this.camera.maxZ = boundingInfo.boundingSphere.radius * 1000;
        this.camera.panningSensibility = 5000 / boundingInfo.diagonalLength;
        this.camera.wheelPrecision = 100 / boundingInfo.boundingSphere.radius;
        let num = Math.abs(Math.floor(this.camera.alpha / Math.PI * 0.5));
        if (num !== 0) {
            this.camera.alpha += (this.camera.alpha > 0 ? -num : num) * Math.PI * 2;
        }
        num = Math.abs(Math.floor(this.camera.beta / Math.PI * 0.5));
        if (num !== 0) {
            this.camera.beta += (this.camera.beta > 0 ? -num : num) * Math.PI * 2;
        }
        let duration = 500;
        let transition = Animation.CreateAnimation('target', Animation.ANIMATIONTYPE_VECTOR3, 60, FramingBehavior.EasingFunction);
        let animatabe = Animation.TransitionTo('target', boundingInfo.boundingBox.center, this.camera, this.viewer.renderEngine.scene, 60, transition, duration);
        this.animatables.push(animatabe);
        transition = Animation.CreateAnimation('radius', Animation.ANIMATIONTYPE_FLOAT, 60, FramingBehavior.EasingFunction);
        animatabe = Animation.TransitionTo('radius', boundingInfo.boundingSphere.radius * 3, this.camera, this.viewer.renderEngine.scene, 60, transition, duration);
        this.animatables.push(animatabe);
        transition = Animation.CreateAnimation('alpha', Animation.ANIMATIONTYPE_FLOAT, 60, FramingBehavior.EasingFunction);
        animatabe = Animation.TransitionTo('alpha', Math.PI / 2, this.camera, this.viewer.renderEngine.scene, 60, transition, duration);
        this.animatables.push(animatabe);
        transition = Animation.CreateAnimation('beta', Animation.ANIMATIONTYPE_FLOAT, 60, FramingBehavior.EasingFunction);
        animatabe = Animation.TransitionTo('beta', Math.PI / 3, this.camera, this.viewer.renderEngine.scene, 60, transition, duration, () => {
            onEndCallback && onEndCallback();
            this.stopAni();
        });
        this.animatables.push(animatabe);
    }
    stopAni() {
        while (this.animatables.length > 0) {
            let item = this.animatables.pop();
            item.stop();
        }
    }
    /**
     * 设置自动旋转
     * @param {boolean} value 
     */
    setAutoRotate(value) {
        if (value) {
            this.camera.useAutoRotationBehavior = true;
            this.camera.autoRotationBehavior.zoomStopsAnimation = true;//缩放时停止旋转
            this.camera.autoRotationBehavior.idleRotationSpeed = -0.5;//旋转速度
        }
        else {
            this.camera.useAutoRotationBehavior = false;
        }
    }
}