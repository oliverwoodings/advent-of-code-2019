const readline = require('readline')
const fs = require('fs')
const path = require('path')

const grid = []

const left = [5, 2]
const right = [5, 2]
write(left)
write(right)

let i = 0;
while (1) {
  left[0] += 2
  left[1]++
  write(left)
  if (i >= 99) {
    right[0] += 3
    right[1]++
    write(right)
    if (right[0] - 99 >= left[0]) {
      print([left[0], right[1]])
      break
    }
  } else {
    i++
  }
}

function write ([x, y]) {
  if (!grid[y]) {
    grid[y] = []
  }
  grid[y][x] = '#'
}


function print (point) {
  console.log('BOOM', point, point[0] * 10000 + point[1])
  let maxLineLength = 0
  let buffer = []
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y]
    let output = ''
    if (row) {
      maxLineLength = Math.max(maxLineLength, row.length)
      for (let x = 0; x < maxLineLength; x++) {
        const inRect = (point[0] <= x && x <= point[0] + 99 && point[1] <= y && y <= point[1] + 99)
        output += inRect ? '@' : row[x] || ' '
      }
    }
    buffer.push(output)
  }
  fs.writeFileSync(path.resolve(__dirname, 'output.txt'), buffer.join('\n'))
}
