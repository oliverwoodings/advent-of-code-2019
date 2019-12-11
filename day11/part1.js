const { run } = require('./common')

const painted = new Map()

run(painted).then(() => {
  console.log('DONE', painted.size)
})
