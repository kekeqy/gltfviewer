import { Viewer } from './Viewer';
import { ViewerComponent } from './ViewerComponent';
import '@babylonjs/loaders/glTF/2.0/index';
import { to } from './to';
import { AssetContainer } from '@babylonjs/core/assetContainer';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { EquiRectangularCubeTexture } from '@babylonjs/core/Materials/Textures/equiRectangularCubeTexture';

/**
 * 资源池
 */
export class ResPool extends ViewerComponent {
    /**
     * 资源类型 - 模型
     */
    static RES_TYPE_MODEL = 'model';
    /**
     * 资源类型 - 贴图
     */
    static RES_TYPE_TEXTURE = 'texture';
    /**
     * 资源类型 - 立方体贴图（含预制件）
     */
    static RES_TYPE_CUBETEXTURE = 'cubetexture';
    /**
     * 资源类型 - 等矩形立方体纹理
     */
    static RES_TYPE_EQUIRECTANGULARCUBETEXTURE = 'equirectangularcubetexture';
    /**
     * 实例化一个资源池对象
     * @param {Viewer} viewer 预览
     */
    constructor(viewer) {
        super(viewer);
        /**
         * 缓存
         * @type {Map<string,{type:string,success:boolean,data:any}>}
         */
        this._cache = new Map();
    }
    destroy() {
        for (let key of Array.from(this._cache.keys())) {
            let item = this._cache.get(key);
            if (item.data && item.data.disponse) {
                item.data.disponse();
            }
            this._cache.delete(key);
        }
        this._cache = null;
        this.viewer = null;
    }
    /**
     * 加载资源
     * @param {string} type 资源类型
     * @param {string} url 资源地址
     * @param {(percent)=>void} onProgress 进度事件
     */
    async loadRes(type, url, onProgress = undefined) {
        if (this._cache.has(url)) {
            return;
        }
        let err, data;
        switch (type) {
            case ResPool.RES_TYPE_TEXTURE:
                [err, data] = await this._loadTexture(url);
                break;
            case ResPool.RES_TYPE_CUBETEXTURE:
                [err, data] = await this._loadCubeTexture(url);
                break;
            case ResPool.RES_TYPE_EQUIRECTANGULARCUBETEXTURE:
                [err, data] = await this._loadEquiRectangularCubeTexture(url);
                break;
            case ResPool.RES_TYPE_MODEL:
                [err, data] = await this._loadModel(url, onProgress);
                break;
            default:
                err = '不支持的资源类型';
                break;
        }
        this._cache.set(url, {
            type: type,
            err: err,
            data: data
        });
        if (err) {
            console.log(`资源 type=${type},url=${url} 加载失败，错误原因：${err}`);
        }
        if (onProgress) {
            onProgress(1);
        }
    }
    async _loadTexture(url) {
        return to(new Promise((resolve, reject) => {
            let texture = new Texture(url, undefined, undefined, undefined, undefined, () => resolve(texture), err => reject(err));
        }));
    }
    async _loadCubeTexture(url) {
        return to(new Promise((resolve, reject) => {
            let texture = new CubeTexture(url, undefined, undefined, undefined, undefined, () => resolve(texture), err => reject(err));
        }));
    }
    async _loadEquiRectangularCubeTexture(url) {
        return to(new Promise((resolve, reject) => {
            let texture = new EquiRectangularCubeTexture(url, this.viewer.renderEngine.scene, 128, true, true, () => resolve(texture), err => reject(err));
        }));
    }
    async _loadModel(url, onProgress) {
        let index = url.lastIndexOf('/') + 1;
        return to(SceneLoader.LoadAssetContainerAsync(url.substr(0, index), url.substr(index), undefined, ev => {
            if (onProgress) {
                if (ev.lengthComputable) {
                    let percent = ev.loaded / ev.total;
                    this.viewer.objectInfo.fileSize = `${parseFloat((ev.loaded / 1024 / 1024).toFixed(2))}MB`;
                    onProgress(percent);
                }
            }
        }));
    }
    /**
     * 获取资源对象
     * @param {string} url 资源地址
     * @param {boolean} clone 是否克隆
     */
    getRes(url, clone = false) {
        let res = this._cache.get(url);
        if (!res || res.err) {
            return;
        }
        if (res.data instanceof AssetContainer) {
            let entity = res.data.instantiateModelsToScene(name => name, false);
            let materials = [];
            entity.rootNodes[0].getChildMeshes().forEach(item => {
                try {
                    if (item.material) {
                        if (materials.includes(item.material)) {
                            item.material = item.material.clone(item.material.name);
                        }
                        else {
                            materials.push(item.material);
                        }
                    }
                }
                catch { }
            });
            materials.splice(0);
            return entity;
        }
        if (clone) {
            return res.data.clone();
        }
        return res.data;
    }
}