(() => {
  let tally = 0
  for (let i = 273025; i <= 767253; i++) {
      if (isPossible(i)) tally++
  }
  console.log('Hello', tally)
})()

function isPossible (value) {
  const parts = String(value).split('')
  let blocks = []
  let decreased = false
  for (let j = 0; j < parts.length; j++) {
      if (parts[j] === parts[j - 1]) {
          blocks[blocks.length - 1]++
      } else {
          blocks.push(1)
          if (parts[j] < parts[j - 1]) {
              decreased = true
          }
      }
  }
  return !decreased && blocks.find(block => block === 2)
}
