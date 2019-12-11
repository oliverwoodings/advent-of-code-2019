(async () => {
  const program = await fetchProgram()
  const inputs = [2]
  const computer = createComputer(program, () => inputs.shift(), () => {}, () => console.log('DONE'))
  computer.compute()
})()

function createComputer (program, stdin, stdout, onExit) {
  let pointer = 0
  let relativeBase = 0

  return { compute }

  async function compute () {
      const pos1 = String(program[pointer])
      const opcode = Number(pos1.slice(-2))
      const modes = pos1.slice(0, -2).split('').map(Number).reverse()
      console.log('OP:', opcode, modes, pointer, program)

      switch (opcode) {
          case 1:
              write(3, read(1) + read(2))
              return goto(4)
          case 2:
              write(3, read(1) * read(2))
              return goto(4)
          case 3:
              const input = await stdin()
              if (input === undefined) {
                  throw new Error('Input should never be undefined')
              }
              console.log('INPUT:', input)
              write(1, input)
              return goto(2)
          case 4:
              const output = read(1)
              console.log('OUTPUT:', output)
              stdout(output)
              return goto(2)
          case 5:
              if (read(1) !== 0) {
                  return goto(read(2), true)
              }
              return goto(3)
          case 6:
              if (read(1) === 0) {
                  return goto(read(2), true)
              }
              return goto(3)
          case 7:
              write(3, read(1) < read(2) ? 1 : 0)
              return goto(4)
          case 8:
              write(3, read(1) === read(2) ? 1 : 0)
              return goto(4)
          case 9:
              relativeBase += read(1)
              return goto(2)
          case 99:
              return onExit(program)
          default:
              throw new Error(`Unexpected opcode: ${opcode} ${program}`)
      }

      function write (parameterIndex, value) {
          let address = program[pointer + parameterIndex]
          const mode = modes[parameterIndex - 1]
          if (mode === 2) {
              address = relativeBase + address
          }
          if (isNaN(value)) {
              throw new Error(`Cannot store non-int '${value}' at address ${address}`)
          }
          program[address] = value
      }

      function read (parameterIndex) {
          const parameter = program[pointer + parameterIndex]
          const mode = modes[parameterIndex - 1]
          if (mode === 1) return parameter || 0
          if (mode === 2) return program[relativeBase + parameter] || 0
          return program[parameter] || 0
      }

      function goto (nextPointer, absolute) {
          pointer = absolute ? nextPointer : pointer + nextPointer
          setTimeout(compute, 0)
      }
  }
}

async function fetchProgram () {
  const res = await fetch('https://adventofcode.com/2019/day/9/input')
  const raw = await res.text()
  return raw.trim().split(',').map(Number)
}
