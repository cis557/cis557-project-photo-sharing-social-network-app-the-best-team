import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import Login from './Login';
import NavBar from './NavBar';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<NavBar />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
