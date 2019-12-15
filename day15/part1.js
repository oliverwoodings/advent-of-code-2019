const readline = require('readline')
const createComputer = require('../common/computer')
const fetchProgram = require('../common/fetchProgram')

run()

const COMMANDS = {
  N: {
    code: 1,
    move: ([x, y]) => ([x, y + 1]),
    next: 'W',
  },
  E: {
    code: 4,
    move: ([x, y]) => ([x + 1, y]),
    next: 'N'
  },
  S: {
    code: 2,
    move: ([x, y]) => ([x, y - 1]),
    next: 'E'
  },
  W: {
    code: 3,
    move: ([x, y]) => ([x - 1, y]),
    next: 'S'
  }
}

const grid = new Map()
let pos = [0, 0]
let prevPos = null
let command = COMMANDS.N
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
  grid.get(y).set(x, value)
  min[0] = Math.min(min[0], x)
  min[1] = Math.min(min[1], y)
  max[0] = Math.max(max[0], x)
  max[1] = Math.max(max[1], y)
}

function get ([x, y]) {
  if (grid.has(y)) {
    return grid.get(y).get(x)
  }
}

async function stdin () {
  return new Promise((resolve) => {
    setTimeout(() => resolve(command.code), 1)
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
  } else {
    set(nextPos, 'T')
    console.log('FOUND TARGET:', nextPos)
    print()
    findShortestPath(nextPos)
    process.exit(0)
  }
  print()
}

function move () {
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

function print () {
  clear()
  for (let y = max[1]; y >= min[1]; y--) {
    let row = ''
    for (let x = min[0]; x <= max[0]; x++) {
      if (x === 0 && y === 0) {
        row += 'S'
      }
      if (x === pos[0] && y === pos[1]) {
        row += 'D'
      } else {
        row += grid.get(y).get(x) || ' '
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

function findShortestPath (target) {
  const visited = new Set()
  visited.add('0,0')

  const queue = [[0, 0, 0]]
  while (queue.length) {
    const [x, y, dist] = queue.shift()

    for (const command of Object.values(COMMANDS)) {
      const nextPos = command.move([x, y])
      const key = `${nextPos[0]},${nextPos[1]}`
      if (get(nextPos) === 'T') {
        console.log('DISTANCE:', dist + 1)
        return
      }
      if (!visited.has(key) && get(nextPos) === '.') {
        visited.add(key)
        queue.push([...nextPos, dist + 1])
      }
    }
  }
}
