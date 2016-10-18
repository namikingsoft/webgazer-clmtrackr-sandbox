// @flow
import React, { Component } from 'react';
import { range } from 'ramda';
import EmotionGraph from 'components/EmotionGraph';
import EmotionDistribute from 'components/EmotionDistribute';
import UserInterface from 'components/UserInterface';
import { predictEmotions, scoreEmotions } from 'utils/emotion';
import { startWebGazer, showAdjuster, hideAdjuster } from 'utils/webgazer';
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
    emotionPredictions: Array<EmotionPrediction>,
    emotionTable: Array<Array<number>>,
    screenWidth: number,
    screenHeight: number,
    xLength: number,
    yLength: number,
  } = {
    emotionPredictions: [],
    emotionTable: [[]],
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    xLength: 1,
    yLength: 1,
  };

  gazeListenerKVS: { [index: string]: GazeCallback } = {};

  componentWillMount = () => {
    this.startWebGazer().then(webgazer => this.setState({ webgazer }));
    this.addGazeListener('EmotionGraph')(({ gaze, clm }) => {
      let emotionPredictions = [];
      const emotionTable = this.state.emotionTable;
      if (clm) {
        emotionPredictions = predictEmotions(clm.position);
      }
      if (gaze) {
        const [x, y] = this.convertTablePoint(gaze.x, gaze.y);
        const score = scoreEmotions(emotionPredictions);
        if (emotionTable) {
          /* eslint-disable */ // TODO
          if (emotionTable[x]) {
            if (emotionTable[x][y] !== undefined)
              emotionTable[x][y] += score;
            if (emotionTable[x][y-1] !== undefined)
              emotionTable[x][y-1] += score;
            if (emotionTable[x][y+1] !== undefined)
              emotionTable[x][y+1] += score;
          }
          if (emotionTable[x-1]) {
            if (emotionTable[x-1][y] !== undefined)
              emotionTable[x-1][y] += score;
            if (emotionTable[x-1][y-1] !== undefined)
              emotionTable[x-1][y-1] += score;
            if (emotionTable[x-1][y+1] !== undefined)
              emotionTable[x-1][y+1] += score;
          }
          if (emotionTable[x+1]) {
            if (emotionTable[x+1][y] !== undefined)
              emotionTable[x+1][y] += score;
            if (emotionTable[x+1][y-1] !== undefined)
              emotionTable[x+1][y-1] += score;
            if (emotionTable[x+1][y+1] !== undefined)
              emotionTable[x+1][y+1] += score;
          }
          /* eslint-enable */
        }
      }
      this.setState({
        ...this.state,
        emotionTable,
        emotionPredictions,
      });
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
      xLength,
      yLength,
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
    showAdjuster(webgazer);
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

  handleTrace: (_:WebGazer) => void
  = webgazer => {
    const clm = webgazer.getTracker().clm;
    const positions = [];
    this.addGazeListener('Test')(() => {
      const position = clm.getCurrentPosition();
      positions.push(position);
      if (positions.length >= 10) {
        console.log(JSON.stringify(positions));
        this.removeGazeListener('Test');
      }
    });
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
          data={emotionTable.map(xs => xs.map(x => Math.floor(x)))}
        />
        <UserInterface
          onShow={() => showAdjuster(webgazer)}
          onHide={() => hideAdjuster(webgazer)}
          onTrace={() => this.handleTrace(webgazer)}
        />
      </div>
    );
  };
}

export default App;
