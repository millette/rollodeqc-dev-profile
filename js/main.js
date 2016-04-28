/* globals data1, d3, $ */
'use strict'

/*
d3.csv('../data.csv', function(error, data) {
  if (error) throw error
  console.log('DATACSV:', data)
})
*/

const grapher = (data, sel) => {
  // console.log('hello john!')
  const margin = { top: 20, right: 80, bottom: 30, left: 50 }
  const width = 460 - margin.left - margin.right
  const height = 250 - margin.top - margin.bottom

  // const parseDate = d3.time.format('%Y%m%d').parse

  const x = d3.scale.linear()
      .range([0, width])

  const y = d3.scale.linear()
      .range([height, 0])

  const color = d3.scale.category10()

  const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')

  const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')

  const line = d3.svg.line()
      .interpolate('basis')
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y(d.temperature) })

  const svg = d3.select(sel).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  color.domain(d3.keys(data[0]).filter(function (key) { return key !== 'date' }))

/*
  data.forEach(function (d) {
    d.date = d.date.slice(-1)
    // d.date = parseDate(d.date)
  })
*/

  const cities = color.domain().map(function (name) {
    return {
      name: name,
      values: data.map(function (d) {
        return {date: d.date, temperature: +d[name]}
      })
    }
  })

  x.domain(d3.extent(data, function (d) { return d.date }))

  y.domain([
    d3.min(cities, function (c) { return d3.min(c.values, function (v) { return v.temperature }) }),
    d3.max(cities, function (c) { return d3.max(c.values, function (v) { return v.temperature }) })
  ])

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Number')

  const city = svg.selectAll('.city')
      .data(cities)
    .enter().append('g')
      .attr('class', 'city')

  city.append('path')
      .attr('class', 'line')
      .attr('d', function (d) { return line(d.values) })
      .style('stroke', function (d) { return color(d.name) })

  city.append('text')
      .datum(function (d) { return {name: d.name, value: d.values[d.values.length - 1]} })
      .attr('transform', function (d) { return 'translate(' + x(d.value.date) + ',' + y(d.value.temperature) + ')' })
      .attr('x', 3)
      .attr('dy', '.35em')
      .text(function (d) { return d.name })
}

$(() => {
  grapher(data1, '#network')
  grapher(data1, '#stars')
})
