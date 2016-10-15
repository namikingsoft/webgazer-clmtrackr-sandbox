const webpack = require('webpack');
const config = require('./webpack.config');

delete config.devtool;
config.entry.app.shift();
config.plugins.push(
  new webpack.optimize.UglifyJsPlugin()
);

module.exports = config;
