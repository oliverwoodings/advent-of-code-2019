const readline = require('readline')
const createComputer = require('../common/computer')
const fetchProgram = require('../common/fetchProgram')

const IDS = {
  PADDLE: 3,
  BALL: 4
}

run()

async function run () {
  const program = await fetchProgram(13)

  program[0] = 2

  const grid = []
  let buffer = []
  let joystick = 0
  let score = 0
  let ball
  let paddle

  const stdout = (value) => {
    buffer.push(value)
    if (buffer.length === 3) {
      const [x, y, id] = buffer
      if (x === -1 && y === 0) {
        score = id
      } else {
        if (!grid[y]) {
          grid[y] = []
        }
        grid[y][x] = id
        if (id === IDS.BALL) {
          ball = [x, y]
          if (paddle && paddle[0] < x) {
            joystick = 1
          } else if (paddle && paddle[0] > x) {
            joystick = -1
          }
        } else if (id === IDS.PADDLE) {
          paddle = [x, y]
        }
      }
      buffer = []
    }
  }

  const stdin = async () => {
    output()
    const toReturn = joystick
    if (joystick !== 0) {
      joystick = 0
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(toReturn), 2)
    })
  }

  const output = () => {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    for (const row of grid) {
      console.log(row.join(''))
    }
    console.log('SCORE:', score)
  }

  const done = () => {
    output()
    console.log('FINISHED')
  }

  const computer = createComputer(program, stdin, stdout, done)
  computer.compute()
}
