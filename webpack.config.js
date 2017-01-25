const fs = require('fs');
const path = require('path');

const serverConfig = {
  entry: {
    server: path.resolve(__dirname, 'src/server.js'),
    pg_schema: path.resolve(__dirname, 'src/pg_schema')
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
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
