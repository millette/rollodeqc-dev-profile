'use strict'

const utils = require('./utils.js')

const datas = [
  window.fetch('./events.json').then((response) => response.json()),
  window.fetch('./repos.json').then((response) => response.json())
]

document.addEventListener('DOMContentLoaded', () => {
  Promise.all(datas).then((data) => {
    utils.addVega('#vega-lite', utils.eventTypeBars('Event types', data[0]))
    utils.addVega('#vega-lite2', utils.licenseBars('Licenses, by number of projects', data[1]))
    // utils.addVega('#vega-lite3', utils.languagePBars('Languages, by number of projects', data[1]))
    utils.addVega('#vega-lite4', utils.languageBars('Languages, by number of lines', data[1]))
  })
  .catch((ex) => { console.log('parsing failed', ex) })
})
