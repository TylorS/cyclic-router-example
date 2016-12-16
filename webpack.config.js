const path = require('path');

const config = {
  devtool: 'sourcemap',

  entry: [
    path.resolve('src/index.js'),
  ],

  output: {
    path: path.resolve('./'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:5050/',
  },

  devServer: {
    inline: true,
    host: '0.0.0.0',
    port: 5050,
    contentBase: path.resolve('./'),
    historyApiFallback: true,
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'buble-loader',
        exclude: /node_modules/,
      }
    ],
  },

  resolve: {
    // module and jsnext:main are for tree-shaking compatibility
    mainFields: ['module', 'jsnext:main', 'browser', 'main'],
    extensions: ['.js', '.json'],
  }
};

module.exports = config;