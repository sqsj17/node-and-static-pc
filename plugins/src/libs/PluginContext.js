import React, { createContext } from "react";
const PluginContext = createContext({
  domId: null,
  eventBus: null
});
PluginContext.displayName = "PluginContext";

const isValidEvent = (eventName, pluginId) => {
  if (
    typeof eventName === "string" &&
    (/^global:/.test(eventName) ||
      new RegExp("^" + pluginId + ":").test(eventName))
  ) {
    return true;
  }
  return false;
};

export default PluginContext;

export const connect = WrappedComponent => {
  return props => (
    <PluginContext.Consumer>
      {options => {
        const { eventBus, ...resOptions } = options;
        // 把eventBus中的事件直接暴露到props中，剩下的配置选项直接赋值给options
        const subscribe = (eventName, listener, useCapture, wantsUntrusted) => {
          if (isValidEvent(eventName, resOptions.pluginId)) {
            return eventBus.subscribe(
              eventName,
              listener,
              useCapture,
              wantsUntrusted
            );
          }
          console.warn(`subscribe event: ${eventName} faild!`);
        };
        const dispatch = (eventName, payload) => {
          if (isValidEvent(eventName, resOptions.pluginId)) {
            return eventBus.dispatch(eventName, payload);
          }
          console.warn(`dispatch event: ${eventName} faild!`);
        };
        const unsubscribe = (eventName, listener, useCapture) => {
          if (isValidEvent(eventName, resOptions.pluginId)) {
            return eventBus.unsubscribe(eventName, listener, useCapture);
          }
          console.warn(`unsubscribe event: ${eventName} faild!`);
        };
        return (
          <WrappedComponent
            {...props}
            subscribe={subscribe}
            dispatch={dispatch}
            unsubscribe={unsubscribe}
            options={resOptions}
          />
        );
      }}
    </PluginContext.Consumer>
  );
};
