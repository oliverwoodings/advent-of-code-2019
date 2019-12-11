(async () => {
  const input = await getInput()
  const rows = input.trim().split(',').map(Number)
  rows[1] = 12
  rows[2] = 2
  console.log(compute(rows))
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
           return input.join(',')
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
