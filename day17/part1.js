const fetchProgram = require('../common/fetchProgram')
const createComputer = require('../common/computer')

const rows = [[]]

run()

async function run () {
  const program = await fetchProgram(17)
  const computer = createComputer(program, stdin, stdout, done)
  computer.compute()
}

function stdin () {
  
}

function stdout (value) {
  if (value === 10) {
    rows.push([])
  } else {
    rows[rows.length - 1].push(value)
  }
}

function done () {
  print()

  let sum = 0

  for (let y = 1; y < rows.length - 1; y++) {
    for (let x = 1; x < rows[y].length - 1; x++) {
      if (rows[y][x] !== 35) continue
      const surroundingPoints = [
        rows[y - 1][x],
        rows[y + 1][x],
        rows[y][x - 1],
        rows[y][x + 1]
      ]
      const surroundingScaffold = surroundingPoints.filter(v => v === 35)
      if (surroundingScaffold.length > 2) {
        console.log('intersection', [x, y])
        sum += x * y
      }
    }
  }

  console.log('sum', sum)
}

function print () {
  for (const row of rows) {
    console.log(String.fromCharCode(...row))
  }
}
