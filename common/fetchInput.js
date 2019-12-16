const axios = require('axios')
const config = require('config')
const fs = require('fs-extra')
const path = require('path')

const CACHE_DIR = path.resolve(__dirname, '../.cache')

module.exports = async function fetchProgram (day) {
  const fromCache = await getFromCache(day)
  if (fromCache) return fromCache.trim()

  const { data } = await axios.get(`https://adventofcode.com/2019/day/${day}/input`, {
    headers: {
      cookie: `session=${config.sessionCookie};`
    },
    transformResponse: (res) => res
  })
  await writeToCache(day, data)
  return data.trim()
}

async function getFromCache (day) {
  try {
    return await fs.readFile(dayPath(day), 'utf8')
  } catch (e) {
    return null
  }
}

async function writeToCache(day, data) {
  await fs.mkdirp(CACHE_DIR)
  await fs.writeFile(dayPath(day), data)
}

function dayPath (day) {
  return path.join(CACHE_DIR, `day-${day}.txt`)
}
