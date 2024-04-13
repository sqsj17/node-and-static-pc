import PluginContext from "./PluginContext";
import React from "react";
import ReactDOM from "react-dom";

export default class PluginBase {
  constructor(Plugin, options) {
    const { domId, pluginId } = options;
    options.domId = domId || pluginId;
    this.rootElement = document.getElementById(options.domId);
    if (!this.rootElement) {
      throw new Error(
        "init " +
          this.constructor.name +
          " faild, can not found dom by id: " +
          options.domId
      );
    }
    ReactDOM.render(
      <PluginContext.Provider value={options}>
        <Plugin />
      </PluginContext.Provider>,
      this.rootElement
    );
  }
}

// provider 两种消费方式 MyContext.Consumer 或者 useContext 钩子来访问该值。