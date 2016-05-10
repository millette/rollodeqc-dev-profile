'use strict'

// period: day or hours
exports.byPeriod = (period) => {
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
  const out = exports.byPeriod('day')
  out.description = description
  out.data = { values: json }
  return out
}

exports.hourPeriod = (description, json) => {
  const out = exports.byPeriod('hours')
  out.description = description
  out.data = { values: json }
  return out
}
