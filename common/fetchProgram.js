const fetchInput = require('./fetchInput')

module.exports = async function fetchProgram (day) {
  const input = await fetchInput(day)
  return input.split(',').map(Number)
}
