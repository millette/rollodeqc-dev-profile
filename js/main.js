/* globals data1, $ */
'use strict'

const d3 = require('d3')
const vl = require('vega-lite')
const vg = require('vega')
vg.embed = require('vega-embed')

// Adapted from http://bl.ocks.org/mbostock/3884955
const grapher = (data, sel) => {
  const margin = { top: 20, right: 30, bottom: 30, left: 50 }
  const width = 460 - margin.left - margin.right
  const height = 250 - margin.top - margin.bottom
  const parseDate = d3.time.format('%Y-%m-%d').parse
  const x = d3.time.scale().range([0, width])
  const y = d3.scale.linear().range([height, 0])
  const color = d3.scale.category10()

  const xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.day, 3)
    .tickFormat(d3.time.format('%m-%d'))

  const yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')

  const line = d3.svg.line()
    .interpolate('basis')
    .x((d) => x(d.date))
    .y((d) => y(d.temperature))

  const svg = d3.select(sel).append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', [
      '0 0', width + margin.left + margin.right, height + margin.top + margin.bottom
    ].join(' '))
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  color.domain(d3.keys(data[0]).filter((key) => key !== 'date'))

  data.forEach((d) => { d.date = parseDate(d.date) })

  const cities = color.domain().map((name) => {
    return {
      name: name,
      values: data.map((d) => { return {date: d.date, temperature: +d[name]} })
    }
  })

  x.domain(d3.extent(data, (d) => d.date))

  y.domain([
    d3.min(cities, (c) => d3.min(c.values, (v) => v.temperature)),
    d3.max(cities, (c) => d3.max(c.values, (v) => v.temperature))
  ])

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)

  const city = svg.selectAll('.city').data(cities)
    .enter().append('g').attr('class', 'city')

  city.append('path')
    .attr('class', 'line')
    .attr('d', (d) => line(d.values))
    .style('stroke', (d) => color(d.name))

  city.append('text')
    .datum((d) => { return {name: d.name, value: d.values[d.values.length - 1]} })
    .attr('transform',
      (d) => 'translate(' + x(d.value.date) + ',' + y(d.value.temperature) + ')'
    )
}

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
    if (err) {
      console.log('ERR:', err)
      return
    }
    const elEl = document.querySelector(el)
    const titleEl = document.createElement('h5')
    titleEl.style.marginBottom = 0
    titleEl.style.textAlign = 'center'
    titleEl.innerHTML = spec.title || spec.description
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

$(() => {
  const specVL = {
    description: 'Stock prices of 5 Tech Companies Over Time.',
    title: 'Stock prices of 5 Tech Companies Over Time',
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
  grapher(data1, '#network')
  // grapher(data2, '#stars')
  addVega('#vega-lite', specVL)
})
