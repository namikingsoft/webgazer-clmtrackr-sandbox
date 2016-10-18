// @flow
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { range } from 'ramda';
import EmotionCell from 'components/EmotionCell';
import style from 'styles/components/EmotionDistribute.css';

type Props = {
  className?: string,
  width: number,
  height: number,
  xLength: number,
  yLength: number,
};

export default class EmotionDistribute extends PureComponent {
  props: Props;

  render() {
    const { className, width, height, xLength, yLength } = this.props;
    const w = width / xLength;
    const h = height / yLength;
    return (
      <svg className={classnames(className, style.my)}>
        {range(0, xLength).map(x =>
         range(0, yLength).map(y =>
           <EmotionCell
             key={`${x}-${y}`}
             x={x * w}
             y={y * h}
             width={w}
             height={h}
           />
        ))};
      </svg>
    );
  }
}
