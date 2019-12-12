const { lcm } = require('mathjs')

const fetchInput = require('../common/fetchInput')

run()

async function run () {
  const moons = await getMoons()

  const periods = ['x', 'y', 'z'].map((axis) => getCyclicPeriod(axis, moons))
  console.log(lcm(...periods))
}

function getCyclicPeriod (axis, moons) {
  const visited = new Set()

  let steps = 0
  while (1) {
    const hash = hashMoons(moons, axis)
    if (visited.has(hash)) return steps

    visited.add(hash)
    steps++

    for (const moona of moons) {
      for (const moonb of moons) {
        if (moona.i >= moonb.i) continue
        if (moona.pos[axis] > moonb.pos[axis]) {
          moona.vel[axis]--
          moonb.vel[axis]++
        } else if (moona.pos[axis] < moonb.pos[axis]) {
          moona.vel[axis]++
          moonb.vel[axis]--
        }
      }
    }

    for (const moon of moons) {
      moon.pos[axis] += moon.vel[axis]
    }
  }
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

function hashMoons (moons, axis) {
  return moons.map(({ vel, pos }) => `${vel[axis]}:${pos[axis]}`).join(':')
}
