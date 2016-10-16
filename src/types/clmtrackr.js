// @flow
import type { Point } from 'types/canvas';

export type Parameters = Array<number>;
export type Position = Array<Point>;
export type EmotionPrediction = Array<{
  emotion: string,
  value: number,
}>;
export type EmotionModel = Array<{
  name: string,
  bias : number,
  coefficients: Array<number>,
}>;
