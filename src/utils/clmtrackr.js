// @flow
import type { Parameters, EmotionPrediction, EmotionModel } from 'types/clmtrackr';

export class EmotionClassifier {
  model: EmotionModel;
  previousParameters: Array<Parameters>;

  constructor(model: EmotionModel) {
    this.model = model;
    this.previousParameters = [];
  }

  predict: (_:Parameters) => EmotionPrediction
  = parameters => {
    const prediction = [];
    this.model.forEach(emotion => {
      const score = emotion.coefficients.reduce((acc, x, i) =>
        acc + (x * parameters[i + 6]),
        emotion.bias,
      );
      prediction.push({
        emotion: emotion.name,
        value: 1.0 / (1.0 + Math.exp(-score)),
      });
    });
    return prediction;
  };

  predictBlank: (_:void) => EmotionPrediction
  = () => this.model.map(x => ({ emotion: x.name, value: 0.0 }));

  predictMean: (_:Parameters) => EmotionPrediction
  = parameters => {
    const previousParameters = this.previousParameters;
    previousParameters.splice(0, previousParameters.length === 10 ? 1 : 0);
    previousParameters.push(parameters.slice(0));
    if (previousParameters.length > 9) {
      const meanParameters = parameters.map(() => 0);
      previousParameters.forEach((x, i) => {
        parameters.forEach((y, j) => {
          meanParameters[j] += previousParameters[i][j];
        });
      });
      parameters.forEach((x, i) => {
        meanParameters[i] /= 10;
      });
      return this.predict(meanParameters);
    }
    return this.predict(parameters);
  };
}
