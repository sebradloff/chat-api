const fs = require('fs');
const path = require('path');

const serverConfig = {
  entry: path.resolve(__dirname, 'server.js'),
  resolve: {
    extensions: ['', '.js', '.json']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js'
  },
  target: 'node',
  externals: fs.readdirSync('node_modules')
    .reduce(function(acc, mod) {
      if (mod === '.bin') {
        return acc
      }

      acc[mod] = 'commonjs ' + mod
      return acc
  }, {}),
  module: {
   loaders: [
      {
       test: /\.js$/,
       exclude: /node_modules/,
       loader: 'babel-loader'
      },
      {
       test: /\.json$/,
       loader: "json",
      }
    ]
  }
}

module.exports = serverConfig
