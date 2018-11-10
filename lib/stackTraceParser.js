const tinyStackTraceParser = (error, dir = 5) => {
  if (!(error instanceof Error) || typeof error.stack !== 'string') {
    return error
  }

  const dirCount = dir < 0 ? dir : dir * -1
  const [message, ...stack] = error.stack.split('\n')
  const parsedStack = stack.map(s => {
    const [msg, path] = s.split(' (')
    const [fullPath] = path.split(')')
    const parsedPath = fullPath.split('/').slice(dirCount).join('/')
    const [file, line] = parsedPath.split(':')

    return [
      ` \x1b[36m${msg.trim()}`,
      `   \x1b[90m${file} \x1b[36mL:${line}`
    ].join('\n')
  }).join('\n')

  return `\x1b[31m${message.trim()}\n${parsedStack}`
}

module.exports = tinyStackTraceParser
