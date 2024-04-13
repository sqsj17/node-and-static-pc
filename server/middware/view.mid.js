/**
 * 设置模板引擎
 */
const nunjucks = require("nunjucks");
const path = require("path");

module.exports = (app, config) => {
  app.set("views", [
    path.join(__dirname, "../views"),
    path.join(__dirname, "../tenant")
  ]);
  app.set("view engine", "html");
  const viewEngine = nunjucks.configure(["views", "tenant"], {
    autoescape: true,
    express: app,
    watch: true,
    noCache: config.env === "development",
  });

  app.use((req, res, next) => {
    res.renderTenant = (path, options, callback) => {
      res.render(req.tenant.name + "/view/" + path, options, callback);
    };
    // 兼容老的模板，脚本里面的变量，心累
    res.locals.serverDomain = `//${req.hostname}`;
    next();
  });
  viewEngine.addFilter("abs", function (num) {
    return Math.abs(num);
  });
  viewEngine.addFilter("plutoPrice", function (str, count) {
    return (parseFloat(str) / 100).toFixed(count);
  });
  viewEngine.addFilter("price", function (str, count) {
    return parseFloat(str).toFixed(count);
  });

  viewEngine.addFilter("encryptInfo", function (str, type) {
    if (!str) return str;

    return (function (str, opts) {
      function takeAsterisk(len) {
        return Array.prototype.join.call({ length: len + 1 }, "*");
      }

      var result = "",
        len = str.length;
      var left = opts.left || 0,
        right = opts.right || 0;

      if (!str) return result;
      if (str.length <= left + right) return str;
      if (left + right === 0) return takeAsterisk(len);

      return (
        str.substr(0, left) +
        takeAsterisk(len - left - right) +
        str.substr(-right, right)
      );
    })(
      str,
      (function () {
        return type === "cName" || type === "eName" || type === "cardOwner"
          ? { left: 1 }
          : type === "cardNumber"
          ? { left: str.length <= 10 ? 0 : 2, right: 4 }
          : type === "email"
          ? { left: str.length <= 10 ? 0 : 3, right: 4 }
          : type === "moblie" || type === "payAccount"
          ? { left: 3, right: 4 }
          : type === "insureNum"
          ? { left: 2, right: 4 }
          : type === "date" || type === "birthdate"
          ? { left: 2, right: 2 }
          : type === "contactAddress"
          ? { left: 2, right: 4 }
          : { left: 100 };
      })()
    );
  });
};
