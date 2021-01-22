import { ViewerComponent } from './ViewerComponent';
import { Viewer } from './Viewer';
import { PointerEventTypes, PointerInfo } from '@babylonjs/core/Events/pointerEvents';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { PointerDragBehavior } from '@babylonjs/core/Behaviors/Meshes/pointerDragBehavior';

/**
 * 拾取器
 */
export class Picker extends ViewerComponent {
    /**
     * 
     * @param {Viewer} viewer 预览
     */
    constructor(viewer) {
        super(viewer);
        this.scene = viewer.renderEngine.scene;
        this.camera = viewer.cameraCtrl.camera;
        /**
         * 是否可拾取
         */
        this.pickEnable = false;
        /**
         * 是否可移动
         */
        this.moveEnable = false;
        /**
         * 拾取的网格
         * @type {Mesh}
         */
        this.pickedMesh = null;
        /**@type {PointerInfo} */
        this.downInfo = null;
        /**@type {PointerInfo} */
        this.upInfo = null;
        this.pointerDragBehavior = new PointerDragBehavior({ dragPlaneNormal: new Vector3(0, 1, 0).normalize() });
        this.pointerDragBehavior.useObjectOrientationForDragging = false;
        this.onPointerObservable = this.scene.onPointerObservable.add(this._onPointerHandle.bind(this));
    }
    destroy() {
        this.pickedMesh = null;
        this.pointerDragBehavior.detach();
        this.pointerDragBehavior = null;
        this.scene.onPointerObservable.remove(this.onPointerObservable);
        this.onPointerObservable = null;
        this.scene = null;
        this.camera = null;
        this.viewer = null;
        this.downInfo = null;
        this.upInfo = null;
    }
    /**
     * 隐藏拾取
     */
    hidePickedMesh() {
        if (this.pickedMesh) {
            this.pickedMesh.setEnabled(false);
        }
    }
    setTransparent() {
        if (this.pickedMesh) {
            let cacheData = this.pickedMesh._cacheData;
            if (cacheData.transparent) {
                return;
            }
            this.pickedMesh.visibility = cacheData.visibility * 0.2;
            cacheData.transparent = !cacheData.transparent;
        }
    }
    reset() {
        this.pickedMesh = null;
        this.viewer.object3d.rootMesh.getChildren(item => item, false).forEach(item => {
            item.setEnabled(true);
            let cacheData = item._cacheData;
            if (cacheData.transparent) {
                cacheData.transparent = false;
                item.visibility = cacheData.visibility;
            }
            if (item.material) {
                item.material.emissiveColor.copyFrom(cacheData.emissiveColor);
            }
            item.position.copyFrom(cacheData.position);
        });
    }
    /**
     * 反向隐藏
     */
    hideReverse() {
        this.viewer.object3d.rootMesh.getChildMeshes().forEach(item => {
            item.setEnabled(!item.isEnabled());
        });
    }
    showAll() {
        this.viewer.object3d.rootMesh.getChildMeshes().forEach(item => {
            item.setEnabled(true);
        })
    }
    /**
     * 
     * @param {PointerInfo} pointerInfo 
     */
    _onPointerHandle(pointerInfo) {
        if (!this.pickEnable || pointerInfo.event.button !== 0) {
            return;
        }
        switch (pointerInfo.type) {
            case PointerEventTypes.POINTERDOWN:
                this._pointerDown(pointerInfo);
                break;
            case PointerEventTypes.POINTERUP:
                this._pointerUp(pointerInfo);
                break;
        }
    }
    /**
     * 
     * @param {PointerInfo} pointerInfo 
     */
    _pointerUp(pointerInfo) {
        this.upInfo = pointerInfo;
        //判断是否点在了空白处
        if (this.pointerDragBehavior.attachedNode) {
            this.pointerDragBehavior.detach();
            this.viewer.renderCanvas.style.cursor = '';
            this.camera.attachControl();
        }
        if (!this.moveEnable && this.pickedMesh
            && this.downInfo.event.clientX == this.upInfo.event.clientX && this.downInfo.event.clientY === this.upInfo.event.clientY
            && this.pickedMesh !== this.upInfo.pickInfo.pickedMesh) {
            this._resetEmissive(this.pickedMesh);
            this.pickedMesh = null;
        }
    }
    /**
     * 
     * @param {PointerInfo} pointerInfo 
     */
    _pointerDown(pointerInfo) {
        this.downInfo = pointerInfo;
        if (this.downInfo.pickInfo.hit && this.viewer.object3d.isChildMesh(this.downInfo.pickInfo.pickedMesh)) {
            if (this.pickedMesh) {
                //清除之前拾取的mesh
                this._resetEmissive(this.pickedMesh);
                this.pickedMesh.removeBehavior(this.pointerDragBehavior);
                this.pickedMesh = null;
            }
            this.pickedMesh = this.downInfo.pickInfo.pickedMesh;
            this.pickedMesh.material.emissiveColor.set(0.5, 0, 0);

            if (this.moveEnable) {//可移动
                this.camera.detachControl();
                this.viewer.renderCanvas.style.cursor = 'move';
                this.pointerDragBehavior.options.dragPlaneNormal.copyFrom(this.camera.getForwardRay().direction)
                this.pickedMesh.addBehavior(this.pointerDragBehavior);
            }
        }
    }
    /**
     * 
     * @param {Mesh} mesh 
     */
    _resetEmissive(mesh) {
        if (!mesh._cacheData) {
            return;
        }
        mesh.material.emissiveColor.copyFrom(mesh._cacheData.emissiveColor);
    }
}