/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Heart from './Heart';
import { getPost } from '../javascripts/postRequests';
import loading from '../images/loading-post.svg';

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postid: props.postid,
      isLoading: true,
      currentUser: props.currentUser,
      data: null,
    };
  }

  componentDidMount() {
    const { postid } = this.state;

    getPost(postid)
      .then((data) => {
        data.json()
          .then((post) => {
            this.setState({ isLoading: false, data: post });
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
    const { data, isLoading, currentUser } = this.state;

    if (isLoading) {
      return (
        <div className="uk-card uk-card-default uk-card-hover uk-align-center" uk-scrollspy="cls: uk-animation-slide-left; repeat: true">
          <div className="uk-card-body" />
          <div className="uk-card-media-top uk-flex uk-flex-center">
            <img src={loading} alt="" />
          </div>
          <div className="uk-card-body" />
        </div>
      );
    }

    // eslint-disable-next-line no-underscore-dangle
    const postid = data._id;
    let isLiked = false;
    const { likes } = data;
    if (likes.indexOf(currentUser) !== -1) {
      isLiked = true;
    }

    if (currentUser !== data.username) {
      return (
        <div className="uk-card uk-card-default uk-card-hover uk-align-center" uk-scrollspy="cls: uk-animation-slide-left; repeat: true">
          <div className="uk-card-header">
            <h3 className="uk-card-title uk-margin-small-top">{data.title}</h3>
          </div>
          <div className="uk-card-media-top">
            <img src={`data:image/png;base64,${btoa(String.fromCharCode.apply(null, data.image.data))}`} alt="" />
          </div>
          <div className="uk-card-body">
            <h3 className="uk-card-title uk-text-small">
              Posted by
              <a href="/">{` ${data.username}`}</a>
            </h3>
            <p id="">{data.description}</p>
            <Heart isLiked={isLiked} postid={postid} />
          </div>
        </div>
      );
    }

    return (
      <div className="uk-card uk-card-default uk-card-hover uk-align-center" uk-scrollspy="cls: uk-animation-slide-left; repeat: true">
        <div className="uk-card-header">
          <h3 className="uk-card-title uk-margin-small-top">{data.title}</h3>
        </div>
        <div className="uk-card-media-top">
          <img src={`data:image/png;base64,${btoa(String.fromCharCode.apply(null, data.image.data))}`} alt="" />
        </div>
        <div className="uk-card-body">
          <h3 className="uk-card-title uk-text-small">
            Posted by
            <a href="/">{` ${data.username}`}</a>
          </h3>
          <p id="">{data.description}</p>
          <Heart isLiked={isLiked} postid={postid} />
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  postid: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default Post;
