const { run } = require('./common')

const painted = new Map()
painted.set('0,0', 1)

run(painted).then(() => {
  const grid = []
  for (const [coords, colour] of painted.entries()) {
    const [x, y] = coords.split(',').map(Number)
    if (!grid[y]) {
      grid[y] = []
    }
    if (colour === 1) {
      grid[y][x] = '#'
    }
  }
  for (const row of grid) {
    let str = ''
    for (let i = 0; i < row.length; i++) {
      str += row[i] || ' '
    }
    console.log(str)
  }
})
