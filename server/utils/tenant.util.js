const path = require("path");
const _ = require("lodash");
const { getDirectories } = require("./file.util");

/**
 * 读取所有商户配置
 */
exports.loadTenantConfig = (app, config) => {
  const tenantAppConfig = {};
  // 读取默认的配置
  const defaultConfig = require("../tenant/default/config");
  // 商户目录列表
  const tenantPathList = getDirectories(path.resolve(__dirname, "../tenant"));
  tenantPathList.forEach((pathOftenant) => {
    try {
      let tenantConfig = require(path.resolve(pathOftenant, "./config.js"));
      if (!tenantConfig.name) {
        console.error("load tenant config faild: " + pathOftenant);
        throw new Error("load tenant config faild: " + pathOftenant);
      }
      if (tenantConfig.name !== "default") {
        // 合并默认的配置
        tenantConfig = _.extend({}, defaultConfig, tenantConfig);
      }
      tenantConfig.path = pathOftenant;
      const tenantPathGroup = pathOftenant.split("/");
      const tenantConfigName = tenantPathGroup[tenantPathGroup.length - 1];
      tenantAppConfig[tenantConfigName] = tenantConfig;
    } catch (e) {
      console.error("load tenant config faild: " + pathOftenant);
      throw new Error(e);
    }
  });
  // log.info("load tenant config:");
  console.info(tenantAppConfig);
  app.tenantConfig = tenantAppConfig;
};
