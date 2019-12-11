(async () => {
  const raw = await getInput()

  const orbits = raw.trim().split('\n').map(orbit => orbit.split(')'))

  const tree = ['COM', []]
  const nodes = {
      COM: [tree[1], null]
  }

  let toProcess = orbits
  while (toProcess.length) {
      toProcess = toProcess.reduce((next, orbit) => {
          const [from, to] = orbit
          if (nodes[from]) {
              const branch = [to, []]
              nodes[from][0].push(branch)
              nodes[to] = [branch[1], from]
           } else {
               next.push(orbit)
           }
           return next
      }, [])
  }

  const ancestors = {}
  walk(nodes.YOU, (parent, steps) => {
      ancestors[parent] = steps
  })
  walk(nodes.SAN, (parent, steps) => {
      if (ancestors[parent]) {
          console.log('common', parent, steps, steps + ancestors[parent])
          return true
      }
  })

  function walk ([, parent], cb, steps = 0) {
      if (parent) {
          if (!cb(parent, steps)) {
              walk(nodes[parent], cb, steps + 1)
          }
      }
  }
})()

async function getInput () {
  const res = await fetch('https://adventofcode.com/2019/day/6/input')
  return res.text()
}
