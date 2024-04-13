const express = require("express");
const router = express.Router();
const cache = require("../lib/cache.js");

router.use(/^\/[0-9a-zA-Z]+\/product\/index(\/)?$/, function (req, res, next) {
  if (!req.query.cuid && cache.getHtml(req, res)) {
    return;
  }
  return next();
});

module.exports = router;
