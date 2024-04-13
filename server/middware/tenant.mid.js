const express = require("express");

/**
 * 租户中间件
 */
module.exports = (app) => {
  const tenantConfig = app.tenantConfig;
  // 不能使用static/路由，改用/static-tenant/路由。不然会导致render Maximum call stack size exceeded
  const keys = Object.keys(tenantConfig);
  for (let key of keys) {
    // 静态资源映射到本地
    app.use(
      `/static-tenant/${key}/static`,
      express.static(`tenant/${key}/static`)
    );
  }

  app.use((req, res, next) => {
    // 把app中的配置复制到req上
    req.tenantConfig = app.tenantConfig;
    let currentTenant = null;
    // 是否是移动端
    const keys = Object.keys(req.tenantConfig);
    for (let key of keys) {
        // 如果域名相同
      if (req.tenantConfig[key].pc.host === req.hostname) {
        currentTenant = req.tenantConfig[key];
        break;
      }
    }

    if (!currentTenant) {
      currentTenant = req.tenantConfig.default;
    }
    // 根据域名来加载租户配置
    req.tenant = currentTenant;
    req.cpsConfig = {};
    req.tenant.telephone = currentTenant.telephone;
    res.locals.tenant = req.tenant;
    res.locals.tenantName = req.tenant.name;
    res.locals.defaultTenant = req.defaultTenant;

    next();
  });
};
