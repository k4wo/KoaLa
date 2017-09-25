const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const winston = require('winston');

const getDirFiles = require('./lib/getDirFiles')();

class KoaLa {

  constructor() {
    this.logInfo = winston.info;
    this.logError = winston.error;

    this.setUpApp();

    this.middleware = {};
    this.server = {};
  }

  setUpApp() {
    this.app = new koa();
    this.app.use(bodyParser());

    this.app.context.logInfo = this.logInfo;
    this.app.context.logError = this.logError;
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
      const filesList = await getDirFiles(path);
      filesList.forEach((file) => {
        const loadedModule = require(file);
        const { name } = loadedModule;

        if (name) {
          assignTo[name] = loadedModule;
        } else {
          this.logError(`Module wasn't loaded due lack of name: ${file}`);
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
