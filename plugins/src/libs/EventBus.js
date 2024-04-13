/**
 * 事件
 * https://stackoverflow.com/questions/22186467/how-to-use-javascript-eventtarget/24414106
 * Usage:
 * class Example extends Emitter {}
 * var e = new Example()
 * e.addEventListener('something', payload => console.log(payload))
 * e.dispatchEvent('eventName', payload)
 * 通过将事件监听器添加到一个父元素上，然后利用事件冒泡机制来捕获子元素的事件。这种方式可以减少事件监听器的数量，提高性能，并且对于动态添加的子元素也能够生效。
 *
 */
export default class EventBus {
  constructor(domId) {
    // 父级元素
    const eventTarget = document.createDocumentFragment();

    /**
     * 从事件总线订阅事件
     * @param {String} eventName 事件名称
     * @param {Function} listener 监听函数
     * @param {*} useCapture
     * @param {*} wantsUntrusted
     */
    function subscribe(eventName, listener, useCapture, wantsUntrusted) {
      return eventTarget.addEventListener(
        eventName,
        event => listener(event.detail),
        useCapture,
        wantsUntrusted
      );
    }

    /**
     * 派发事件到事件总线
     * @param {String} eventName 事件名称
     * @param {Object} payload 携带参数
     */
    function dispatch(eventName, payload) {
      const event = new CustomEvent(eventName, { detail: payload });
      return eventTarget.dispatchEvent(event);
    }

    /**
     * 取消订阅事件
     * @param {String} eventName 事件名称
     * @param {Function} listener 监听函数
     * @param {*} useCapture
     */
    function unsubscribe(eventName, listener, useCapture) {
      return eventTarget.removeEventListener(eventName, listener, useCapture);
    }

    this.subscribe = subscribe;
    this.dispatch = dispatch;
    this.unsubscribe = unsubscribe;
  }
}
