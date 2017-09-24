const koa = require('koa');
const winston = require('winston');

const getDirFiles = require('./lib/getDirFiles')();

class KoaLa {

  constructor() {
    this.logInfo = winston.info;
    this.logError = winston.error;

    this.app = new koa();
    this.app.context.logInfo = this.logInfo;
    this.app.context.logError = this.logError;

    this.middleware = {};
    this.server = {};
  }

  async init() {
    this.logInfo('Booting...');

    await this.loadMiddlewares();
    await this.loadServices();
    await this.loadRoutes();
    await this.start();
  }

  async loadRoutes() {
    this.logInfo('Loading routes...');

    try {
      const routes = await getDirFiles('../route');
      routes.forEach(route => require(route)(this));
    } catch (error) {
      this.logError(error);
    }
  }

  async loadMiddlewares() {
    this.logInfo('Loading middlewares...');
    await this.loadAndAssign('../middleware', this.middleware);
  }

  async loadServices() {
    this.logInfo('Loading services...');
    await this.loadAndAssign('../service', this.app.context);
  }

  async loadAndAssign(path, assignTo) {
    try {
      const services = await getDirFiles(path);
      services.forEach((service) => {
        const loadedService = require(service);
        const { name } = loadedService;

        if (name) {
          assignTo[name] = loadedService;
        } else {
          this.logError(`Wasn't loaded due lack of name: ${service}`);
        }
      });
    } catch (error) {
      this.logError(error);
    }
  }

  async start(port = 6666, host = '127.0.0.1') {
    this.server = this.app.listen(port, host, () => this.logInfo(`Server is running on ${port}`));
  }

  async stop() {
    this.server.close();
  }
}

module.exports = KoaLa;
