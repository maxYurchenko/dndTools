import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './containers/app';
import { BrowserRouter } from 'react-router-dom';

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('app'))