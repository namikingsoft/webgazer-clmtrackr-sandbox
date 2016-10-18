const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postcss = require('./webpack.postcss');

const { NODE_ENV } = process.env;

module.exports = {
  devtool: 'source-map',
  entry: {
    app: [
      './src/index',
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style',
          'css?module&sourceMap&importLoaders=1!postcss'
        ),
      },
    ],
  },
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules'],
    root: path.resolve(__dirname, 'src'),
  },
  node: {
    fs: 'empty',
    net: 'empty',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
      },
    }),
    new ExtractTextPlugin('style.bundle.css'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'App',
      mobile: true,
    }),
  ],
  postcss,
};
