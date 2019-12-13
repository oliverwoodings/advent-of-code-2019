const createComputer = require('../common/computer')
const fetchProgram = require('../common/fetchProgram')

run()

async function run () {
  const program = await fetchProgram(13)

  const grid = []
  let buffer = []

  const stdout = (value) => {
    buffer.push(value)
    if (buffer.length === 3) {
      const [x, y, id] = buffer
      if (!grid[y]) {
        grid[y] = []
      }
      grid[y][x] = id
      buffer = []
    }
  }

  const done = () => {
    let count = 0
    for (const row of grid) {
      for (const tile of row) {
        if (tile === 2) {
          count++
        }
      }
    }
    console.log('DONE', count)
  }

  const computer = createComputer(program, () => {}, stdout, done)
  computer.compute()
}
