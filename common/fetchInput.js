const axios = require('axios')
const config = require('config')

module.exports = async function fetchProgram (day) {
  const { data } = await axios.get(`https://adventofcode.com/2019/day/${day}/input`, {
    headers: {
      cookie: `session=${config.sessionCookie};`
    }
  })
  return data.trim()
}
