import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'uikit/dist/css/uikit.min.css';
import 'uikit/dist/js/uikit.min.js';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GoogleAnalytics from './system/GoogleAnalytics';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleAnalytics />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('styleupeasy-page-wrapper')
);

reportWebVitals();
