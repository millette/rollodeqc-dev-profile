'use strict'

// npm
const countBy = require('lodash.countby')

// data
const repos = require('./dev.json')

const counts = countBy(repos.filter((repo) => repo.license), (repo) => repo.license.key)

// console.log(counts)

const reds = []

for (let license in counts) {
  reds.push({
    label: license,
    value: counts[license]
  })
}

const licenses = reds.sort((a, b) => {
  if (a.value > b.value) return 1
  if (a.value < b.value) return -1
  return 0
}).reverse()

console.log(JSON.stringify(licenses, null, ' '))
