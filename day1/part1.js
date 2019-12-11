(async () => {
  const input = await getInput()
  const rows = input.trim().split('\n')
  console.log(rows.map(getFuelRequirement).reduce((t, f) => t + f, 0))
})()

function getFuelRequirement (mass) {
   return Math.floor(mass / 3) - 2
}

async function getInput () {
   const res = await fetch('https://adventofcode.com/2019/day/1/input')
   return res.text()
}
