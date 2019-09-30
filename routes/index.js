const Router = require('koa-router')

module.exports = ({ app, middleware }) => {
  const router = new Router({
    prefix: '/'
  })

  router.get('/', ctx => (ctx.body = 'responseText')) // responds to "/api"

  app.use(router.routes())
  app.use(router.allowedMethods())
}
