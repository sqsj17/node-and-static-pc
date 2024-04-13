"use strict";
const config = require("config");
const redis = require("ioredis");
const { LRUCache } = require('lru-cache');

const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 5, // 5分钟
});

module.exports = {
  client: {},
  __prefix: "nodejs:",
  init: function (options) {
    if (options.prefix) this.__prefix = options.prefix;
    this.client = redis.createClient(options.port, options.host, options);
    this.client.on("error", function (err) {
      console.error("Error " + err);
    });
  },
  get: function (key, callback) {
    if (!key) return;
    this._get(this.__prefix + key, callback);
  },
  _get: function (key, callback) {
    if (!key) return;
    this.client.get(key, callback);
  },
  set: function (key, val, expire) {
    if (!key) return;
    if (typeof val === "object") val = JSON.stringify(val);
    this.client.set(this.__prefix + key, val);
    if (expire) this.client.expire(this.__prefix + key, expire);
  },
  _hset: function (key, field, val, expire) {
    if (!key) return;
    if (typeof val === "object") val = JSON.stringify(val);
    this.client.hset(key, field, val);
    if (expire) this.client.expire(key, expire);
  },
  _hget: function (key, field, callback) {
    if (!key) return;
    this.client.hget(key, field, callback);
  },
  getHtml(req, res) {
    if (config.env === "development") {
      return;
    }
    const key = req.hostname + req.originalUrl;
    console.info(`是否有缓存：${ssrCache.has(key)}`);
    if (ssrCache.has(key)) {
      res.setHeader("x-lru-cache", "HIT");
      res.send(ssrCache.get(key));
      console.info(`${key} 获取到缓存了~`);
      return true;
    } else {
      return false;
    }
  },
  setHtml(err, req, res, html) {
    if (!err) {
      const key = req.hostname + req.originalUrl;
      ssrCache.set(key, html);
      console.info(`${key} 设置缓存成功~`);
    }
    res.setHeader("x-lru-cache", "MISS");
    res.send(html);
  },
  getJSON(req, res) {
    const key = JSON.stringify(req.body);
    if (ssrCache.has(key)) {
      res.setHeader("x-lru-cache", "HIT");
      res.json(ssrCache.get(key));
      return true;
    } else {
      return false;
    }
  },
  setJSON(err, req, res, json) {
    if (!err) {
      const key = JSON.stringify(req.body);
      ssrCache.set(key, json);
    }
    res.setHeader("x-lru-cache", "MISS");
    res.json(json);
  },
};
