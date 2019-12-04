// App.js is the root of our website, it is where all the different
// components come together and work as a whole entity

import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './Login';
import Feed from './Feed';
import Profile from './Profile';
import Register from './Register';
import MakePost from './MakePost';
import Comments from './Comments';
import Follow from './Follow';
import Followee from './Followee';
import Follower from './Follower';
import RouteProtector from './RouteProtector';
import RouteVerifier from './RouteVerifier';


class App extends PureComponent {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/login" component={RouteVerifier(Login)} />
          <Route exact path="/makePost" component={RouteProtector(MakePost)} />
          <Route exact path="/" component={RouteProtector(Feed)} />
          <Route exact path="/profile" component={RouteProtector(Profile)} />
          <Route exact path="/comments" component={RouteProtector(Comments)} />
          <Route exact path="/register" component={RouteVerifier(Register)} />
          <Route exact path="/follow" component={RouteProtector(Follow)} />
          <Route exact path="/followee" component={RouteProtector(Followee)} />
          <Route exact path="/follower" component={RouteProtector(Follower)} />
        </div>
      </Router>
    );
  }
}

export default App;
