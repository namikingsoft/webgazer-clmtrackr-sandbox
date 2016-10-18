// @flow
import React, { Component } from 'react';
import { range } from 'ramda';
import EmotionGraph from 'components/EmotionGraph';
import EmotionDistribute from 'components/EmotionDistribute';
import { predictEmotions } from 'utils/emotion';
import { startWebGazer, showAdjuster } from 'utils/webgazer';
import type { EmotionPrediction } from 'types/emotion';
import type { WebGazer } from 'types/webgazer';
import type { Position } from 'types/clmtrackr';
import type { Point } from 'types/math';

type GazeData = {
  gaze?: {
    x: number,
    y: number,
  },
  clm?: {
    position: Position,
  },
};

type GazeCallback = (_:GazeData) => void;

class App extends Component {
  state: {
    webgazer?: WebGazer;
    emotionPredictions?: Array<EmotionPrediction>,
    emotionTable?: Array<Array<number>>,
    screenWidth: number,
    screenHeight: number,
    xLength: number,
    yLength: number,
  } = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    xLength: 1,
    yLength: 1,
  };

  gazeListenerKVS: { [index: string]: GazeCallback } = {};

  componentWillMount = () => {
    this.startWebGazer().then(webgazer => this.setState({ webgazer }));
    this.addGazeListener('EmotionGraph')(data => {
      if (data.clm) {
        const emotionPredictions = predictEmotions(data.clm.position);
        this.setState({ emotionPredictions });
      }
      if (data.gaze) {
        console.log(this.convertTablePoint(data.gaze.x, data.gaze.y));
      }
    });
    this.handleResizeWindow(null);
    window.addEventListener('resize', this.handleResizeWindow);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResizeWindow);
  };

  convertTablePoint: (_:number, _:number) => Point
  = (x, y) => {
    const { screenWidth, screenHeight, xLength, yLength } = this.state;
    return [
      Math.floor(x / (screenWidth / xLength)),
      Math.floor(y / (screenHeight / yLength)),
    ];
  };

  handleResizeWindow: (_:?Event) => void
  = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const xLength = screenWidth / 30;
    const yLength = screenWidth / 30;
    const emotionTable =
      range(0, yLength).map(() => range(0, xLength).map(() => 0));
    this.setState({
      ...this.state,
      screenWidth,
      screenHeight,
      emotionTable,
    });
  };

  addGazeListener: (_:string) => (_:GazeCallback) => App
  = key => callback => {
    this.gazeListenerKVS[key] = callback;
    return this;
  };

  removeGazeListener: (_:string) => void
  = key => {
    if (this.gazeListenerKVS[key]) delete this.gazeListenerKVS[key];
  };

  startWebGazer: (_:void) => Promise<WebGazer>
  = async () => {
    const webgazer = await startWebGazer();
    // showAdjuster(webgazer);
    const clm = webgazer.getTracker().clm;
    webgazer.setGazeListener(data => {
      const position = clm.getCurrentPosition();
      Object.values(this.gazeListenerKVS)
      .forEach(callback => (callback: any)({ // TODO: any
        gaze: data,
        clm: position ? { position } : null,
      }));
    });
    return webgazer;
  };

  test: (_:WebGazer) => void
  = webgazer => {
    console.log(webgazer);
    /*
    const clm = webgazer.getTracker().clm;
    const xss = [];
    const yss = [];
    webgazer.setGazeListener(() => {
      const position = clm.getCurrentPosition();
      xss.push(calcEmotionParameter(position));
      yss.push([1, 0]);
      if (xss.length >= 10) {
        console.log(JSON.stringify(xss));
        webgazer.clearGazeListener();
        const model = train(xss)(yss);
        console.log(model);
      }
    });
    */
  };

  render = () => {
    const {
      webgazer,
      emotionPredictions,
      screenWidth,
      screenHeight,
      xLength,
      yLength,
      emotionTable,
    } = this.state;
    return (
      <div>
        <EmotionGraph predictions={emotionPredictions || []} />
        <EmotionDistribute
          width={screenWidth}
          height={screenHeight}
          xLength={xLength}
          yLength={yLength}
          data={emotionTable}
        />
        <button onClick={() => this.test(webgazer)}>test</button>
      </div>
    );
  };
}

export default App;
