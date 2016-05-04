'use strict'

// data
const repos = require('./dev.json')
  .filter((repo) => repo.languages && repo.languages)
  .map((repo) => repo.languages)

const red = repos.reduce((previous, current, index, array) => {
  for (let language in current) {
    if (!previous[language]) { previous[language] = 0 }
    previous[language] += current[language]
  }
  return previous
}, {})

const reds = []

for (let language in red) {
  reds.push({
    label: language,
    value: red[language]
  })
}

const languages = reds.sort((a, b) => {
  if (a.value > b.value) return 1
  if (a.value < b.value) return -1
  return 0
}).reverse()

console.log(JSON.stringify(languages, null, ' '))
