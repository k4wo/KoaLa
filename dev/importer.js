const importer = require('node-mysql-importer')
const prompts = require('prompts')
const path = require('path')

const MySQL = require('../services/mysql')
const foreignKeys = require('./foreign_keys')
const defaultConfig = require('../config').mysql

const dbConnection = async config => {
  const database = new MySQL(config)
  await database.init()

  return database
}

const dropDb = async config => {
  const conf = { ...config, database: undefined }
  const db = await dbConnection(conf)
  await db.query(`DROP DATABASE IF EXISTS ${config.database};`)

  db.db.end()
}

const createDB = async config => {
  const conf = { ...config, database: undefined }
  const db = await dbConnection(conf)

  await db.query(`CREATE DATABASE IF NOT EXISTS ${config.database};`)

  db.db.end()
}

const createTables = async config => {
  importer.config(config)
  await importer.importSQL(path.join(__dirname, 'mysql.sql'))

  const db = await dbConnection(config)

  return new Promise((resolve, reject) => {
  // because imported tables aren't seen yet
    setTimeout(async () => {
      for (let query of foreignKeys) {
        try {
          await db.query(query)
          console.log(query)
        } catch (error) {
          console.log('CAN NOT ALTER TABLE: ', query)
        }
      }

      db.db.end()
      resolve()

      process.env.NODE_ENV !== 'test' && process.exit(0)
    }, 1000)
  })
}

const importDbSchema = async (config = defaultConfig) => {
  const { dropDatabase } = await prompts({
    type: 'confirm',
    name: 'dropDatabase',
    message: `Do you want drop "${config.database}" database if exist?`
  })

  try {
    if (dropDatabase) {
      await dropDb(config)
    }
    await createDB(config)
    await createTables(config)
  } catch (error) {
    console.log('ERROR: ', error)
    process.exit(1)
  }
}

module.exports = {
  dropDb,
  createTables,
  createDB,
  importDbSchema
}
