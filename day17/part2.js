const fetchProgram = require('../common/fetchProgram')
const createComputer = require('../common/computer')

// always go right
const DIRECTIONS = new Map([
  [94, { next: 62, move: [0, -1] }], // north
  [60, { next: 94, move: [-1, 0] }], // west
  [118, { next: 60, move: [0, 1] }], // south
  [62, { next: 118, move: [1, 0] }] // east
])
const MOVEMENTS = ['A', 'B', 'C']
const NEWLINE = 10
const SCAFFOLD = 35

let rows = [[]]
let inputBuffer
const robot = {
  direction: null,
  location: null
}

run()

async function run () {
  const program = await fetchProgram(17)
  program[0] = 2

  const computer = createComputer(program, stdin, stdout, () => console.log('DONE'))
  computer.compute()
}

function stdin () {
  print()
  if (!inputBuffer) {
    computeInputBuffer()
  }
  rows = [[]]
  return inputBuffer.shift().charCodeAt(0)
}

function stdout (value) {
  if (value > 1000) {
    console.log('DUST:', value)
  } else if (value === NEWLINE) {
    rows.push([])
  } else {
    if (DIRECTIONS.has(value)) {
      robot.direction = value
      robot.location = [rows[rows.length - 1].length, rows.length - 1]
    }
    rows[rows.length - 1].push(value)
  }
}

function computeInputBuffer () {
  inputBuffer = []
  const movementSequence = computeMovementSequence()
  const compressed = compressMovementSequence(movementSequence)

  compressed.main.forEach((movement, i) => {
    if (i !== 0) inputBuffer.push(',')
    inputBuffer.push(MOVEMENTS[movement])
  })
  compressed.fns.forEach((fn) => {
    inputBuffer.push('\n')
    fn.forEach((part, i) => {
      if (i !== 0) inputBuffer.push(',')
      inputBuffer.push(part)
    })
  })
  inputBuffer.push('\n', 'n', '\n')
  console.log(inputBuffer.join(''))
  inputBuffer = inputBuffer.join('').split('')
}

function compressMovementSequence (sequence) {
  sequence = sequence.join(',') + ','
  let parts = [sequence]
  const chunks = []
  for (let i = 0; i < 3; i++) {
    const toSplit = parts[0]
    let chunk = toSplit
    while (chunk.length > 1) {
      let instances = 0
      for (const part of parts) {
        instances += part.split(chunk).length - 1
      }
      if (instances > 1) {
        chunks.push(chunk)
        const newParts = []
        for (const part of parts) {
          newParts.push(...part.split(chunk))
        }
        parts = newParts.filter(Boolean)
        break
      }
      chunk = chunk.split(',').slice(0, -3).join(',') + ','
    }
  }

  return {
    main: chunks.reduce((memo, chunk, i) => memo.replace(new RegExp(chunk, 'g'), i), sequence).split('').map(Number),
    fns: chunks.map(chunk => chunk.split(',').filter(Boolean).map(v => isNaN(v) ? v : Number(v)))
  }
}

function computeMovementSequence () {
  const sequence = []
  while (1) {
    let direction = robot.direction
    for (let i = 0; i <= 4; i++) {
      if (i === 4) {
        return sequence
      }

      direction = DIRECTIONS.get(direction).next
      const { move } = DIRECTIONS.get(direction)
      const valueInDirection = rows[robot.location[1] + move[1]][robot.location[0] + move[0]]
      if (valueInDirection === SCAFFOLD && (i === 0 || i === 2)) {
        sequence.push(i === 0 ? 'R' : 'L')
        robot.direction = direction

        let moves = 0
        while (1) {
          const newLocation = [robot.location[0] + move[0], robot.location[1] + move[1]]
          if (newLocation[0] < 0 || newLocation[1] < 0) break
          const valueInDirection = rows[newLocation[1]][newLocation[0]]
          if (valueInDirection !== SCAFFOLD) break
          robot.location = newLocation
          moves++
        }
        sequence.push(moves)
        break
      }
    }
  }
}

function print () {
  for (const row of rows) {
    if (row.length) {
      console.log(String.fromCharCode(...row))
    }
  }
}
