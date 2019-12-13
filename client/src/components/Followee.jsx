/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* globals */

import React, { Component } from 'react';
import NavBar from './NavBar';
import { getUser } from '../javascripts/userRequests';
import { unfollow } from '../javascripts/followRequests';

class Followee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      isLoading: true,
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    getUser()
      .then((data) => {
        data.json()
          .then((userInfo) => {
            this.setState({ data: userInfo, isLoading: false });
          })
          .catch(() => {});
      })
      .catch(() => {});
  }

  handleDelete(event) {
    event.preventDefault();
    const usernameB = event.target.id;
    unfollow(usernameB)
      .then((res) => {
        if (res.ok) {
          this.props.history.push('/profile');
        }
      })
      .catch(() => {});
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

    const recommends = data.followees.map((followee) => (
      <div className="uk-card uk-card-default uk-card-hover uk-align-center" uk-scrollspy="class: uk-animation-slide-left; repeat: true">
        <div className="uk-card uk-card-primary uk-card-body uk-card-hover uk-margin-top">
          <h3 className="uk-card-title"><a href={`/profile/${followee}`}>{followee}</a></h3>
          <span>
            <p>
              You are currently following
              {' '}
              {followee}
              !
            </p>
            {' '}
            <button id={followee} onClick={this.handleDelete} className="uk-button uk-button-danger">Unfollow</button>
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
              {recommends}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Followee;
