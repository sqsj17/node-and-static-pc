/**
 * 插件总线
 */

import EventBus from "libs/EventBus";

export default class PluginHub {
  constructor() {
    this.eventBus = new EventBus();
    this.subscribe = this.eventBus.subscribe;
    this.dispatch = this.eventBus.dispatch;
    this.unsubscribe = this.eventBus.unsubscribe;
  }
  /**
   * 加载插件
   * @param {String} pluginName 插件名称
   * @param {Object} options 初始化参数
   * @param {String} options.domId 指定插件要挂载在id为domid的dom节点
   */
  async load(pluginName, options) {
    let Plugin = null;
    if (typeof pluginName === "string") {
      switch (pluginName) {

        case "hz-demo":
          const LoginPlugin = await import("./plugin-demo");
          Plugin = LoginPlugin.default;
          break;
        default:
          console.warn("not support plugin: " + pluginName);
          return false;
      }
    }
    return new Plugin({ ...options, eventBus: this.eventBus });
  }
}
