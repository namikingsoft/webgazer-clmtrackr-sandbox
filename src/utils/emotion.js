// @flow
import { train, predict } from 'utils/regression';
import type { Position, Parameters, EmotionPrediction, EmotionModel } from 'types/clmtrackr';

export const calcEmotionParameter: (_:Position) => Array<number>
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

    const model = train([
      ...emotion.plain,
      ...emotion.happy,
    ])([
      ...emotion.plain.map(() => [0, 1]),
      ...emotion.happy.map(() => [1, 0]),
    ]);
    const { webgazer } = this.props;
    const clm = webgazer.getTracker().clm;
    webgazer.setGazeListener(() => {
      const position = clm.getCurrentPosition();
      if (position) {
        const parameters = calcEmotionParameter(position);
        console.log(predict(parameters)(model));
      }
    });
