// @flow
import React from 'react';
import classnames from 'classnames';
import style from 'styles/components/EmotionDistribute.css';

type Props = {
  className?: string,
  xLength: number,
  yLength: number,
};

const drawCells: (_:number) => (_:number) => any
= xLength => yLength => {
  return <div />;
};

const EmotionDistribute = ({ className, xLength, yLength }: Props) => (
  <div className={classnames(className, style.my)}>
    {drawCells(xLength)(yLength)}
  </div>
);

export default EmotionDistribute;
