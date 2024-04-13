"use strict";

const config = {
  env: "development",
  port: process.env.PORT || 3000,
};

config.redis = {
  name: "mymaster",
  password: "a5791E2a3043T",
  db: 0,
  sentinels: [
    { host: "dubhe-redis-1.xha.com", port: 26379 },
    { host: "dubhe-redis-2.xha.com", port: 26379 },
    { host: "dubhe-redis-3.xha.com", port: 26379 }
  ]
};

config.expressSession = {
  key: "nodejs_sid",
  secret: "-:D",
  resave: false,
  saveUninitialized: true,
  cookie: {}
};

config.log4js = {
  appenders: {
    console: { type: "console" }
  },
  categories: { default: { appenders: ["console"], level: "debug" } },
  pm2: true,
  disableClustering: true
};

module.exports = config;
