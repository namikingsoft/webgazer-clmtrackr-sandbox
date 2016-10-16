// @flow
import React from 'react';
import type { EmotionPrediction } from 'types/clmtrackr';

type Props = {
  prediction: EmotionPrediction,
};

const EmotionGraph = ({ prediction }: Props) => (
  <div>
    {prediction.map(x => <div key={x.emotion}>{x.emotion}: {x.value}</div>)}
  </div>
);

export default EmotionGraph;
