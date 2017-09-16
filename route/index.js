var Router = require('koa-router');

module.exports = (app) => {
  var router = new Router({
    prefix: '/api'
  });

  router.get('/', ctx => ctx.body = 'api'); // responds to "/api"


  app.use(router.routes());
  app.use(router.allowedMethods());
};