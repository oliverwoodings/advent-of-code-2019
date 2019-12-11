(async () => {
  const input = await getInput()
  const [path1, path2] = input
      .trim()
      .split('\n')
      .map(p => p.trim().split(',').map(parseDirection))

  const grid = {}
  
  walk(path1, 'a')
  walk(path2, 'b')

  const distances = Object
      .entries(grid)
      .filter(([k, v]) => v.a && v.b)
      .map(([k]) => k.split(',').map(Number).map(Math.abs))
      .map(([x, y]) => x + y)
      .filter(Boolean)
  console.log(Math.min(...distances))

  function walk (path, name) {
      let loc = [0, 0]
      for (const [direction, distance] of path) {
          for (let i = 0; i < distance; i++) {
              switch (direction) {
                  case 'R':
                      loc[0]++
                      break
                  case 'L':
                      loc[0]--
                      break
                  case 'U':
                      loc[1]++
                      break
                  case 'D':
                      loc[1]--
                      break
              }
              const key = loc[0] + ',' + loc[1]
              grid[key] = grid[key] || {}
              grid[key][name] = true
          }
      }
  }
})()

function parseDirection (str) {
   return [str.slice(0, 1), Number(str.slice(1))]
}

async function getInput () {
   const res = await fetch('https://adventofcode.com/2019/day/3/input')
   return res.text()
}
