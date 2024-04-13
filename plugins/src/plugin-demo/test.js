import PluginHub from "PluginHub";
const hub = new PluginHub();
hub
  .load("huize-demo", {
    title: "自动标题"
  })
  .then(commentPlugin => {
    hub.subscribe("huize-demo:ON_SUBMIT", payload => {
      console.log(payload);
      document.getElementById("out-side-text").innerHTML =
        "收到内部消息：" + payload.commentTxt;
      console.log(payload);
    });
    document.getElementById("out-side-button").addEventListener("click", () => {
      hub.dispatch("global:HELLO", "HELLO, Huize");
    });
  });
