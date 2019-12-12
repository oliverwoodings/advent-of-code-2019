const fetchInput = require('../common/fetchInput')

const STEPS = 1000

run()

async function run () {
  const moons = await getMoons()

  for (let i = 0; i < STEPS; i++) {
    for (const moona of moons) {
      for (const moonb of moons) {
        if (moona.i >= moonb.i) continue

        for (const axis in moona.vel) {
          if (moona.pos[axis] > moonb.pos[axis]) {
            moona.vel[axis]--
            moonb.vel[axis]++
          } else if (moona.pos[axis] < moonb.pos[axis]) {
            moona.vel[axis]++
            moonb.vel[axis]--
          }
        }
      }
    }

    for (const moon of moons) {
      for (const axis in moon.vel) {
        moon.pos[axis] += moon.vel[axis]
      }
    }
  }

  const energy = sum(moons.map(({ vel, pos }) => {
    const pot = sum(Object.values(pos).map(Math.abs))
    const kin = sum(Object.values(vel).map(Math.abs))
    return pot * kin
  }))
  console.log(energy)

}

async function getMoons () {
  const input = await fetchInput(12)
  return input.trim().split('\n').map(parseMoon)
}

function parseMoon (spec, i) {
  const moon = {
    i,
    pos: {},
    vel: { x: 0, y: 0, z: 0 }
  }
  spec.replace(/[<>]/g, '').split(', ').forEach((coord) => {
    const [axis, value] = coord.split('=')
    moon.pos[axis] = Number(value)
  })
  return moon
}

function sum (arr) {
  return arr.reduce((a, b) => a + b, 0)
}
