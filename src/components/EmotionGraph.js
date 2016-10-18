// @flow
import React from 'react';
import classnames from 'classnames';
import style from 'styles/components/EmotionGraph.css';
import type { EmotionPrediction } from 'types/emotion';

type Props = {
  className?: string,
  predictions: Array<EmotionPrediction>,
};

const EmotionGraph = ({ className, predictions }: Props) => (
  <div className={classnames(className, style.my)}>
    {predictions.map(x =>
      <div
        key={x.name}
        className={style.myGraph}
        style={{
          width: `${Math.round(x.value * 100)}%`,
        }}
      >{x.name}</div>
    )}
  </div>
);

export default EmotionGraph;
