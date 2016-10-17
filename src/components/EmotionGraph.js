// @flow
import React from 'react';
import classnames from 'classnames';
import style from 'styles/components/EmotionGraph.css';
import type { EmotionPrediction } from 'types/clmtrackr';

type Props = {
  className?: string,
  prediction: EmotionPrediction,
};

const EmotionGraph = ({ className, prediction }: Props) => (
  <div className={classnames(className, style.my)}>
    {prediction.map(x => <div key={x.emotion}>{x.emotion}: {x.value}</div>)}
  </div>
);

export default EmotionGraph;
