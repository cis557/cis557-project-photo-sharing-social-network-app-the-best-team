/* globals btoa */

import React, { Component } from 'react';
import NavBar from './NavBar';
import { getUser } from '../javascripts/userRequests';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      isLoading: true,
    };
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

  render() {
    const { data, isLoading } = this.state;
    if (isLoading) {
      return (
        <div className="uk-cover-container uk-flex uk-flex-center uk-flex-middle">
          <h1>Wait a Sec...</h1>
        </div>
      );
    }

    let src = '';

    try {
      src = `data:image/png;base64,${btoa(String.fromCharCode.apply(null, data.image.data))}`;
    } catch (err) {
      src = '';
    }

    return (
      <div>
        <NavBar />
        <div className="uk-flex uk-flex-center uk-background-default">
          <div className="uk-container uk-container-small">
            <div className="uk-grid uk-margin-medium-bottom" uk-grid="true">
              <div className="uk-width-1-3 uk-flex uk-flex-middle uk-flex-center">
                <img className="uk-border-pill" style={{ maxHeight: '150px', maxWidth: '150px' }} id="profile-image" src={src} alt="" />
              </div>
              <div className="uk-section uk-section-default uk-padding-small uk-margin-left">
                <div className="uk-flex uk-margin-small-bottom uk-flex-row uk-flex-middle">
                  <h1 id="username" className="uk-text-light uk-margin-remove uk-heading-xsmall">{data.username}</h1>
                  <a className="uk-button uk-button-default uk-margin-left" style={{ height: '40px' }} href="/makePost">Create Post</a>
                </div>
                <ul className="uk-margin-remove" style={{ padding: '0px', listStyleType: 'none' }}>
                  <li className="uk-text-bold uk-margin-bottom uk-margin-right uk-float-left">
                    <span id="posts" className="uk-text-light">
                      posts:
                      {' '}
                      {data.posts.length}
                    </span>
                  </li>
                  <li className="uk-text-bold uk-margin-bottom uk-margin-left uk-margin-right uk-float-left">
                    <span id="followers" className="uk-text-light">
                      followers:
                      {' '}
                      <a href="/follower">{data.followers.length}</a>
                    </span>
                  </li>
                  <li className="uk-text-bold uk-margin-bottom uk-margin-left uk-float-left">
                    <span id="following" className="uk-text-light">
                      following:
                      {' '}
                      <a href="/followee">{data.followees.length}</a>
                    </span>
                  </li>
                </ul>
                <div className="uk-flex uk-flex-row uk-flex-middle uk-flex-center" />
                <p id="name" className="uk-text-light" />
              </div>
              <div className="uk-container uk-container-small uk-margin-top">
                <div id="recentPost" className="uk-child-width-1-2@m uk-align-center uk-background-default">
                  {/* The most recent post will be added here. */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
