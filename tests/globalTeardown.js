const globalTeardown = () => {
  if (global.server) {
    global.server.stop()
  }
}

module.exports = globalTeardown
