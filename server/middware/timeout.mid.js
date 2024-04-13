function haltOnTimedout(req, res, next) {
    if (!req.timedout) {
      next();
    } else {
      const err = new Error("请求超时，请稍后再试！");
      err.status = 500;
      next(err);
    }
  }
  
  module.exports = (app, config) => {
    app.use(haltOnTimedout);
  };
  