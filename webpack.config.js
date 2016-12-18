const path = require('path');

module.exports = {
  entry: './index.jsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s(a|c)ss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
}
