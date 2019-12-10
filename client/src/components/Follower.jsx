/* globals */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavBar from './NavBar';
import { getUser } from '../javascripts/userRequests';

class Follower extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      isLoading: true,
      currentUser: null,
    };
  }

  componentDidMount() {
    getUser()
      .then((data) => {
        data.json()
          .then((userInfo) => {
            this.setState({ data: userInfo, isLoading: false });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { data, isLoading } = this.state;
    if (isLoading) {
      return (
        <div className="uk-cover-container uk-flex uk-flex-center uk-flex-middle">
          <h1>Wait a Sec...</h1>
        </div>
      );
    }

    const followers = data.followers.map((follower) => (
      <div className="uk-card uk-card-default uk-card-hover uk-align-center" uk-scrollspy="cls: uk-animation-slide-left; repeat: true">
        <div className="uk-card uk-card-primary uk-card-body uk-card-hover uk-margin-top">
          <h3 className="uk-card-title"><a href="">{follower}</a></h3>
          <span>
            <p>
              You are currently followed by
              {' '}
              {follower}
              !
            </p>
            {' '}
            <button className="uk-button uk-button-danger">Follow</button>
          </span>
        </div>
      </div>
    ));
    return (
      <div>
        <NavBar />
        <div className="uk-container uk-container-small">
          <div id="cards" className="uk-child-width-1-2@m uk-align-center uk-background-default">
            <div className="uk-card uk-card-default uk-card-hover uk-align-center" uk-scrollspy="cls: uk-animation-slide-left; repeat: true">
              {followers}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Follower.propTypes = {
  currentUser: PropTypes.bool.isRequired,
};

export default Follower;
