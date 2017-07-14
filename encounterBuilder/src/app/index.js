import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './containers/app'

injectTapEventPlugin();

render(
  <App />,
  document.getElementById('app')
)