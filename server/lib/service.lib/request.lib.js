const axios = require("axios").default;

const requestInterceptor = (config) => {
  config.params = config.params || {};
  if (config.method.toUpperCase() === "GET") {
    config.params = {
      ...config.params,
      ...config.data,
    };
  }
  config.params.md = Math.random();
  // 日志模块 客户端与APM冲突
  if (process.env.NODE_ENV === "development") {
    console.info(`request [${config.method}] ${config.baseURL}${config.url}`);
  }

  return config;
};

const requestInterceptorError = (error) => {
  console.error(error.toString());
  return Promise.reject(error);
};

const responseInterceptor = (response) => {
  if (process.env.NODE_CONFIG_ENV !== "production") {
    console.debug(
      `response [${response.config.method} ${response.config.url}]`,
      typeof response.data !== "object"
        ? response.data
        : JSON.stringify(response.data)
    );
  }
  if (!response.data || (response.data && !response.data.success)) {
    console.warn(
      `request ${response.config.url} faild: ${JSON.stringify(response.data)}`
    );
  }
  if (typeof response.data !== "object") {
    return {
      success: false,
      msg: "ERROR_EMPTY_BODY",
    };
  }
  if (!response.data.success && typeof response.data.msg !== "string") {
    return {
      ...response.data,
      success: false,
      msg: "ERROR_UNKNOWN_REASON",
    };
  }
  return response.data;
};

const responseInterceptorError = (error) => {
  if (error.request) {
    console.warn(`request ${error.request.path} faild: ${error.toString()}`);
    // log.warn(`request ${error.request.path} faild: ${error.toString()}`);
  } else {
    console.error(error);
    // log.error(error);
  }
  if (
    error.message.includes("timeout") ||
    error.message.includes("Network Error")
  ) {
    return {
      success: false,
      msg: "ERROR_REQUEST_TIMEOUT",
    };
  }
  return {
    success: false,
    msg: "ERROR_REQUEST_FAILD",
  };
};

// 主站的返回
const responseInterceptorForHuize = (response) => {
  // 登录接口直接返回字符串作为响应内容，我也很无奈呀
  if (response.status === 200 && typeof response.data === "string") {
    return {
      success: true,
      data: response.data,
      code: null,
    };
  }
  // 其他接口判断是不是Object
  if (response.data && response.data.status) {
    if (
      response.data.status === "00000" &&
      typeof response.data.result !== "undefined"
    ) {
      return {
        success: true,
        data: response.data.result,
        code: Number(response.data.status),
      };
    }
  }

  console.warn(
    `request ${response.config.url} faild: ${JSON.stringify(response.data)}`
  );

  return {
    success: false,
    data: response.data.result,
    code: Number(response.data.status),
    msg: response.data.message || response.data.exception,
  };
};

const emptyFunction = () => {};

module.exports = class Request {
  constructor({
    apiStyle = "default",
    requestHandle,
    requestErrorHandle,
    responseHandle,
    responseErrorHandle,
    headers,
  }) {
    const instance = axios.create({
      timeout: 90000,
      withCredentials: true,
      headers: { "content-type": "application/json;charset=utf-8", ...headers },
      // 覆盖掉外面的全局axios配置
      baseURL: "",
    });
    instance.interceptors.request.use(
      requestInterceptor,
      requestInterceptorError
    );
    if (
      typeof requestHandle === "function" ||
      typeof requestErrorHandle === "function"
    ) {
      instance.interceptors.request.use(
        requestHandle || emptyFunction,
        requestErrorHandle || emptyFunction
      );
    }
    instance.interceptors.response.use(
      responseInterceptor,
      responseInterceptorError
    );
    if (
      typeof responseHandle === "function" ||
      typeof responseErrorHandle === "function"
    ) {
      instance.interceptors.response.use(
        responseHandle || emptyFunction,
        responseErrorHandle || emptyFunction
      );
    }
    return instance;
  }
};
