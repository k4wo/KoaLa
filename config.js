module.exports = {
  app: {
    port: process.env.PORT || 3077
  },
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'my-db',
    nestTables: true
  },
}
