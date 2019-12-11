const createComputer = require('../common/computer')
const fetchProgram = require('../common/fetchProgram')

module.exports = { run }

async function run (painted) {
  const position = [0, 0]
  let direction = 0
  let outputs = 0

  const program = await fetchProgram(11)

  return new Promise((resolve) => {
    const computer = createComputer(program, stdin, stdout, resolve)
    computer.compute()
  })

  function stdin () {
    return painted.get(key()) || 0
  }

  function stdout (value) {
    if (outputs === 0) {
        painted.set(key(), value)
        outputs++
    } else {
        direction += value ? 1 : -1
        if (direction === -1) direction = 3
        else if (direction === 4) direction = 0
  
        if (direction === 0) position[1]--
        else if (direction === 1) position[0]++
        else if (direction === 2) position[1]++
        else if (direction === 3) position[0]--
        outputs = 0
    }
  }

  function key () {
    return `${position[0]},${position[1]}`
  }
}
