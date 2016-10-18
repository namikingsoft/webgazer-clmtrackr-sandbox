// @flow
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import style from 'styles/components/EmotionCell.css';

type Props = {
  className?: string,
  x: number,
  y: number,
  width: number,
  height: number,
};

export default class EmotionCell extends PureComponent {
  props: Props;

  render() {
    const { className, x, y, width, height } = this.props;
    return (
      <rect
        className={classnames(className, style.my)}
        x={x}
        y={y}
        width={width}
        height={height}
        fillOpacity="0.2"
      />
    );
  }
}
