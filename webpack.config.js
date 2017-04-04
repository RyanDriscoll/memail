'use strict';

var webpack = require('webpack');

module.exports = {
  entry: {
    popup: './popup.js',
    background: './background.js'
    },
  output: {
    path: __dirname,
    filename: './public/[name].bundle.js'
  },
  context: __dirname,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-2']
        }
      }
    ]
  }
};
