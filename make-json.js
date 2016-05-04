#!/usr/bin/env node
0 > 1 // see https://github.com/babel/babel-eslint/issues/163

'use strict'

// npm
const countBy = require('lodash.countby')

const dev = require('./user-millette.json')
dev.repos = require('./millette-repos.json')
dev.events = require('./millette-events.json')

var language

//console.log(JSON.stringify(dev, null, ' '))

repos = dev.repos
  .filter((repo) => repo.languages && repo.languages)
  .map((repo) => repo.languages)

const red = repos.reduce((previous, current, index, array) => {
  for (language in current) {
    if (!previous[language]) { previous[language] = 0 }
    previous[language] += current[language]
  }
  return previous
}, {})

const reds = []

for (language in red) {
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


var license

const counts = countBy(dev.repos.filter((repo) => repo.license), (repo) => repo.license.key)

const reds2 = []

for (license in counts) {
  reds2.push({
    label: license,
    value: counts[license]
  })
}

const licenses = reds2.sort((a, b) => {
  if (a.value > b.value) return 1
  if (a.value < b.value) return -1
  return 0
}).reverse()

console.log(JSON.stringify(licenses, null, ' '))
