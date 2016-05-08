'use strict'

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
  const s = {
    mode: 'vega-lite',
    spec: spec,
    // actions: false, // { source: false, editor: false }
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

const wants = [
  'CreateEvent',
  'IssuesEvent',
  'IssueCommentEvent'
]

const j2 = window.fetch('./events.json')
  .then((response) => response.json())
  .then((json) => wants && wants.length
    ? json.filter((i) => wants.indexOf(i.type) !== -1)
    : json
  )

document.addEventListener('DOMContentLoaded', () => {
  j2.then((json) => {
    const specVL = {
      description: 'Last events',
      data: { values: json },
      mark: 'bar',
      encoding: {
        x: { timeUnit: 'yearmonthdate', field: 'created_at', type: 'temporal' },
        y: { aggregate: 'count', field: '*', type: 'quantitative' },
        color: { field: 'type', type: 'nominal' }
      }
    }
    addVega('#vega-lite', specVL)
    // specVL.mark = 'line'
    // addVega('#vega-lite2', specVL)
  })
  .catch((ex) => {
    console.log('parsing failed', ex)
  })
})
