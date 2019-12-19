const fetchInput = require('../common/fetchInput')

const MOVEMENTS = [
  p(0, 1),
  p(1, 0),
  p(0, -1),
  p(-1, 0)
]

run()

async function run () {
  const map = await getMap()
  const start = findStart(map)
  const tree = createTree(map, start)

  let minSteps = Infinity
  visit([tree], tree, Object.keys(tree.keys))
  console.log(minSteps)

  function visit (visited, source, keysToFind, foundKeys = [], steps = 0) {
    const options = keysToFind.map((key) => findCommonAncestor(tree.keys[key], source, foundKeys)).filter(Boolean)

    if (minSteps === 136) {
      console.log('LOTS OF OPTIONS', keysToFind, foundKeys, steps, options.length, visited.length)
      // return
    }
    for (const option of options) {
      const nextSteps = steps + option.steps
      if (nextSteps >= minSteps) continue

      const foundKey = option.target.value
      const nextToFind = keysToFind.filter((key) => key !== foundKey)
      if (nextToFind.length === 0) {
        minSteps = nextSteps
        console.log('DONE', minSteps)
        continue
      }
      visit([...visited, source], option.target, nextToFind, [...foundKeys, foundKey], nextSteps)
    }
  }
}

function findCommonAncestor (target, source, foundKeys) {
  const ancestors = new Map()
  let node = target
  let steps = 0
  while (1) {
    steps += node.length
    node = node.parent
    if (!node) break
    if (node.type === 'DOOR' && !foundKeys.includes(node.value.toLowerCase())) return
    ancestors.set(node, steps)
  }

  node = source
  steps = 0
  while (node) {
    if (ancestors.has(node)) {
      return {
        target,
        source,
        common: node,
        steps: ancestors.get(node) + steps
      }
    }
    steps += node.length
    node = node.parent
  }
}

function createTree (map, start) {
  const root = {
    pos: start,
    length: 0,
    type: getType('.'),
    value: '.',
    parent: null,
    children: [],
    keys: {}
  }

  getSurroundings(map, start).forEach((pos) => {
    root.children.push(branch(root, pos))
  })

  return root

  function branch (parent, pos) {
    let steps = 1
    let curPos = pos
    let prevPos = parent.pos
    while (1) {
      const curValue = map[curPos.y][curPos.x]
      const surroundings = getSurroundings(map, curPos, prevPos, start)

      if (surroundings.length === 1 && curValue === '.') {
        prevPos = curPos
        curPos = surroundings[0]
        steps++
        continue
      }

      const node = {
        pos: curPos,
        length: steps,
        type: getType(curValue),
        value: curValue,
        parent: parent,
        children: []
      }
      if (node.type === 'KEY') {
        root.keys[curValue] = node
      }
      surroundings.forEach(pos => {
        node.children.push(branch(node, pos))
      })
      return node
    }
  }
}

function getSurroundings (map, curPos, previousPos, start) {
  const surroundings = []
  for (const movement of MOVEMENTS) {
    const pos = p(curPos.x + movement.x, curPos.y + movement.y)
    const value = map[pos.y][pos.x]
    if (value !== '#' && !eq(pos, previousPos) && !eq(pos, start)) {
      surroundings.push(pos)
    }
  }
  return surroundings
}

function findStart (map) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === '@') {
        return p(x, y)
      }
    }
  }
}


async function getMap () {
  // const raw = await fetchInput(18)
  const raw = `#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################`
  return raw.split('\n').map((row) => row.split(''))
}

function eq (a, b) {
  if (!a || !b) return false
  return a.x === b.x && a.y === b.y
}

function p (x, y) {
  return { x, y }
}

function getType (value) {
  if (value === '.') return 'SPACE'
  if (value.toLowerCase() === value) {
    return 'KEY'
  }
  return 'DOOR'
}
