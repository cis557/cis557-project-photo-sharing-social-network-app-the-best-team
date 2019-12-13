/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* globals btoa */
import React, { Component } from 'react';
import NavBar from './NavBar';
import { getOtherUser, getUser } from '../javascripts/userRequests';
import '../stylesheets/uikit.min.css';
import { unfollow, follow } from '../javascripts/followRequests';

export default class DetailsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      currentUser: '',
      isFollowed: false,
    };

    this.handleFollow = this.handleFollow.bind(this);
    this.handleUnfollow = this.handleUnfollow.bind(this);
  }

  async componentDidMount() {
    const otherUser = this.props.match.params.id;

    const res = await getOtherUser(otherUser);
    const json = await res.json();
    const currentUserInfo = await getUser();
    const currentUserJSON = await currentUserInfo.json();
    const currentUser = currentUserJSON.username;

    if (currentUserJSON.followees.includes(json.username)) {
      this.setState({ isFollowed: true });
    }

    this.setState({ currentUser, data: json });
  }

  async handleFollow() {
    const { data } = this.state;

    follow(data.username)
      .then(() => {
        const otherUser = this.props.match.params.id;
        getOtherUser(otherUser)
          .then((res) => {
            res.json()
              .then((json) => {
                this.setState({ isFollowed: true, data: json });
              });
          });
      })
      .catch(() => {});
  }

  async handleUnfollow() {
    const { data } = this.state;

    unfollow(data.username)
      .then(() => {
        const otherUser = this.props.match.params.id;
        getOtherUser(otherUser)
          .then((res) => {
            res.json()
              .then((json) => {
                this.setState({ isFollowed: false, data: json });
              });
          });
      })
      .catch(() => {});
  }

  render() {
    const { data, currentUser, isFollowed } = this.state;

    let src = '';

    try {
      src = `data:image/png;base64,${btoa(String.fromCharCode.apply(null, data.image.data))}`;
    } catch (err) {
      src = '';
    }

    if (!data || !data.image) {
      return (<div />);
    }
    if (currentUser === data.username) {
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
                        {data.followers.length}
                      </span>
                    </li>
                    <li className="uk-text-bold uk-margin-bottom uk-margin-left uk-float-left">
                      <span id="following" className="uk-text-light">
                        following:
                        {' '}
                        {data.followees.length}
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

    if (isFollowed) {
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
                    <button type="button" onClick={this.handleUnfollow} className="uk-button uk-button-danger uk-margin-left" style={{ height: '40px' }}>
                      Unfollow
                    </button>
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
                        <a href="">{data.followers.length}</a>
                      </span>
                    </li>
                    <li className="uk-text-bold uk-margin-bottom uk-margin-left uk-float-left">
                      <span id="following" className="uk-text-light">
                        following:
                        {' '}
                        <a href="">{data.followees.length}</a>
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
                  <button type="button" onClick={this.handleFollow} className="uk-button uk-button-primary uk-margin-left" style={{ height: '40px' }}>
                    follow
                  </button>
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
                      <a href="">{data.followers.length}</a>
                    </span>
                  </li>
                  <li className="uk-text-bold uk-margin-bottom uk-margin-left uk-float-left">
                    <span id="following" className="uk-text-light">
                      following:
                      {' '}
                      <a href="">{data.followees.length}</a>
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
