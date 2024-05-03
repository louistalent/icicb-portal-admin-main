import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals'

import {configureStore} from '@reduxjs/toolkit';
import { Provider } from 'react-redux'
import {slice} from './useStore'

import './assets/boxicons-2.0.7/css/boxicons.scss'
import './assets/css/grid.scss'
import './assets/css/theme.scss'
import './assets/css/index.scss'

import Layout from './components/Layout'


const store = configureStore({reducer: slice.reducer});

ReactDOM.render(
	<Provider store={store}>
		<React.StrictMode>
			<Layout/>
		</React.StrictMode>
	</Provider>,
	document.getElementById('root')
);

reportWebVitals();