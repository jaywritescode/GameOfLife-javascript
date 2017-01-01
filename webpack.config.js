const path = require('path');

module.exports = {
  entry: './index.jsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  modulesDirectories: [
    'node_modules',
    `${process.cwd()}/node_modules`
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss']
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        loaders: ['style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'sass-loader']
      }
    ]
  },
  sassLoader: {
    sourceMap: true
  },
  devtool: '#source-map',
};
