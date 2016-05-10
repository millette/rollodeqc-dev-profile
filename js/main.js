'use strict'

const utils = require('./utils.js')

const datas = [
  window.fetch('./events.json').then((response) => response.json()),
  window.fetch('./repos.json').then((response) => response.json())
]

document.addEventListener('DOMContentLoaded', () => {
  Promise.all(datas).then((data) => {
    utils.addVega('#vega-lite', utils.eventTypeBars('By event type', data[0]))
    utils.addVega('#vega-lite2', utils.licenseBars('Licenses, by number of projects', data[1]))
  })
  .catch((ex) => { console.log('parsing failed', ex) })
})
