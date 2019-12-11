(async () => {
  const encoded = await fetchEncoded()
  const layers = encoded.match(/.{1,150}/g).map(layer => layer.match(/.{1,25}/g))

  for (let row = 0; row < 6; row++) {
      const rendered = []
      for (let column = 0; column < 25; column++) {
          rendered.push(layers.reduce((colour, layer) => {
              if (colour === null || colour == 2) {
                  return layer[row][column]
              }
              return colour
          }, null))
      }
      console.log(rendered.join('').replace(/0/g, ' '))
  }
})()


async function fetchEncoded () {
  const res = await fetch('https://adventofcode.com/2019/day/8/input')
  return res.text()
}
