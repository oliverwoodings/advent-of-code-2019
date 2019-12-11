(async () => {
  const program = await fetchProgram()

  const executions = []

  for (let i = 56789; i <= 98765; i++) {
     if (/(\d)\d*\1/.test(i) || /[0-4]/.test(i)) {
         continue
     }
     const phases = String(i).split('').map(Number)
     executions.push(executePhases(program, phases))
  }

  Promise.all(executions).then((outputs) => {
      console.log('DONE:', Math.max(...outputs))
  })
})()

async function executePhases (program, phases) {
 console.log('PHASES:', phases)

 return new Promise((resolve) => {
     const amps = []
     let lastOutput = null
     for (let i = 0; i < 5; i++) {
         amps.push(createAmp(i, program, phases[i], onOutput, onExit))
     }

     amps[0](0)

     function onOutput (ampIndex, output) {
         lastOutput = output
         const nextAmpIndex = ampIndex === 4 ? 0 : ampIndex + 1
         amps[nextAmpIndex](output)
     }

     function onExit (ampIndex) {
         if (ampIndex === 4) resolve(lastOutput)
     }
 })
}

function createAmp (ampIndex, program, phase, onOutput, onExit) {
  program = [...program]
  const inputBuffer = [phase]
  let onInput = null
  let started = false

  return (input) => {
      console.log('AMP:', ampIndex, input)
      if (onInput) {
          onInput(input)
          onInput = null
      } else {
          inputBuffer.push(input)
          if (!started) {
              compute(program, stdin, stdout, () => onExit(ampIndex))
          }
      }
  }

  async function stdin () {
      if (inputBuffer.length) {
          return inputBuffer.shift()
      }
      return new Promise((resolve) => {
          onInput = resolve
      })
  }

  function stdout (output) {
      onOutput(ampIndex, output)
  }
}

async function compute (program, stdin, stdout, onExit, pointer = 0) {
  const pos1 = String(program[pointer])
  const opcode = Number(pos1.slice(-2))
  const modes = pos1.slice(0, -2).split('').map(Number).reverse()
  console.log('OP:', opcode, modes, pointer)

  switch (opcode) {
      case 1:
          program[readParameter(3, 1)] = readParameter(1) + readParameter(2)
          return goto(pointer + 4)
      case 2:
          program[readParameter(3, 1)] = readParameter(1) * readParameter(2)
          return goto(pointer + 4)
      case 3:
          const input = await stdin()
          if (input === undefined) {
              throw new Error('Input should never be undefined')
          }
          console.log('INPUT:', input)
          program[readParameter(1, 1)] = input
          return goto(pointer + 2)
      case 4:
          const output = readParameter(1)
          console.log('OUTPUT:', output)
          stdout(output)
          return goto(pointer + 2)
      case 5:
          if (readParameter(1) !== 0) {
              return goto(readParameter(2))
          }
          return goto(pointer + 3)
      case 6:
          if (readParameter(1) === 0) {
              return goto(readParameter(2))
          }
          return goto(pointer + 3)
      case 7:
          program[readParameter(3, 1)] = readParameter(1) < readParameter(2) ? 1 : 0
          return goto(pointer + 4)
      case 8:
          program[readParameter(3, 1)] = readParameter(1) === readParameter(2) ? 1 : 0
          return goto(pointer + 4)
      case 99:
          return onExit(program)
      default:
          throw new Error(`Unexpected opcode: ${opcode} ${program}`)
  }

  function readParameter (offset, overrideMode) {
      const parameter = program[pointer + offset]
      if (modes[offset - 1] === 1 || overrideMode === 1) return parameter
      return program[parameter]
  }

  function goto (nextPointer) {
      return compute(program, stdin, stdout, onExit, nextPointer)
  }
}

async function fetchProgram () {
  const res = await fetch('https://adventofcode.com/2019/day/7/input')
  const raw = await res.text()
  return raw.trim().split(',').map(Number)
}
