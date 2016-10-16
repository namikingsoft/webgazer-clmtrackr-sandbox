// @flow
import React, { Component } from 'react';
import EmotionGraph from 'components/EmotionGraph';
import { EmotionClassifier } from 'utils/clmtrackr';
import emotionModel from 'fixtures/emotion-model';
import type { WebGazer } from 'types/webgazer';
import type { EmotionPrediction } from 'types/clmtrackr';

class App extends Component {
  props: {
    webgazer: WebGazer,
  };
  state: {
    emotionPrediction: EmotionPrediction,
  } = {
    emotionPrediction: [],
  };

  componentWillMount = () => {
    const { webgazer } = this.props;
    const clm = webgazer.getTracker().clm;
    const classifier = new EmotionClassifier(emotionModel);
    webgazer.setGazeListener(() => {
      const parameters = clm.getCurrentParameters();
      this.setState({
        emotionPrediction: classifier.predict(parameters),
      });
    });
  };

  render = () => {
    const { emotionPrediction } = this.state;
    return (
      <div>
        <EmotionGraph prediction={emotionPrediction || []} />
      </div>
    );
  };
}

export default App;
