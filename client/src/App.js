// App.js is the root of our website, it is where all the different
// components come together and work as a whole entity

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Registration} />
        </div>
      </Router>
    );
  }
}

export default App;