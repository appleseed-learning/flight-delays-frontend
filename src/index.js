import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();