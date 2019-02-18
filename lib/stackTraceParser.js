const tinyStackTraceParser = (error, dir = 5) => {
  if (!(error instanceof Error)) {
    return error
  }

  const err = error.originalError || error
  if (typeof err.stack !== 'string') {
    return error
  }

  const dirCount = dir < 0 ? dir : dir * -1
  const [message, ...stack] = err.stack.split('\n')
  const parsedStack = stack.map(s => {
    const [msg, path] = s.split(' (')
    const fullPath = path
      ? path.split(')')[0]
      : msg
    const parsedPath = fullPath.split('/').slice(dirCount).join('/')
    const [file, line] = parsedPath.split(':')

    return [
      ` \x1b[36m${!path ? 'N/A' : msg.trim()}`,
      `   \x1b[90m${file} \x1b[36mL:${line}`
    ].join('\n')
  }).join('\n')

  return `\x1b[31m${message.trim()}\n${parsedStack}\x1b[0m\n`
}

module.exports = tinyStackTraceParser
