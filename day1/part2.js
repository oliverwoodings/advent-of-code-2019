(async () => {
  const input = await getInput()
  const rows = input.trim().split('\n')
  console.log(rows.map(getFuelRequirement).reduce((t, f) => t + f, 0))
})()

function getFuelRequirement (mass) {
   const fuel = Math.floor(mass / 3) - 2
   if (fuel > 0) return fuel + getFuelRequirement(fuel)
   return 0
}

async function getInput () {
   const res = await fetch('https://adventofcode.com/2019/day/1/input')
   return res.text()
}
