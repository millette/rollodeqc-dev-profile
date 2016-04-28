'use strict'

const months = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre'
]

const barchartProcess = (bc) => {
  if (bc.data && bc.data.length) {
    bc.max = Math.max.apply(null, bc.data.map((x) => x.value))
  }
  bc.data.sort((a, b) => {
    if (a.value > b.value) { return 1 }
    if (a.value < b.value) { return -1 }
    return 0
  }).reverse()
  return bc
}

const preprocess = (dev) => {
  const since = new Date(dev.githubSince)
  dev.githubSince = months[since.getMonth()] + ' ' + since.getFullYear()
  dev.barcharts = dev.barcharts.map(barchartProcess)
  return dev
}

const devs = require('./devs.json').map(preprocess)

const timelineProcess = (x, i) => {
  return {
    date: i,
    Followers: x[0],
    Followings: x[1]
  }
}

const tl0 = devs[0].timelines[0].data.map(timelineProcess)

module.exports = {
  entry: [
    './entry.js',
    'file?name=index.html!jade-html!./index.jade'
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  devServer: {
    inline: true,
    host: '0.0.0.0',
    port: 1234
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.jpg$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  jadeLoader: {
    locals: {
      devs: devs,
      tl0: tl0
    }
  },
  postcss: (webpack) => [
    require('postcss-import')({ addDependencyTo: webpack }),
    require('postcss-url')(),
    require('postcss-cssnext')(),
    require('postcss-responsive-type')(),
    require('lost'),
    require('postcss-browser-reporter')(),
    require('postcss-reporter')()
  ]
}
