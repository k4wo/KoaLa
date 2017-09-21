const Koa = require('koa');
const winston = require('winston');

const getDirFiles = require('./lib/getDirFiles')();

const App = new Koa();

const start = async () => {
  winston.info('Booting...');

  try {
    winston.info('Loading routes...');
    const routes = await getDirFiles('../route');
    routes.forEach(route => require(route)(App));

    winston.info('Loading middlewares...');
    const middlewares = await getDirFiles('../middleware');
    middlewares.forEach(middleware => {
      const loadedMidlleware = require(middleware);
      const { name } = loadedMidlleware;

      if (name) {
        App.middleware[name] = loadedMidlleware;
      } else {
        winston.warn(`Middleware wasn't loaded due lact of name: ${middleware}`);
      }
    });

    winston.info('Server is reaady!')
  } catch (error) {
    winston.error(error);
  }
};

App.listen(3000, start);
