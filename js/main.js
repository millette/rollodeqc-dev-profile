/* globals data1, d3, $ */
'use strict'

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

$(() => {
  grapher(data1, '#network')
  // grapher(data2, '#stars')
})

/*
Sat 23 12 PM
Apr 24 12 PM
Mon 25 12 PM
Tue 26 12 PM
Wed 27 12 PM
Thu 28 12 PM
Fri 29 12 PM
Sat 30
*/
