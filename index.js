const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const Koa = require('koa');
const winston = require('winston');

const App = new Koa();

const start = async () => {
  winston.info('Booting...');
  
  try {
    const readdir = promisify(fs.readdir);
    const routesDir = path.resolve(__dirname, 'routes');
    const fileRoutes = await readdir(routesDir);
    fileRoutes.forEach(file => require(`${routesDir}/${file}`)(App));

    winston.info('Routes has been set');
  } catch (error) {
    winston.error(error);
  }
};

App.listen(3000, start);