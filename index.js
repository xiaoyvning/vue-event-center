/**
 * @file vue 2.0实现，类似vue 1.0的事件功能
 * 扩展vue对象$trigger方法, 触发eventHub中的事件
 * 组件的监听事件写在events里面
 *
 * @author fanxingguang@baidu.com
 * 2017-03-15
 */
import Vue from 'vue';

let hub = new Vue({});

/**
 * 处理Event，绑定或者解绑
 *
 * @param  {Object}  vm [Vue实例对象]
 * @param  {Boolean} isOn   [是否绑定]
 */

function handleEvent(isOn) {
    if (!this.$options.events) {
        return;
    }

    let events = this.$options._events;
    let action = isOn ? '$on' : '$off';

    for (let name of Object.keys(events)) {
        hub[action](name, events[name]);
    }
}
// 全局注册一个混合，所有Vue对象在初始化的时候检测$options中的events
// 然后created(创建)时在eventHub中注册事件，在组件beforeDestroy(注销前)解绑事件
Vue.mixin({
    created() {
        if (!this.$options.events) {
            return;
        }

        let events = this.$options.events;
        this.$options._events = {};
        for (let name of Object.keys(events)) {
            this.$options._events[name] = events[name].bind(this);
        }

        handleEvent.call(this, true);
    },
    beforeDestroy() {
        handleEvent.call(this, false);
    }
});

/**
 * Vue全局触发事件
 *
 * @param {...*} args [参数列表]
 */
Vue.prototype.$trigger = function (...args) {
    hub.$emit.apply(hub, args);
};
