const fetchProgram = require('../common/fetchProgram')
const createComputer = require('../common/computer')

let pulled = 0
const inputBuffer = []
const output = [[]]

for (let x = 0; x < 150; x++) {
  for (let y = 0; y < 150; y++) {
    inputBuffer.push([x, y])
  }
}

run()

async function run () {
  const program = await fetchProgram(19)

  await Promise.all(inputBuffer.map((input) => {
    const coords = [...input]
    return new Promise((resolve) => {
      const computer = createComputer([...program], () => input.shift(), stdout, resolve)
      computer.compute()
    })

    function stdout (value) {
      pulled += value
      if (!output[coords[1]]) {
        output[coords[1]] = []
      }
      output[coords[1]][coords[0]] = value ? '#' : '.'
    }
  }))

  for (const row of output) {
    console.log(row.join(''))
  }
  console.log('Pulled:', pulled)
}
