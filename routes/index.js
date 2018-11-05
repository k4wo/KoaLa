var Router = require('koa-router')

module.exports = ({ app, middleware }) => {
  var router = new Router({
    prefix: '/'
  })

  router.get('/', ctx => (ctx.body = 'responseText')) // responds to "/api"

  app.use(router.routes())
  app.use(router.allowedMethods())
}
