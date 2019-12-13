/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* globals */

import React, { Component } from 'react';
import NavBar from './NavBar';
import { getSuggestedUsers, getUser } from '../javascripts/userRequests';
import { follow } from '../javascripts/followRequests';

class Follow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      currentUser: null,
      isLoading: true,
    };

    this.handleFollow = this.handleFollow.bind(this);
  }

  componentDidMount() {
    getUser()
      .then((data) => {
        data.json()
          .then((userInfo) => {
            this.setState({ currentUser: userInfo });
          })
          .catch(() => {});
      })
      .catch(() => {})
      .then(() => {
        getSuggestedUsers()
          .then((data) => {
            data.json()
              .then((usersInfo) => {
                this.setState({ data: usersInfo, isLoading: false });
              })
              .catch(() => {});
          })
          .catch(() => {});
      });
  }

  handleFollow(event) {
    event.preventDefault();
    const usernameB = event.target.id;
    follow(usernameB)
      .then((res) => {
        if (res.ok) {
          this.props.history.push('/profile');
        }
      })
      .catch(() => {});
  }

  render() {
    const { data, isLoading, currentUser } = this.state;

    if (isLoading) {
      return (
        <div className="uk-cover-container uk-flex uk-flex-center uk-flex-middle">
          <h1>Wait a Sec...</h1>
        </div>
      );
    }

    let key = 0;

    const recommends = data.map((name) => {
      if (name !== currentUser.username) {
        const content = (
          <div key={key} className="uk-card uk-card-default uk-card-hover uk-align-center" uk-scrollspy="class: uk-animation-slide-left; repeat: true">
            <div className="uk-card uk-card-primary uk-card-body uk-card-hover uk-margin-top">
              <h3 className="uk-card-title"><a href={`/profile/${name}`}>{name}</a></h3>
              <span>
                <p>
                  Follow
                  {' '}
                  {name}
                  {' '}
                  to see their posts in your feed!
                </p>
                {' '}
                <button id={name} type="button" value={currentUser.username} onClick={this.handleFollow} className="uk-button uk-button-danger">Follow</button>
              </span>
            </div>
          </div>
        );

        key += 1;

        return content;
      }

      return '';
    });

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

export default Follow;
