const express = require("express");
const fs = require("fs");
const config = require("config");
const _beforeAppHandle = require("./middware/_beforeAppHandle.mid");
const app = express();

// redis缓存
const cache = require("./lib/cache.js");
cache.init(config.redis);

app.use(require("./middware/cache.mid"));

_beforeAppHandle(app, config);

// 路由
const tenantPathList = fs.readdirSync("./routes");
tenantPathList.forEach((file) => {
  console.info(file);
  const prefix = file.split(".")[0];
  // 如果是index 走index 重定向吧 groupName/routeName
  app.use(`/${prefix}`, require(`./routes/${prefix}.route`));
});


// 启动
app.listen(3000, (req, res) => {
  console.info("app start!");
});

// 404
app.use(function (req, res, next) {
  return res.renderTenant("_404");
});