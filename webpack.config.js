// transform query objects to query params when using multiple loaders
function query (loader, query) {
  return loader + '?' + JSON.stringify(query)
}

module.exports = {
  entry: './run.js',
  output: {
    path: './build',
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: [
        query('babel-loader', {presets: ['es2015']})
      ]
    }, {
      test: /\.cssm$/, loader: 'style-loader!css-loader?modules'
    }]
  }
}
