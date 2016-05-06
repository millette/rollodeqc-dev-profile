#!/usr/bin/env node

'use strict'

// npm
const countBy = require('lodash.countby')
/*
const getRepos = require('rollodeqc-gh-repos')
const getUser = require('rollodeqc-gh-user')
const getEvents = require('rollodeqc-gh-user-events')
*/

const username = 'jipi'

const dev = require(`./user-${username}.json`)
dev.repos = require(`./${username}-repos.json`)
dev.events = require(`./${username}-events.json`)

var language

dev.timelines = [
  {
    'name': 'network',
    'title': 'Réseau social',
    'description': 'Réseau social (following/followers)',
    'data': [
      [ '2016-04-30', 98, 106.2 ],
      [ '2016-04-29', 97, 105.9 ],
      [ '2016-04-28', 97, 105.9 ],
      [ '2016-04-27', 98, 105.8 ],
      [ '2016-04-26', 97, 104.2 ],
      [ '2016-04-25', 96, 102.9 ],
      [ '2016-04-24', 96, 100.9 ],
      [ '2016-04-23', 94, 101.8 ]
    ]
  }
]

dev.bigProjects = [
  'rollodeqc-backend',
  'rollodeqc-frontend'
]

dev.popProjects = [
  'star-where'
]

dev.orgs = [
  'rollodeqc',
  'rockstars'
]

const repos = dev.repos
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

dev.barcharts = [
  {
    name: 'languages',
    title: 'Langages',
    description: 'Langages (lignes de code)',
    data: languages
  },
  {
    name: 'licenses',
    title: 'Licences',
    description: 'Licences (nombre de projets)',
    data: licenses
  },
  {
    name: 'packagers',
    title: 'Packagers',
    description: 'Packagers (npm, bower, etc. selon libraries.io)',
    data: [
      {
        'label': 'npm',
        'value': 8
      },
      {
        'label': 'bower',
        'value': 1
      }
    ]
  }
]

dev.photo = `https://avatars3.githubusercontent.com/u/${dev.id}?v=3&s=460`
dev.bio = 'Plus de vingt-cinq années de programmation professionnelle, de l\'assembleur à Zope en passant par mySQL.'

console.log(JSON.stringify(dev, null, ' '))
