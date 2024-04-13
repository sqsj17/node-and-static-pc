import "./style.scss";

import {
  GLOBAL_HELLO,
  ON_PLUGIN_MOUNT,
  ON_PLUGIN_MOUNT_FAILD,
  ON_PLUGIN_MOUNT_SUCCESS,
  ON_SUBMIT
} from "../../event.const";

import React from "react";
import { connect } from "libs/PluginContext";
import { get } from "libs/request";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
class DemoPlguin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentTxt: "",
      loading: true
    };
  }
  onChangeComment = e => {
    this.setState({
      commentTxt: e.target.value
    });
  };
  onClickSubmit = e => {
    console.log(ON_SUBMIT, this.state);
    this.props.dispatch(ON_SUBMIT, this.state);
  };
  async componentDidMount() {
    const { dispatch, subscribe, options } = this.props;
    subscribe(GLOBAL_HELLO, payload => {
      console.log(payload);
      alert("组件" + options.pluginId + "收到消息：" + payload);
    });
    console.group(`组件${options.pluginId}初始化`);
    dispatch(ON_PLUGIN_MOUNT);
    console.log("初始化开始");
    await sleep(3000);
    const result = await get(
      "https://ptapi.qixin18.com/cps/open/apiInfo?aid=&isTest=false&partnerId=1000301"
    );
    console.log("fetch result", result);
    if (result.data.success) {
      dispatch(ON_PLUGIN_MOUNT_SUCCESS);
      console.log("初始化成功");
    } else {
      dispatch(ON_PLUGIN_MOUNT_FAILD);
      console.log("初始化失败");
    }
    console.groupEnd();
    this.setState({
      result: result.data,
      loading: false
    });
  }
  render() {
    return (
      <div>
        <input onChange={this.onChangeComment} />
        <button onClick={this.onClickSubmit}>提交评论</button>
        <p>收到外部消息：{this.state.outsideText}</p>
        {this.state.loading ? (
          "加载中"
        ) : (
          <p>收到fetch请求结果: {JSON.stringify(this.state.result)}</p>
        )}
      </div>
    );
  }
}

export default connect(DemoPlguin);
