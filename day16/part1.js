const fetchInput = require('../common/fetchInput')

const BASE_PATTERN = [0, 1, 0, -1]

run()

async function run () {
  const initialInput = await getInput()
  let input = initialInput
  for (let i = 0; i < 100; i++) {
    input = computePhase(input)
  }
  console.log(input.join(''))
}

function computePhase (input) {
  return input.map((_, position) => {
    const pattern = generatePattern(input.length, position + 1)
    const sum = input.map((element, i) => element * pattern[i]).reduce((a, b) => a + b, 0)
    return String(Math.abs(sum)).substr(-1)
  })
}

function generatePattern (length, repeat) {
  let pattern = []
  let i = 0
  while (pattern.length <= length) {
    for (let j = 0; j < repeat && pattern.length <= length; j++) {
      pattern.push(BASE_PATTERN[i])
    }
    i++
    if (i === BASE_PATTERN.length) {
      i = 0
    }
  }
  pattern.shift()
  return pattern
}

async function getInput () {
  const raw = await fetchInput(16)
  // const raw = '69317163492948606335995924319873'
  return raw.split('').map(Number)
}
