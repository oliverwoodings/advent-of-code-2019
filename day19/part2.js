const fs = require('fs')
const path = require('path')
const fetchProgram = require('../common/fetchProgram')
const createComputer = require('../common/computer')

run()

async function run () {
  const program = await fetchProgram(19)

  const rows = []

  let xRange = [5, 5]
  let y = 2
  while (1) {
    const xRangeNext = []
    let x = xRange[0]
    while (1) {
      const output = await getOutput(program, [x, y])
      if (output && !xRangeNext.length) {
        xRangeNext.push(x)
        if (xRange[1] > x) {
          x = xRange[1]
        }
      } else if (!output && xRangeNext.length) {
        xRangeNext.push(x - 1)
        rows[y] = xRangeNext
        xRange = xRangeNext
        checkFit()
        break
      }
      x++
    }
    y++
  }

  function checkFit () {
    const row = rows[y - 99]
    if (!row) return
    if (row[1] - 100 >= rows[y][0]) {
      const point = [row[1] - 100 - 2, y - 99 - 1]
      print(rows, point)
      console.log('BOOM', point, row, point[0] * 10000 + point[1])
      process.exit(0)
    }
  }
}

async function getOutput (program, input) {
  return new Promise((resolve) => {
    let output = null
    const computer = createComputer(
      [...program],
      () => input.shift(),
      (value) => { output = value },
      () => resolve(output)
    )
    computer.compute()
  })
}

function write ([x, y]) {
  if (!grid[y]) {
    grid[y] = []
  }
  grid[y][x] = '#'
}

function print (rows, point) {
  let maxLineLength = 0
  let buffer = []
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y]
    let output = ''
    if (row) {
      maxLineLength = Math.max(maxLineLength, row[1])
      for (let x = 0; x <= maxLineLength; x++) {
        const inRect = (point[0] <= x && x <= point[0] + 99 && point[1] <= y && y <= point[1] + 99)
        output += x < row[0] ? ' ' : (inRect ? '@' : '#')
      }
    }
    buffer.push(output)
  }
  fs.writeFileSync(path.resolve(__dirname, 'output.txt'), buffer.join('\n'))
}
