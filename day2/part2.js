(async () => {
  const raw = await getInput()

  for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
          const input = raw.trim().split(',').map(Number)
          input[1] = i
          input[2] = j
          try {
              const [output] = compute(input)
              if (output === 19690720) {
                  console.log('Got it', i, j, 100 * i + j)
                  return
              }
          } catch (e) {}
      }
  }
  console.log('Didnt get it :(')
})()


function compute (input, pointer = 0) {
   const opcode = read(0)

   switch (opcode) {
       case 1:
           input[read(3)] = input[read(1)] + input[read(2)]
           return compute(input, pointer + 4)
       case 2:
           input[read(3)] = input[read(1)] * input[read(2)]
           return compute(input, pointer + 4)
       case 99:
           return input
       default:
           throw new Error('Unexpected opcode:', opcode, input)
   }

   function read (offset) {
       return input[pointer + offset]
   }
}

async function getInput () {
   const res = await fetch('https://adventofcode.com/2019/day/2/input')
   return res.text()
}
