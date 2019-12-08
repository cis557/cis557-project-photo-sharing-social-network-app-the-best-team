/* globals */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addComment, editComment, deleteComment } from '../javascripts/commentRequests';

// function used to do the splitting, move the the backend

class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postId: props.postId,
      commentId: props.commentId,
      username: props.username,
      datetime: props.datetime,
      text: props.text,
    };
  }

  componentDidMount() {}

  render() {
    const { username, text } = this.state;

    return (
      <article className="uk-comment-primary uk-visible-toggle uk-box-shadow-hover-small" tabIndex="-1">
        <header className="uk-comment-header uk-position-relative">
          <div className="uk-grid-medium uk-flex-middle" uk-grid="true">
            <div className="uk-width-expand">
              <h5 className="uk-comment-title uk-margin-remove"><a className="uk-link" href="#">{username}</a></h5>
            </div>
          </div>
          <div className="uk-position-top-right uk-position-small uk-hidden-hover"><a className="uk-link-muted" href="#">Delete</a></div>
        </header>
        <div className="uk-comment-body">
          <p className="uk-text-large">{text}</p>
        </div>
      </article>
    );
  }
}


Comment.propTypes = {
  postId: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  datetime: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default Comment;
