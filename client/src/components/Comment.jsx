/* globals */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { editComment, deleteComment } from '../javascripts/commentRequests';
import { getPost } from '../javascripts/postRequests';

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
      delete: false,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  refresh() {
    }

  componentDidMount() {
  }

  handleDelete(event){
    event.preventDefault();

    const { commentId } = this.state;
    const { postId } = this.state;

    deleteComment(
      postId, 
      commentId,
      ) 
      .then(() => {
        this.refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
          <div className="uk-position-top-right uk-position-small uk-hidden-hover"><a className="uk-link-muted" onClick={this.handleDelete}>Delete</a></div>
          <div className="uk-margin uk-position-bottom-right uk-position-small uk-hidden-hover"><a className="uk-link-muted" onClick={this.handleDelete}>Edit</a></div>
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
