/* globals data1, d3, $ */
'use strict'

const grapher = (data, sel) => {
  const margin = { top: 20, right: 80, bottom: 30, left: 50 }
  const width = 460 - margin.left - margin.right
  const height = 250 - margin.top - margin.bottom

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
      .x((d) => x(d.date))
      .y((d) => y(d.temperature))

  const svg = d3.select(sel).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  color.domain(d3.keys(data[0]).filter((key) => key !== 'date'))

  const cities = color.domain().map((name) => {
    return {
      name: name,
      values: data.map((d) => {
        return {date: d.date, temperature: +d[name]}
      })
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
      .attr('d', (d) => line(d.values))
      .style('stroke', (d) => color(d.name))

  city.append('text')
      .datum((d) => {
        return {name: d.name, value: d.values[d.values.length - 1]}
      })
      .attr('transform',
        (d) => 'translate(' + x(d.value.date) + ',' + y(d.value.temperature) + ')'
      )
      .attr('x', 3)
      .attr('dy', '.35em')
      .text((d) => d.name)
}

$(() => {
  grapher(data1, '#network')
  grapher(data1, '#stars')
})
