'use strict'

const vg = require('vega')
vg.embed = require('vega-embed')

const cleanHTML = (h) => h
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

const countActions = (actions) => {
  if (actions === undefined || actions === true) { return 3 }
  if (actions === false || typeof actions !== 'object') { return 0 }

  let r
  let trues = 3
  for (r in actions) { if (!actions[r]) { --trues } }
  return Math.max(trues, 0)
}

exports.addVega = (el, spec) => {
  const s = {
    mode: 'vega-lite',
    spec: spec,
    actions: { source: false },
    renderer: 'svg'
  }

  const vegaEl = document.createElement('div')
  vg.embed(vegaEl, s, (err, result) => {
    const elEl = document.querySelector(el)
    if (err) {
      if (elEl) {
        const preEl = document.createElement('pre')
        preEl.innerHTML = err
        elEl.appendChild(preEl)
      }
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
    const actionsEl = document.querySelectorAll('.vega-actions')
    if (actionsEl) {
      const nColsClasses = [ false, 'one', 'halves', 'thirds' ]
      const colClass = nColsClasses[countActions(s.actions)]
      if (colClass) {
        let r
        for (r = 0; r < actionsEl.length; ++r) { actionsEl[r].classList.add(colClass) }
      }
    }
  })
}

// period: day or hours
const byPeriod = (period) => {
  return {
    mark: 'bar',
    encoding: {
      y: { timeUnit: period, field: 'created_at', type: 'temporal' },
      x: { aggregate: 'count', field: '*', type: 'quantitative' },
      color: { field: 'type', type: 'nominal' }
    }
  }
}

exports.dayPeriod = (description, json) => {
  const out = byPeriod('day')
  out.description = description
  out.data = { values: json }
  return out
}

exports.hourPeriod = (description, json) => {
  const out = byPeriod('hours')
  out.description = description
  out.data = { values: json }
  return out
}

exports.licenseBars = (description, json) => {
  return {
    description: description,
    data: { values: json },
    mark: 'bar',
    transform: {
      calculate: [
        { field: 'Licenses', expr: '(datum.license && datum.license.key) || "unknown"' },
        { field: 'Source', expr: 'datum.fork ? "Fork" : "Original"' }
      ]
    },
    encoding: {
      y: { field: 'Licenses', type: 'nominal' },
      x: { aggregate: 'count', field: '*', type: 'quantitative' },
      color: { field: 'Source', type: 'nominal' }
    }
  }
}

exports.eventTypeBars = (description, json) => {
  return {
    description: description,
    data: { values: json },
    mark: 'bar',
    transform: {
      calculate: [ { field: 'Event', expr: 'slice(datum.type, 0, -5)' } ]
    },
    encoding: {
      y: { field: 'Event', type: 'nominal' },
      x: { aggregate: 'count', field: '*', type: 'quantitative' },
      color: { field: 'Event', type: 'nominal', legend: false }
    }
  }
}

exports.languagePBars = (description, json) => {
  return {
    description: description,
    data: { values: json },
    mark: 'bar',
    transform: {
      calculate: [
        { field: 'Source', expr: 'datum.fork ? "Fork" : "Original"' }
      ]
    },
    encoding: {
      y: { field: 'language', type: 'nominal' },
      x: { aggregate: 'count', field: '*', type: 'quantitative' },
      color: { field: 'Source', type: 'nominal' }
    }
  }
}

exports.languageBars = (description, json) => {
  const json2 = []
  let r
  json.forEach((repo) => {
    if (!repo.languages) { return }
    if (!Object.keys(repo.languages).length) { return }
    for (r in repo.languages) {
      json2.push({
        Language: r,
        LOC: repo.languages[r],
        fork: repo.fork
      })
    }
  })

  return {
    description: description,
    data: { values: json2 },
    mark: 'bar',
    transform: {
      calculate: [
        { field: 'Source', expr: 'datum.fork ? "Fork" : "Original"' }
      ]
    },
    encoding: {
      y: { field: 'Language', type: 'nominal' },
      x: { aggregate: 'sum', field: 'LOC', type: 'quantitative' },
      color: { field: 'Source', type: 'nominal' }
    }
  }
}
