(async () => {
  const grid = await fetchGrid()
  const asteroids = grid.reduce((memo, row, y) => {
      memo.push(...row.map((v, x) => v === '#' ? { x, y } : null).filter(Boolean))
      return memo
  }, [])

  const max = asteroids.reduce((max, origin) => {
      const count = countVisibleAsteroids(asteroids, origin)
      if (!max || count > max[1]) return [origin, count]
      return max
  }, null)
  console.log(max)
})()

function countVisibleAsteroids (asteroids, origin) {
  return asteroids.filter((asteroid) => {
      if (asteroid === origin) return false
      const gradientOrigin = (asteroid.y - origin.y) / (asteroid.x - origin.x)
      return asteroids.every((test) => {
          if (test === asteroid || test === origin) return true
          const testOrigin = (test.y - origin.y) / (test.x - origin.x)
          const isSameGradient = gradientOrigin === testOrigin
          const isTestCloser = hyp(origin, asteroid) > hyp(origin, test)
          const isTestBetween = hyp(asteroid, test) < hyp(origin, asteroid)
          if (isSameGradient && isTestCloser && isTestBetween) {
              return false
          }
          return true
      })
  }).length
}

function hyp (a, b) {
  return Math.sqrt(Math.abs(a.x - b.x) + Math.abs(a.y - b.y))
}


async function fetchGrid () {
  const res = await fetch('https://adventofcode.com/2019/day/10/input')
  const raw = await res.text()
  return raw.trim().split('\n').map(r => r.split(''))
}
