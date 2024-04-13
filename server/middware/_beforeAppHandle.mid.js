/**
 * 前置中间件
 */
const express = require("express");
// const compress = require("compression");
const bodyParser = require("body-parser");
const minifyHTML = require("express-minify-html");
// const multer = require("multer");
// const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const path = require("path");
const viewMiddleware = require("./view.mid");
const timeoutMiddleware = require("./timeout.mid.js");
const { loadTenantConfig } = require("../utils/tenant.util");
const Service = require("../lib/service.lib");

module.exports = (app, config) => {
  // 加载商户配置到配置对象中
  loadTenantConfig(app, config);
  // 加载模板引擎
  viewMiddleware(app, config);

  // 压缩
  // app.use(compress());
  app.use(bodyParser.json({ limit: "1mb" }));
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: "1mb",
      parameterLimit: 1000000,
    })
  );

  // 压缩html文件
  app.use(
    minifyHTML({
      override: false,
      exception_url: false,
      htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true,
      },
    })
  );

  // multipart/form-data
  // app.use(multer());
  // app.use(cookieParser());

  // 静态目录
  app.use(express.static(path.join(__dirname, "../public")));
  app.use(express.static(path.join(__dirname, "../../static")));

  // favicon.icon
  app.use(favicon(__dirname + "/../../public/favicon.ico"));

  timeoutMiddleware(app, config);

  // require("./userAgent.mid")(app, config);
  require("./tenant.mid")(app, config);
  // require("./deTongRedirect.mid")(app);
  // require("./hzdtLoginByToken.mid")(app);

  app.use((req, res, next) => {
    const serviceOptions = {};
    if (req.headers.cookie) {
      serviceOptions.headers = {
        cookie: req.headers.cookie,
        "X-Real-IP":
          req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || "",
      };
    }

    req.Service = new Service(`https://${req.hostname}`, serviceOptions);
    next();
  });
};
