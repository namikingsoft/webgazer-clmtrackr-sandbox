// @flow
import React, { Component } from 'react';
import EmotionGraph from 'components/EmotionGraph';
import EmotionDistribute from 'components/EmotionDistribute';
import { EmotionClassifier } from 'utils/clmtrackr';
import emotionModel from 'fixtures/emotion-model';
import type { WebGazer } from 'types/webgazer';
import type { EmotionPrediction } from 'types/clmtrackr';
import { startWebGazer, showAdjuster } from 'utils/webgazer';

class App extends Component {
  state: {
    webgazer?: WebGazer;
    emotionPrediction?: EmotionPrediction,
    screenWidth?: number,
    screenHeight?: number,
  } = {};

  componentWillMount = () => {
    this.startWebGazer().then(webgazer => this.setState({ webgazer }));
    window.removeEventListener('resize', () => {
    });
  };

  componentWillUnmount = () => {
  };

  startWebGazer: (_:void) => Promise<WebGazer>
  = async () => {
    const webgazer = await startWebGazer();
    showAdjuster(webgazer);
    const clm = webgazer.getTracker().clm;
    const classifier = new EmotionClassifier(emotionModel);
    webgazer.setGazeListener(() => {
      const parameters = clm.getCurrentParameters();
      this.setState({
        emotionPrediction: classifier.predictMean(parameters),
      });
    });
    return webgazer;
  };

  debugParameter: (_:Event) => (_:WebGazer) => void
  = () => webgazer => {
    const clm = webgazer.getTracker().clm;
    console.log(clm.getCurrentParameters());
  };

  render = () => {
    const { webgazer, emotionPrediction } = this.state;
    return (
      <div>
        <EmotionGraph prediction={emotionPrediction || []} />
        <EmotionDistribute xLength={100} yLength={100} />
        <button onClick={e => this.debugParameter(e)(webgazer)}>test</button>
      </div>
    );
  };
}

export default App;
