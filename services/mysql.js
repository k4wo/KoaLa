const mysql = require('mysql2/promise')

class MySQL {
  constructor (config) {
    this.config = config
    this.db = null
  }

  async init () {
    this.db = await mysql.createPool(this.config)
  }

  async query (statement) {
    const [result] = await this.db.query(statement)
    return result
  }

  async execute (statement, ...data) {
    const [result] = await this.db.execute(statement, data)
    return result
  }
}

module.exports = MySQL
