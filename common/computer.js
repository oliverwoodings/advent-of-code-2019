const config = require('config')

module.exports = function createComputer (program, stdin, stdout, onExit) {
  let pointer = 0
  let relativeBase = 0

  return { compute }

  async function compute () {
    while (1) {
      const pos1 = String(program[pointer])
      const opcode = Number(pos1.slice(-2))
      const modes = pos1.slice(0, -2).split('').map(Number).reverse()
      debug('OP:', opcode, modes, pointer)

      switch (opcode) {
        case 1:
          write(3, read(1) + read(2))
          goto(4)
          continue
        case 2:
          write(3, read(1) * read(2))
          goto(4)
          continue
        case 3:
          const input = await stdin()
          if (input === undefined) {
              throw new Error('Input should never be undefined')
          }
          debug('INPUT:', input)
          write(1, input)
          goto(2)
          continue
        case 4:
          const output = read(1)
          debug('OUTPUT:', output)
          stdout(output)
          goto(2)
          continue
        case 5:
          if (read(1) !== 0) {
            goto(read(2), true)
          } else {
            goto(3)
          }
          continue
        case 6:
          if (read(1) === 0) {
            goto(read(2), true)
          } else {
            goto(3)
          }
          continue
        case 7:
          write(3, read(1) < read(2) ? 1 : 0)
          goto(4)
          continue
        case 8:
          write(3, read(1) === read(2) ? 1 : 0)
          goto(4)
          continue
        case 9:
          relativeBase += read(1)
          goto(2)
          continue
        case 99:
          return onExit(program)
        default:
          throw new Error(`Unexpected opcode: ${opcode} ${program}`)
      }

      function goto (nextPointer, absolute) {
        pointer = absolute ? nextPointer : pointer + nextPointer
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
    }
  }
}

function debug (...args) {
  if (config.debug) {
    console.log(...args)
  }
}
