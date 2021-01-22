import { newGuid8 } from './guid';

/**
 * 事件调度器
 */
export class EventDispatcher {
    /**
     * 实例化一个事件调度器对象
     */
    constructor() {
        /**
         * 事件字典集合
         * @type {Map<string,{id:string,callback:Function,once:boolean,data:*,pause:boolean}[]}
         */
        this._eventMap = new Map();
    }
    /**
     * 监听事件
     * @param {string} type 事件类型
     * @param {Function} callback 回调函数
     * @param {boolean} once 是否执行一次
     * @param {*} data 自定义事件数据
     * @returns {string} 事件唯一编号
     */
    on(type, callback, once = false, data = undefined) {
        let list = this._eventMap.get(type);
        if (!list) {
            list = [];
            this._eventMap.set(type, list);
        }

        let e = {
            id: newGuid8(),
            callback: callback,
            once: once,
            data: data,
            pause: false
        };
        list.push(e);
        return e.id;
    }
    /**
     * 监听事件一次
     * @param {string} type 事件类型
     * @param {Function} callback 回调函数
     * @param {*} data 自定义事件数据
     */
    once(type, callback, data = undefined) {
        return this.on(type, callback, true, data);
    }
    /**
     * 触发指定类型的事件
     * @param {string} type 事件类型
     * @param {*} data 自定义事件数据
     */
    trigger(type, data = undefined) {
        let list = this._eventMap.get(type);
        if (!list) return;
        for (let i = list.length - 1; i >= 0; i--) {
            let e = list[i];
            if (!e.callback || e.pause) continue;
            let ev = {
                target: this,
                data: typeof data !== undefined ? data : e.data
            };
            try {
                e.callback(ev);
            }
            catch (err) {
                console.error(err);
            }
        }
    }
    /**
     * 移除指定编号的事件
     * @param {string} id 事件唯一编号
     */
    off(id) {
        for (let list of this._eventMap.values()) {
            let index = list.findIndex(e => e.id === id);
            if (index !== -1) {
                let e = list[index];
                list.splice(index, 1);
                clear(e);
            }
        }
    }
    /**
     * 移除指定类型的事件
     * @param {string} type 事件类型
     */
    offType(type) {
        let list = this._eventMap.get(type);
        this._eventMap.delete(type);
        if (list) {
            let e;
            while (e = list.pop()) {
                clear(e);
            }
        }
    }
    /**
     * 移除所有事件
     */
    offAll() {
        let keys = Array.from(this._eventMap.keys());
        let type, list, e;
        while (type = keys.pop()) {
            list = this._eventMap.get(type);
            this._eventMap.delete(type);
            if (list) {
                while (e = list.pop()) {
                    clear(e);
                }
            }
        }
    }
    /**
     * 暂停事件响应
     * @param  {...any} ids 事件唯一编号列表
     */
    pause(...ids) {
        setPause(this._eventMap, true, ids);
    }
    /**
     * 恢复事件响应
     * @param  {...any} ids 事件唯一编号列表
     */
    resume(...ids) {
        setPause(this._eventMap, false, ids);
    }
}
function setPause(map, state, ...ids) {
    for (let list of map.values()) {
        for (let e of list) {
            if (ids.indexOf(e.id) > -1) {
                e.pause = state;
            }
        }
    }
}
function clear(obj) {
    let keys = Object.keys(obj);
    for (let key of keys) {
        delete obj[key];
    }
}