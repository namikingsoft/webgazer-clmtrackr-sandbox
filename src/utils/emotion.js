// @flow
import { train, predict } from 'utils/regression';
import { LogisticRegression } from 'machine_learning';
import * as emotion from 'fixtures/emotion-data';
import type { Position, Parameters } from 'types/clmtrackr';
import type { EmotionPrediction } from 'types/emotion';
import type { Matrix } from 'types/math';

const calcEmotionParameter: (_:Position) => Parameters
= pos => [
  (pos[26][1] - pos[24][1]) / 1, // left eye height
  (pos[50][0] - pos[44][0]) / 3, // mouse width
  (pos[47][1] - pos[37][1]) / 1, // mouse to nose height
  (pos[57][1] - pos[60][1]) / 1, // open mouse height
  (pos[29][1] - pos[17][1]) / 2, // right eye to brown height
  (pos[44][1] - pos[61][1]) * 3, // left mouse rad
  (pos[50][1] - pos[59][1]) * 3, // right mouse rad
  Math.abs(pos[33][0] - pos[62][0]), // nose rad
];

const createModel: (_:Matrix) => LogisticRegression
= parameters => train([
  ...emotion.plain,
  ...parameters,
])([
  ...emotion.plain.map(() => [0, 1]),
  ...parameters.map(() => [1, 0]),
]);

const happyModel = createModel(emotion.happy);
const angryModel = createModel(emotion.angry);
const unhappyModel = createModel(emotion.unhappy);
const supriseModel = createModel(emotion.suprise);

export const predictEmotions: (_:Position) => Array<EmotionPrediction>
= position => [
  {
    name: 'happy',
    value: predict(calcEmotionParameter(position))(happyModel)[0],
  },
  {
    name: 'angry',
    value: predict(calcEmotionParameter(position))(angryModel)[0],
  },
  {
    name: 'unhappy',
    value: predict(calcEmotionParameter(position))(unhappyModel)[0],
  },
  {
    name: 'suprise',
    value: predict(calcEmotionParameter(position))(supriseModel)[0],
  },
];

export const scoreEmotions: (_:Array<EmotionPrediction>) => number
= emotions => emotions.reduce((acc, x) => {
  switch (x.name) {
    case 'happy': return acc + x.value;
    case 'angry': return acc - x.value;
    case 'unhappy': return acc - x.value;
    case 'suprise': return acc + x.value;
    default: return acc;
  }
}, 0);
