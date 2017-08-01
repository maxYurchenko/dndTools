import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './containers/app';
import Prepare from './components/Prepare';
import Battle from './components/Battle';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';

render((
	<App />
), document.getElementById('app'))