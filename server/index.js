import Express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import path from 'path';
import config from '../webpack.config';

const port = 3000;

new Express()
.use(webpackDevMiddleware(webpack(config), {
  publicPath: config.output.publicPath,
  stats: { colors: true },
}))
.listen(port, err => (
  err ? console.error(err) : console.info('==> Listening on port %s.', port)
));
