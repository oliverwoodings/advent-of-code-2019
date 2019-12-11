(async () => {
  const program = await fetchProgram()

  const outputs = []
  for (let i = 1234; i <= 43210; i++) {
      const phaseString = String(i).padStart(5, '0')
      if (/(\d)\d*\1/.test(phaseString) || /[5-9]/.test(i)) {
          continue
      }

      const phases = phaseString.split('').map(Number)
      console.log('PHASES:', phases)

      const output = phases.reduce((input, phase) => {
          const inputs = [phase, input]
          let output = null
          compute([...program], () => inputs.shift(), (val) => {
              output = val
          })
          return output
      }, 0)

      outputs.push(output)
  }

  console.log('DONE:', Math.max(...outputs))
})()


function compute (program, stdin, stdout, pointer = 0) {
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
           const input = stdin()
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
           return program
       default:
           throw new Error(`Unexpected opcode: ${opcode} ${program}`)
   }

   function readParameter (offset, overrideMode) {
       const parameter = program[pointer + offset]
       if (modes[offset - 1] === 1 || overrideMode === 1) return parameter
       return program[parameter]
   }

   function goto (nextPointer) {
       return compute(program, stdin, stdout, nextPointer)
   }
}

async function fetchProgram () {
   const res = await fetch('https://adventofcode.com/2019/day/7/input')
   const raw = await res.text()
   return raw.trim().split(',').map(Number)
}
