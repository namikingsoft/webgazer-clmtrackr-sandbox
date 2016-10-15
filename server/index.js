import Express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import path from 'path';
import config from '../webpack.config';

const compiler = webpack(config);
const port = 3000;

new Express()
.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}))
.use(webpackHotMiddleware(compiler))
.listen(port, err => (
  err ? console.error(err) : console.info('==> Listening on port %s.', port)
));
