/* globals data1 */
'use strict'

const d3 = require('d3')
const vg = require('vega')
vg.embed = require('vega-embed')
vg.lite = require('vega-lite')

const cleanHTML = (h) => h
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

const addVega = (el, spec) => {
/*
  spec.config = {
    viewport: [460, 400]
  }
*/
  const s = {
    mode: 'vega-lite',
    spec: spec,
    actions: false, // { source: false, editor: false }
    renderer: 'svg'
  }
  const vegaEl = document.createElement('div')
  vegaEl.style.marginTop = '-1rem'
  vg.embed(vegaEl, s, (err, result) => {
    const elEl = document.querySelector(el)
    if (err) {
      const preEl = document.createElement('pre')
      preEl.innerHTML = err
      elEl.appendChild(preEl)
      return
    }
    const titleEl = document.createElement('h5')
    titleEl.style.marginBottom = 0
    titleEl.style.textAlign = 'center'
    titleEl.innerHTML = cleanHTML(spec.title || spec.description)
    elEl.appendChild(titleEl)
    elEl.appendChild(vegaEl)
    const svg = result.view._el.firstChild
    const width = svg.getAttribute('width')
    const height = svg.getAttribute('height')
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const specVL = {
    description: 'Stock prices of 5 tech companies over time.',
    title: 'Stock prices of 5 tech companies over time',
    data: {
      url: 'stocks.csv',
      formatType: 'csv'
    },
    mark: 'line',
    encoding: {
      x: { field: 'date', type: 'temporal' },
      y: { field: 'price', type: 'quantitative' },
      color: { field: 'symbol', type: 'nominal' }
    }
  }
  addVega('#vega-lite', specVL)
})
