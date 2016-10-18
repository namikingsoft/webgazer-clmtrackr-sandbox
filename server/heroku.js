import Express from 'express';
import path from 'path';

const { PORT = 3000 } = process.env;

new Express()
.use(Express.static(path.join(__dirname, '..', 'dist')))
.listen(PORT, err => (
  err ? console.error(err) : console.info('==> Listening on port %s.', PORT)
));
