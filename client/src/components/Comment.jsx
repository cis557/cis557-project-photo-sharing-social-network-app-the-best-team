/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* globals */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { editComment, deleteComment } from '../javascripts/commentRequests';

class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postId: props.postId,
      commentId: props.commentId,
      username: props.username,
      text: props.text,
      currentUser: props.currentUser,
      deleted: false,
      editing: false,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEditText = this.handleEditText.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleDelete(event) {
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
      .catch(() => {});
    this.setState({ deleted: true });
  }

  handleEdit(event) {
    event.preventDefault();

    const { textUpdate } = this.state;
    const { commentId } = this.state;
    const { postId } = this.state;

    editComment(
      postId,
      commentId,
      textUpdate,
    )
      .then(() => {
        this.refresh();
      })
      .catch(() => {});
    this.setState({ editing: false });
    this.setState({ text: textUpdate });
  }

  handleEditText(event) {
    event.preventDefault();

    this.setState({ editing: true });
    this.render();
  }

  render() {
    const {
      username,
      text,
      deleted,
      editing,
      currentUser,
    } = this.state;

    if (!deleted && !editing) {
      if (currentUser === username) {
        return (
          <article className="uk-comment-primary uk-visible-toggle uk-box-shadow-hover-small" tabIndex="-1">
            <header className="uk-comment-header uk-position-relative">
              <div className="uk-margin-top uk-position-bottom-right uk-position-small uk-hidden-hover"><a className="uk-link-muted" uk-icon="icon: close" onClick={this.handleDelete} /></div>
              <div className="uk-grid-medium uk-flex-middle" uk-grid="true">
                <div className="uk-width-expand">
                  <h5 className="uk-comment-title uk-margin-remove"><a className="uk-link" href={`/profile/${username}`}>{username}</a></h5>
                </div>
              </div>
              <div className="uk-position-top-right uk-position-small uk-hidden-hover"><a className="uk-link-muted" uk-icon="icon: pencil" onClick={this.handleEditText}>Edit</a></div>
            </header>
            <div className="uk-comment-body">
              <p className="uk-text-large">{text}</p>
            </div>
          </article>
        );
      }

      return (
        <article className="uk-comment-primary uk-visible-toggle uk-box-shadow-hover-small" tabIndex="-1">
          <header className="uk-comment-header uk-position-relative">
            <div className="uk-grid-medium uk-flex-middle" uk-grid="true">
              <div className="uk-width-expand">
                <h5 className="uk-comment-title uk-margin-remove"><a className="uk-link" href={`/profile/${username}`}>{username}</a></h5>
              </div>
            </div>
          </header>
          <div className="uk-comment-body">
            <p className="uk-text-large">{text}</p>
          </div>
        </article>
      );
    }

    if (editing) {
      return (
        <article className="uk-comment-primary uk-visible-toggle uk-box-shadow-hover-small" tabIndex="-1">
          <header className="uk-comment-header uk-position-relative">
            <div className="uk-grid-medium uk-flex-middle" uk-grid="true">
              <div className="uk-width-expand">
                <h5 className="uk-comment-title uk-margin-remove"><a className="uk-link" href={`/profile/${username}`}>{username}</a></h5>
              </div>
            </div>
          </header>
          <form onSubmit={this.handleEdit}>
            <textarea id="textUpdate" onChange={this.handleChange} className="uk-textarea" rows="4" placeholder={text} />
            <button type="submit" className="uk-button uk-button-primary uk-border uk-width-1-1" id="update">Update</button>
          </form>
        </article>
      );
    }

    return (
      <div />
    );
  }
}


Comment.propTypes = {
  postId: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default Comment;
