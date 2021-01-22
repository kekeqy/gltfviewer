import { Viewer } from './Viewer';

/**
 * 预览组件
 */
export class ViewerComponent {
    /**
     * 实例化一个预览组件
     * @param {Viewer} viewer 预览
     */
    constructor(viewer) {
        /**
         * 预览
         */
        this.viewer = viewer;
    }
    /**
     * 销毁
     */
    destroy() { }
}