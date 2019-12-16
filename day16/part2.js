const fetchInput = require('../common/fetchInput')

run()

async function run () {
  const input = await getInput()
  const offset = Number(input.slice(0, 7).join(''))
  const nums = input.slice(offset)
  const len = nums.length

  for (let phase = 0; phase < 100; phase++) {
    for (let i = len - 2; i >= 0; i--) {
      nums[i] += nums[i + 1]
      nums[i] %= 10
    }
  }

  console.log(nums.slice(0, 8).join(''))
}


async function getInput () {
  const raw = await fetchInput(16)

  const parsed = raw.split('').map(Number)
  for (let i = 1; i < 10000; i++) {
    for (let j = 0; j < raw.length; j++) {
      parsed.push(parsed[j])
    }
  }

  return parsed
}
