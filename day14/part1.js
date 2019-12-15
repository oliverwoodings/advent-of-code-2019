const fetchInput = require('../common/fetchInput')

run()

async function run () {
  const graph = await getReactionGraph()

  const counts = {}
  walkReactions(graph, 'FUEL', 1, counts)
  console.log(counts.ORE.produced)
}

function walkReactions (graph, node, required, counts) {
  if (!counts[node]) {
    counts[node] = {
      produced: 0,
      leftover: 0
    }
  }

  const leftovers = counts[node].leftover
  counts[node].leftover = Math.max(leftovers - required, 0)
  required = Math.max(required - leftovers, 0)

  if (required === 0) return

  const reaction = graph[node]
  if (reaction) {
    const multiple = Math.ceil(required / reaction.output.count)
    const produced = reaction.output.count * multiple
    const leftover = produced - required
    counts[node].produced += produced
    counts[node].leftover += leftover
    for (const part of reaction.input) {
      walkReactions(graph, part.chemical, multiple * part.count, counts)
    }
  } else {
    counts[node].produced += required
  }
}

async function getReactionGraph () {
  const raw = await fetchInput(14)
  return raw.split('\n').map(parseReaction).reduce((graph, reaction) => {
    if (graph[reaction.output.chemical]) {
      throw new Error('duplicate dummy')
    }
    graph[reaction.output.chemical] = reaction
    return graph
  }, {})
}

function parseReaction (reaction) {
  const [left, right] = reaction
    .split(' => ')
    .map(side => side.split(', ').map(part => {
      const [count, chemical] = part.split(' ')
      return {
        count: Number(count),
        chemical
      }
    }))

  return {
    input: left,
    output: right[0]
  }
}
