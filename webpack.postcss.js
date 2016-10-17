/* eslint-disable */

module.exports = webpack => ({
  defaults: [
    require('postcss-import')({
      addDependencyTo: webpack,
    }),
    require('autoprefixer'),
    require('postcss-nested'),
    require('postcss-simple-vars'),
    require('postcss-importantly'),
    require('postcss-color-hex-alpha'),
  ],
});
