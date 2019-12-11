(async () => {
  const origin = { x: 31, y: 20 }
  const grid = await fetchGrid()
  const asteroids = grid
      .reduce((memo, row, y) => {
          memo.push(...row.map((v, x) => v === '#' ? { x, y } : null).filter(Boolean))
          return memo
      }, [])
      .filter(a => a.x !== origin.x || a.y !== origin.y)

  asteroids.forEach(a => {
      a.distanceFromOrigin = hyp(a, origin)
  })

  const grouped = sortBy(groupAsteroids(asteroids, origin).map((stack) => ({ stack, angle: computeAngle(origin, stack[0]) })), 'angle')

  const rotationsRequired = Math.max(...grouped.map(group => group.stack.length))
  let i = 1
  for (let rotations = 0; rotations < rotationsRequired; rotations++) {
      for (const group of grouped) {
          const asteroid = group.stack[rotations]
          if (i === 200) {
              console.log('GOT IT', asteroid, asteroid.x * 100 + asteroid.y)
              return
          }
          i++
      }
  }
})()

function computeAngle (origin, asteroid) {
  const c = origin
  const p0 = { ...origin, y: 0 }
  const p1 = asteroid

  const p0c = Math.sqrt(Math.pow(c.x - p0.x, 2) + Math.pow(c.y - p0.y, 2))
  const p1c = Math.sqrt(Math.pow(c.x - p1.x, 2) + Math.pow(c.y - p1.y, 2))
  const p0p1 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2))
  const angle = Math.acos((p1c * p1c + p0c * p0c - p0p1 * p0p1) / (2 * p1c * p0c))
  const deg = angle * (180 / Math.PI)
  return asteroid.x >= origin.x ? deg : 360 - deg
}

function groupAsteroids (asteroids, origin) {
  const grouped = []
  for (const asteroid of asteroids) {
      const gradientOrigin = (asteroid.y - origin.y) / (asteroid.x - origin.x)
      const behind = []
      let blocked = false
      for (const test of asteroids) {
          if (test === asteroid) continue
          const testOrigin = (test.y - origin.y) / (test.x - origin.x)
          const isSameGradient = gradientOrigin === testOrigin
          const isTestCloser = asteroid.distanceFromOrigin > test.distanceFromOrigin
          if (isSameGradient) {
              if (isTestCloser && hyp(asteroid, test) < asteroid.distanceFromOrigin) {
                  blocked = true
                  break
              } else if (!isTestCloser && hyp(asteroid, test) < test.distanceFromOrigin) {
                  behind.push(test)
              }
          }
      }
      if (!blocked) {
          grouped.push(sortBy([asteroid, ...behind], 'distanceFromOrigin'))
      }
  }
  return grouped
}

function hyp (a, b) {
  return Math.sqrt(Math.pow(Math.abs(a.x - b.x), 2) + Math.pow(Math.abs(a.y - b.y), 2))
}

function sortBy (arr, key) {
  return arr.sort((a, b) => a[key] === b[key] ? 0 : a[key] - b[key])
}


async function fetchGrid () {
  const res = await fetch('https://adventofcode.com/2019/day/10/input')
  const raw = await res.text()
  return raw.trim().split('\n').map(r => r.split(''))
}
