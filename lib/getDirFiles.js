const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)
const fsStat = promisify(fs.stat)

/**
 * Iterate over supplied directory and return absolute path to files.
 * Includes files from nested directories as well.
 *
 * @param {string} dir name or relative path to directory
 * @returns {array} absolute path to files
 */
const getDirFiles = async (dir, list = []) => {
  const pathToDir = path.resolve(__dirname, dir)

  try {
    const files = await readdir(pathToDir)

    for (const file of files) {
      const filePath = path.join(pathToDir, file)
      const fileStat = await fsStat(filePath)
      if (fileStat.isDirectory()) {
        getDirFiles(filePath, list)
      } else {
        list.push(filePath)
      }
    }
  } catch (e) {
    console.error(e)
  }

  return list
}

module.exports = () => getDirFiles
