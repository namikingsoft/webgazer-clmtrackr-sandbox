// @flow
import { mean, variance } from 'simple-statistics';
import { LogisticRegression } from 'machine_learning';
import type { Matrix } from 'types/canvas';

const normalize: (_:Array<number>) => Array<number>
= xs => {
  const avg = mean(xs);
  const sd = variance(xs);
  return xs
  .map(x => (x - avg) / sd)
  .map(x => {
    if (x > 1) return 1;
    else if (x < -1) return -1;
    return x;
  });
};

export const train: (_:Matrix) => (_:Matrix) => LogisticRegression
= xss => yss => {
  const model = new LogisticRegression({
    input: xss.map(xs => normalize(xs)),
    label: yss,
    n_in: xss[0] ? xss[0].length : 0,
    n_out: 2,
  });
  model.set('log level', 0);
  model.train({
    lr: 0.6,
    epochs: 2000,
  });
  return model;
};

export const predict: (_:Array<number>) => (_:LogisticRegression) => Array<number>
= xs => model => model.predict([normalize(xs)])[0];
