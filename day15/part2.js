const readline = require('readline')
const createComputer = require('../common/computer')
const fetchProgram = require('../common/fetchProgram')

run()

const COMMANDS = {
  N: {
    code: 1,
    move: ([x, y]) => ([x, y + 1]),
    next: 'W',
    opposite: 'S'
  },
  E: {
    code: 4,
    move: ([x, y]) => ([x + 1, y]),
    next: 'N',
    opposite: 'W'
  },
  S: {
    code: 2,
    move: ([x, y]) => ([x, y - 1]),
    next: 'E',
    opposite: 'N'
  },
  W: {
    code: 3,
    move: ([x, y]) => ([x - 1, y]),
    next: 'S',
    opposite: 'E'
  }
}

const grid = new Map()
const unvisited = []
let pos = [0, 0]
let prevPos = null
let command = COMMANDS.N
let system = null
let queue = null
let targetUnvisited = null
const min = [0, 0]
const max = [0, 0]

set(pos, '.')

async function run () {
  const program = await fetchProgram(15)
  const computer = createComputer(program, stdin, stdout, () => console.log('EXITED'))
  computer.compute()
}

function set ([x, y], value) {
  if (!grid.has(y)) {
    grid.set(y, new Map())
  }
  const existingValue = grid.get(y).get(x)
  if (existingValue && existingValue !== value) {
    throw new Error('COLLISION', [x, y])
  }
  grid.get(y).set(x, value)

  min[0] = Math.min(min[0], x)
  min[1] = Math.min(min[1], y)
  max[0] = Math.max(max[0], x)
  max[1] = Math.max(max[1], y)

  const unvisitedIndex = unvisited.indexOf(`${x},${y}`)
  if (unvisitedIndex > -1) {
    unvisited.splice(unvisitedIndex, 1)
  }

  if (value !== '#') {
    for (const command of Object.values(COMMANDS)) {
      const nextPos = command.move([x, y])
      const key = nextPos.join(',')
      if (!get(nextPos) && !unvisited.includes(nextPos)) {
        unvisited.push(key)
      }
    }
  }
}

function get ([x, y]) {
  if (grid.has(y)) {
    return grid.get(y).get(x)
  }
}

async function stdin () {
  return new Promise((resolve) => {
    setTimeout(() => resolve(command.code), 0)
  })
}

function stdout (value) {
  const nextPos = command.move(pos)
  if (value === 0) {
    set(nextPos, '#')
    move()
  } else if (value === 1) {
    set(nextPos, '.')
    prevPos = pos
    pos = nextPos
    move()
  } else if (value === 2) {
    set(nextPos, '.')
    pos = nextPos
    if (!system) {
      console.log('FOUND TARGET:', nextPos)
      system = nextPos
      gotoUnvisited()
    }
  }
  print()
}

function gotoUnvisited () {
  const target = unvisited.shift().split(',').map(Number)
  targetUnvisited = target
  queue = findShortestPath(pos, target)
  stepTo(queue.shift())
}

function stepTo (direction) {
  command = COMMANDS[direction]
}

function move () {
  if (queue) {
    if (queue.length) {
      stepTo(queue.shift())
    } else if (unvisited.length) {
      gotoUnvisited()
    } else {
      console.log('ALL DISCOVERED')
      findOxygenFillTime()
      process.exit(0)
    }
    return
  }

  let toCheck = COMMANDS[command.next]
  let open = []
  for (let i = 0; i < 4; i++) {
    const state = get(toCheck.move(pos))
    if (!state) {
      command = toCheck
      return
    } else if (state === '.') {
      open.push(toCheck)
    }
    toCheck = COMMANDS[toCheck.next]
  }

  if (open.length === 1) {
    command = open[0]
  } else {
    command = open.find((cmd) => {
      const nextPos = cmd.move(pos)
      return nextPos[0] !== prevPos[0] || nextPos[1] !== prevPos[1]
    })
  }
}

function findOxygenFillTime () {
  let maxLength = 0
  for (let y = max[1]; y >= min[1]; y--) {
    for (let x = min[0]; x <= max[0]; x++) {
      if (get([x, y]) === '.') {
        const path = findShortestPath(system, [x, y])
        maxLength = Math.max(maxLength, path.length)
      }
    }
  }
  console.log('MAX', maxLength)
}

function print () {
  clear()
  for (let y = max[1]; y >= min[1]; y--) {
    let row = ''
    for (let x = min[0]; x <= max[0]; x++) {
      if (x === pos[0] && y === pos[1]) {
        row += '●'
      } else if (x === 0 && y === 0) {
        row += 'S'
      } else if (system && x === system[0] && y === system[1]) {
        row += 'T'
      } else if (unvisited.includes(`${x},${y}`)) {
        row += '░'
      }  else {
        row += (grid.get(y).get(x) || ' ')
          .replace('#', '▓')
          .replace('.', '·')
      }
    }
    console.log(row)
  }
}

function clear () {
  const blank = '\n'.repeat(process.stdout.rows)
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
}

function findShortestPath (origin, target) {
  const visited = new Set()
  visited.add(origin.join(','))

  const queue = [[origin[0], origin[1], []]]
  while (queue.length) {
    const [x, y, path] = queue.shift()

    for (const [name, command] of Object.entries(COMMANDS)) {
      const nextPos = command.move([x, y])
      const nextPath = [...path, name]
      const key = nextPos.join(',')
      if (nextPos[0] === target[0] && nextPos[1] === target[1]) {
        return nextPath
      }
      if (!visited.has(key) && get(nextPos) === '.') {
        visited.add(key)
        queue.push([...nextPos, nextPath])
      }
    }
  }
}
