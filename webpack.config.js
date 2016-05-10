'use strict'

const webpack = require('webpack')

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

const preprocess = (dev) => {
  const since = new Date(dev.created_at)
  dev.githubSince = months[since.getMonth()] + ' ' + since.getFullYear()
  return dev
}

const devs = preprocess(require('./user.json'))

const loaders = [ { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader' } ]
const plugins = [ new webpack.ProvidePlugin({
  'Promise': 'imports?this=>global!exports?global.Promise!es6-promise',
  'window.fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
}) ]

loaders.push({ test: /\/js\/(main|utils)\.js$/, loader: 'babel?presets[]=es2015' })

if (true) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }))
}

module.exports = {
  entry: [
    './entry.js',
    'file?name=index.html!jade-html!./index.jade'
  ],
  output: { path: __dirname, filename: 'bundle.js' },
  devServer: { inline: true, host: '0.0.0.0', port: 1234 },
  module: { loaders: loaders },
  plugins: plugins,
  jadeLoader: { locals: { devs: devs } },
  postcss: [
    require('postcss-import')({ addDependencyTo: webpack }),
    require('postcss-url')(),
    require('postcss-cssnext')(),
    require('postcss-responsive-type')(),
    require('lost'),
    require('postcss-browser-reporter')(),
    require('postcss-reporter')()
  ]
}
