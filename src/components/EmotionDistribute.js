// @flow
import React, { Component } from 'react';
import classnames from 'classnames';
import md5 from 'md5';
import { range } from 'ramda';
import EmotionCell from 'components/EmotionCell';
import style from 'styles/components/EmotionDistribute.css';

type Props = {
  className?: string,
  width: number,
  height: number,
  xLength: number,
  yLength: number,
  data: Array<Array<number>>,
};

export default class EmotionDistribute extends Component {
  props: Props;

  shouldComponentUpdate(nextProps: Props) {
    return md5(JSON.stringify(this.props)) !== md5(JSON.stringify(nextProps));
  }

  render() {
    const { className, width, height, xLength, yLength, data } = this.props;
    const w = width / xLength;
    const h = height / yLength;
    return (
      <div className={classnames(className, style.my)}>
        {range(0, xLength).map(x =>
         range(0, yLength).map(y =>
           <EmotionCell
             key={`${x}-${y}`}
             top={y * h}
             left={x * w}
             width={w}
             height={h}
             score={data[x][y] || 0}
           />
        ))}
      </div>
    );
  }
}
