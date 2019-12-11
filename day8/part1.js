(async () => {
  const encoded = await fetchEncoded()
  const layers = encoded.match(/.{1,150}/g)

  const fewest = layers.reduce((fewest, layer) => {
      const zeroes = count(layer, 0)
      console.log(`prev: ${fewest && fewest[1]}  ours: ${zeroes}`)
      if (!fewest || zeroes < fewest[1]) {
          return [layer, zeroes]
      }
      return fewest
  }, null)
  console.log(count(fewest[0], 1) * count(fewest[0], 2))

})()

function count (str, char) {
  return str.split(char).length - 1
}

async function fetchEncoded () {
  const res = await fetch('https://adventofcode.com/2019/day/8/input')
  return res.text()
}
