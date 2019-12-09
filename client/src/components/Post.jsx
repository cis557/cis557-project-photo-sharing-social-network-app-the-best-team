/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Heart from './Heart';
import { getPost } from '../javascripts/postRequests';
import loading from '../images/loading-post.svg';
import Comment from './Comment';
import { addComment } from '../javascripts/commentRequests';

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postId: props.postId,
      isLoading: true,
      currentUser: props.currentUser,
      data: {},
      text: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    const { postId } = this.state;

    getPost(postId)
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

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { text } = this.state;
    const { postId } = this.state;

    addComment(
      postId,
      text,
    )
      .then(() => {
        this.refresh();
      })
      .catch((err) => {
        console.log(err);
      });
    event.target.text.value ="";
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
    const postId = data._id;
    let isLiked = false;
    const { comments } = data;
    const { likes } = data;

    // New: Come back
    const renderComments = [];

    comments.forEach((comment) => {
      renderComments.push(<Comment
        key={comment._id}
        postId={postId}
        commentId={comment._id}
        username={comment.username}
        datetime={comment.datetime}
        text={comment.text}
      />);
    });

    // END

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
            <Heart isLiked={isLiked} postId={postId} />
          </div>
          <form onSubmit={this.handleSubmit}>
          <textarea id="text" onChange={this.handleChange} className="uk-textarea" rows="4" placeholder="Reply" />
          <button type="submit" className="uk-button uk-button-primary uk-border uk-width-1-1" id="submit">Submit</button>
          </form>
          {renderComments}
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
          <Heart isLiked={isLiked} postId={postId} />
        </div>
        <form onSubmit={this.handleSubmit}>
          <textarea id="text" onChange={this.handleChange} className="uk-textarea" rows="4" placeholder="Reply" />
          <button type="submit" className="uk-button uk-button-primary uk-border uk-width-1-1" id="submit">Submit</button>
        </form>
        {renderComments}
      </div>
    );
  }
}

Post.propTypes = {
  postId: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default Post;
