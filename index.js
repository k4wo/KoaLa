const Koa = require('koa');
const winston = require('winston');

const getDirFiles = require('./lib/getDirFiles');

const App = new Koa();

const start = async () => {
  winston.info('Booting...');

  try {
    winston.info('Loading routes...');
    const routes = await getDirFiles('route');
    routes.forEach(route => require(route)(App));

    window.info('Server is reaady!')
  } catch (error) {
    winston.error(error);
  }
};

App.listen(3000, start);