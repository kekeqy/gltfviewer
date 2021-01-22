import Vue from 'vue';
import { CameraCtrl } from './CameraCtrl';
import { Environment } from './Environment';
import { EventDispatcher } from './EventDispatcher';
import { Object3D } from './Object3D';
import { Picker } from './Picker';
import { RenderEngine } from './RenderEngine';
import { ResPool } from './ResPool';
import UI from './ui/UI.vue';

/**
 * 预览
 */
export class Viewer extends EventDispatcher {
    /**
     * 加载开始事件
     */
    static LOAD_START = 'LOAD_START';
    /**
     * 加载进度事件
     */
    static LOAD_PROGRESS = 'LOAD_PROGRESS';
    /**
     * 加载结束事件
     */
    static LOAD_END = 'LOAD_END';
    /**
     * 实例化一个预览对象
     * @param {string} url 模型资源地址
     * @param {HTMLDivElement} container DOM容器
     * @param {boolean} autoRotate 自动旋转
     * @param {boolean} autoAnimate 自动播放动画
     */
    constructor(url, container, autoRotate = true, autoAnimate = true) {
        super();
        this.ui = new Vue({
            el: document.createElement('div'),
            render: h => h(UI)
        }).$children[0];
        this.ui.$root.viewer = this;
        /**
         * DOM容器
         */
        this.container = container;
        container.appendChild(this.ui.$el);
        /**
         * 模型资源地址
         */
        this.url = url;
        /**
         * 自动旋转
         */
        this.autoRotate = autoRotate;
        /**
         * 自动播放动画
         */
        this.autoAnimate = autoAnimate;
        /**
         * 画布
         * @type {HTMLCanvasElement}
         */
        this.renderCanvas = this.ui.$refs.renderCanvas;
        /**
         * 画布大小
         */
        this.size = {
            /**
             * 宽度
             */
            with: 0,
            /**
             * 高度
             */
            height: 0
        };
        /**
         * 渲染引擎
         */
        this.renderEngine = new RenderEngine(this);
        /**
         * 相机控制器
         */
        this.cameraCtrl = new CameraCtrl(this);
        /**
         * 拾取器
         */
        this.picker = new Picker(this);
        /**
         * 资源池
         */
        this.resPool = new ResPool(this);
        /**
         * 环境
         */
        this.environment = new Environment(this);
        /**
         * 物体
         */
        this.object3d = new Object3D(this);
        /**
         * 物体信息
         */
        this.objectInfo = {
            fileSize: '0',
            size: '0',
            objectCount: 0,
            meshCount: 0,
            materialCount: 0,
            textureCount: 0,
            vertexCount: 0,
            triangleCount: 0
        };
        // this.renderEngine.showAxis(1000);
        this.load();
    }
    /**
     * 销毁
     */
    destroy() {
        this.objectInfo = null;
        this.object3d.destroy();
        this.object3d = null;
        this.environment.destroy();
        this.environment = null;
        this.resPool.destroy();
        this.resPool = null;
        this.picker.destroy();
        this.picker = null;
        this.cameraCtrl.destroy();
        this.cameraCtrl = null;
        this.renderEngine.destroy();
        this.renderEngine = null;
        this.size = null;
        this.renderCanvas = null;
        this.container = null;
        this.ui.$root.viewer = null;
        this.ui.$root.$destroy(true);
        this.ui.$el.parentElement.removeChild(this.ui.$el);
        this.ui.$destroy(true);
        this.ui = null;
        this.offAll();
    }
    /**
     * 加载
     */
    async load() {
        if (this.ui.loaded) return;
        this._initEvents();
        this.trigger(Viewer.LOAD_START);
        await this._runLoadResTask();
        this.trigger(Viewer.LOAD_END);
    }
    _initEvents() {
        this.on(Viewer.LOAD_START, () => {
            this.ui.loading = true;
        });
        this.on(Viewer.LOAD_PROGRESS, ev => {
            this.ui.loadingPercentage = ev.data;
        });
        this.on(Viewer.LOAD_END, () => {
            this.ui.loading = false;
            this.ui.loaded = true;
            this.environment.setEnvironmentTexture();
            this.object3d.setEntity();
            this.ui.hasAni = this.object3d.entity.animationGroups.length > 0;
            this.ui.$refs.menuList.$refs.rotation.isOpen = this.autoRotate;
            this.ui.canSplit = this.object3d.rootMesh.getChildren().length > 1;
            this.cameraCtrl.focusOn(this.object3d.boundingInfo);
        });
    }
    /**
     * 运行加载资源任务
     */
    async _runLoadResTask() {
        let tasks = [
            {
                type: ResPool.RES_TYPE_TEXTURE,
                url: 'gltfviewer/texture/background1.jpg',
                weight: 0.1
            },
            {
                type: ResPool.RES_TYPE_TEXTURE,
                url: 'gltfviewer/texture/background2.jpg',
                weight: 0.1
            },
            {
                type: ResPool.RES_TYPE_TEXTURE,
                url: 'gltfviewer/texture/background3.jpg',
                weight: 0.1
            },
            {
                type: ResPool.RES_TYPE_CUBETEXTURE,
                url: 'gltfviewer/cubetexture/skybox1/',
                // url: 'gltfviewer/env/default.env',
                weight: 0.1
            },
            {
                type: ResPool.RES_TYPE_EQUIRECTANGULARCUBETEXTURE,
                url: 'gltfviewer/equirectangularcubetexture/skybox.png',
                weight: 0.1
            },
            {
                type: ResPool.RES_TYPE_MODEL,
                url: this.url,
                weight: 0.5
            }
        ];
        let totalPercent = 0;
        let onProgress = percent => this.trigger(Viewer.LOAD_PROGRESS, percent);
        for (let task of tasks) {
            await this.resPool.loadRes(task.type, task.url, percent => {
                let curentPercent = totalPercent + percent * task.weight * 100;
                onProgress(curentPercent);
            });
            totalPercent += task.weight * 100;
        }
    }
}
