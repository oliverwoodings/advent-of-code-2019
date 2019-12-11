(async () => {
  const raw = await getInput()
  const input = raw.trim().split(',').map(Number)

  compute(input, 5)
})()


function compute (program, input, pointer = 0) {
   const pos1 = String(program[pointer])
   const opcode = Number(pos1.slice(-2))
   const modes = pos1.slice(0, -2).split('').map(Number).reverse()
   debug(opcode, modes, pointer)

   switch (opcode) {
       case 1:
           program[readParameter(3, 1)] = readParameter(1) + readParameter(2)
           return goto(pointer + 4)
       case 2:
           program[readParameter(3, 1)] = readParameter(1) * readParameter(2)
           return goto(pointer + 4)
       case 3:
           program[readParameter(1, 1)] = input
           return goto(pointer + 2)
       case 4:
           console.log('OUTPUT:', readParameter(1))
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
       return compute(program, input, nextPointer)
   }
}

async function getInput () {
   const res = await fetch('https://adventofcode.com/2019/day/5/input')
   return res.text()
}

function debug (...args) {
   console.log('DEBUG:', ...args)
}
