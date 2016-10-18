// @flow
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import style from 'styles/components/EmotionCell.css';

type Props = {
  className?: string,
  top: number,
  left: number,
  width: number,
  height: number,
  score: number,
};

export default class EmotionCell extends PureComponent {
  props: Props;

  render() {
    const { className, top, left, width, height, score } = this.props;
    const opacity = Math.abs(score) / 20;
    const backgroundColor = score > 0 ? 'red' : 'blue';
    return (
      <div
        className={classnames(className, style.my)}
        style={{ top, left, width, height, opacity, backgroundColor }}
      />
    );
  }
}
