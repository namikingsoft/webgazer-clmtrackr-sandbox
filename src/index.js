// @flow
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import App from 'containers/App';

(async () => {
  ReactDOM.render(
    <App />,
    document.body.appendChild(
      document.createElement('div')
    ),
  );
})();
