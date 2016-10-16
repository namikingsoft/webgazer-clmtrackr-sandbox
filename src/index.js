// @flow
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import App from 'containers/App';
import {
  startWebGazer,
  showAdjuster,
} from 'utils/webgazer';

(async () => {
  const webgazer = await startWebGazer();
  showAdjuster(webgazer);
  ReactDOM.render(
    <App webgazer={webgazer} />,
    document.body.appendChild(
      document.createElement('div')
    ),
  );
})();
