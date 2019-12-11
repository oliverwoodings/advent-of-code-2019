(async () => {
  const raw = await getInput()

  const orbits = raw.trim().split('\n').map(orbit => orbit.split(')'))

  const tree = ['COM', []]
  const nodes = {
      COM: tree[1]
  }

  let toProcess = orbits
  while (toProcess.length) {
      toProcess = toProcess.reduce((next, orbit) => {
          const [from, to] = orbit
          if (nodes[from]) {
              console.log(from, to)
              const branch = [to, []]
              nodes[from].push(branch)
              nodes[to] = branch[1]
           } else {
               next.push(orbit)
           }
           return next
      }, [])
  }

  let indirect = 0

  walk(tree, 0)

  console.log(orbits.length, indirect, orbits.length + indirect)

  function walk ([id, branches], depth) {
      indirect += Math.max(depth - 1, 0)
      for (branch of branches) {
          walk(branch, depth + 1)
      }
  }
})()

async function getInput () {
  const res = await fetch('https://adventofcode.com/2019/day/6/input')
  return res.text()
}
