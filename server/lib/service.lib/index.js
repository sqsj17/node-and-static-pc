const Request = require("./request.lib");
const ServiceSpecsMap = new Map();
const isServer = typeof window === "undefined";

if (isServer) {
  // 扫描文件夹下的所有定义文件
  require("fs")
    .readdirSync("./lib/service.lib")
    .forEach(file => {
      if (file.endsWith(".spec.js")) {
        const specName = file.split(".spec.js")[0];
        try {
          const specObj = require("./" + specName + ".spec.js");
          const keysOfSpec = Object.keys(specObj);
          if (keysOfSpec.length === 0) {
            throw new Error("spec file not found any api definition");
          }
          // 缓存到map中
          ServiceSpecsMap.set(specName, specObj);
        } catch (e) {
          console.warn(`load spec ${file} faild.`);
        }
      }
    });
} else {
  // 使用Webpack require.context 动态引入所有符合后缀的服务描述文件
  const ServicesSpecModules = require.context("./", true, /\.spec\.js$/);
  ServicesSpecModules.keys().forEach(key => {
    // 名字转key
    const specName = key.replace("./", "").replace(".spec.js", "");
    ServiceSpecsMap.set(specName, ServicesSpecModules(key));
  });
}

const errorHandle = (result, spec) => {
  if (!isServer && typeof result === "object" && !result.success) {
    // 和租户的登录态失效
    if (result.code === 301401999) {
      if (__TENANT_NAME === "huize") {
        // 目前只支持主站
        const hzLogin = require("./hzLogin.lib").default;
        hzLogin(__MERCHANT_ID).then(isLoginSuccess => {
          if (isLoginSuccess) {
            window.location.reload();
          }
        });
      } else if (__TENANT_NAME === "cps") {
        requirejs(["cLogin"], function (cLogin) {
          layer && layer.closeAll();
          cLogin.showLoginModal();
        })
      } else {
        console.log(`TODO，暂不支持自动登录`);
      }
      return;
    }
    // 提示弹窗
    if (
      result.code !== 1 &&
      result.code !== 2 
    ) {
      let ErrorMsg =
        result.msg || `response.data:${JSON.stringify(result.data)}`;
      if (!spec.ignoreAlert) {
        // Toast.fail(`[内部错误]${ErrorMsg}`, 2);
        // layer.msg(`[内部错误]${ErrorMsg}`);
      }
    }
  }
};

const responseHandleFactory = spec => response => {
  if (typeof response === "object") {
    if (response.success) {
      return response;
    }
    switch (response.msg) {
      case "ERROR_EMPTY_BODY":
        response.msg = `[返回数据为空]`;
        break;
      case "ERROR_UNKNOWN_REASON":
        response.msg = `[未知错误]`;
        break;
      case "ERROR_REQUEST_TIMEOUT":
        response.msg = `[请求超时]`;
        break;
      case "ERROR_REQUEST_FAILD":
        response.msg = `[请求失败]`;
        break;
      default:
    }
  }
  // TODO 这里不做await，是因为堵塞了，会导致外面的loading一直在转，但是这里有需要弹出登录框，交互有冲突
  errorHandle(response, spec);
  return response;
};

function requestWithSpec(spec, data, options = {}) {
  if (typeof spec.server === "string") {
    options.baseURL = spec.server;
  }
  let apiStyle = spec.apiStyle;
  const responseHandle = responseHandleFactory(spec);
  const request = new Request({
    responseHandle: responseHandle,
    responseErrorHandle: responseHandle,
    apiStyle,
    headers: options.headers,
  });
  return request({
    method: spec.method,
    url: spec.url,
    data: data,
    ...options
  });
}

// 并行发起请求
const parallel = async requestList => {
  if (Array.isArray(requestList) === false) {
    throw new Error("service parallel must accept Array as params.");
  }
  return await Promise.all(requestList);
};

class Service {
  constructor(requestUrl, serverOptions = {}) {
    this.requestUrl = requestUrl || null;
    let ServiceInstance = {
      parallel
    };

    ServiceSpecsMap.forEach((value, key) => {
      const ServiceRequest = {};
      const ServiceSpecInstance = value;
      Object.keys(ServiceSpecInstance).forEach(requestName => {
        ServiceRequest[requestName] = (data, options = {}) => {
          const RequestSpec = ServiceSpecInstance[requestName];
          const serverHeaders = serverOptions.headers || {};
          options.baseURL = requestUrl;
          if (options.headers) {
            options.headers = { ...serverHeaders, ...options.headers };
          } else {
            options.headers = serverHeaders;
          }
          return requestWithSpec(RequestSpec, data, options);
        };
      });

      ServiceInstance[key] = ServiceRequest;
    });
    return ServiceInstance;
  }
}

module.exports = Service;
