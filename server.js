const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const getDirFiles = require('./lib/getDirFiles')()
const stackTraceParser = require('./lib/stackTraceParser')
const services = require('./services')()


class Server {
  constructor (config) {
    this.config = config
    this.services = {}
    this.server = null

    this.__START_DATE__ = new Date()
    this.__IS_DEV__ = process.env.NODE_ENV !== 'production'
  }

  setupApp () {
    this.app = new Koa()
    this.app.use(bodyParser())

    this.app.on('error', err => this.handleError(err))
  }

  async init () {
    console.log('Booting...')
    console.log(
      '  • Started at %s %s',
      this.__START_DATE__.toLocaleDateString(),
      this.__START_DATE__.toLocaleTimeString()
    )
    console.log('  • Mode (NODE_ENV): %s', process.env.NODE_ENV)
    console.log('  • Node version: %s', process.version)
    console.log('  • Platform: %s %s', process.platform, process.arch)

    try {
      this.setupApp()
      await this.loadServices()
      await this.loadRoutes()

      await this.start(this.config.app.port)
    } catch (error) {
      this.handleError(error)
    }

    return this.server
  }

  async loadRoutes () {
    console.log('Loading routes...')

    try {
      const routes = await getDirFiles('../routes')
      routes.forEach(route => require(route)(this))
    } catch (error) {
      console.error(error)
      this.handleError(error)
    }
  }

  async loadServices () {
    console.log('Loading services...')

    this.services = await services(this)
    // make it accessible from routes
    this.app.context.services = this.services
  }

  async start (port = 3001) {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(
        port,
        () => {
          console.log()
          console.log('Server is running: ')
          console.log('  • port: %s', port)
          resolve()
        })
    })
  }

  async stop () {
    this.server.close()
  }

  handleError (err) {
    if (this.__IS_DEV__) {
      console.log(stackTraceParser(err))

      return err
    }

    // TODO: store somewhere production's errors
    return this.services.errorParser(err)
  }
}

module.exports = Server
