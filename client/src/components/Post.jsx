/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Heart from './Heart';
import { getPost, deletePost } from '../javascripts/postRequests';
import loading from '../images/loading-post.svg';
import Comment from './Comment';
import EditPost from './EditPost';
import { addComment } from '../javascripts/commentRequests';
import Profile from './Profile';

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postId: props.postId,
      isLoading: true,
      currentUser: props.currentUser,
      data: {},
      text: '',
      checkingProfile: false,
      message: '',
      isDeleted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.refresh = this.refresh.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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
          .catch(() => {});
      })
      .catch(() => {});
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { text } = this.state;
    const { postId } = this.state;
    const { target } = event;

    addComment(
      postId,
      text,
    )
      .then((res) => {
        if (res.ok) {
          this.refresh();
          target.text.value = '';
        } else {
          res.json().then((json) => {
            this.setState({ message: json });
          });
        }
      })
      .catch(() => {
        this.setState({ message: '[!]' });
      });
  }

  handleDelete() {
    const { postId } = this.state;

    deletePost(postId)
      .then(() => {
        this.setState({ isDeleted: true });
      })
      .catch(() => {});
  }

  render() {
    const {
      data,
      isLoading,
      currentUser,
      checkingProfile,
      isDeleted,
    } = this.state;

    let { message } = this.state;

    if (message !== '') {
      message = (
        <div style={{ textAlign: 'center' }}>
          {message}
          <br />
          <br />
        </div>
      );
    } else {
      message = '';
    }

    let src = '';

    try {
      src = `data:image/png;base64,${btoa(String.fromCharCode.apply(null, data.image.data))}`;
    } catch (err) {
      src = '';
    }

    if (isDeleted) {
      return (<div />);
    }

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

    if (checkingProfile) {
      return (
        <Profile currentUser={data.username} />
      );
    }

    // eslint-disable-next-line no-underscore-dangle
    const postId = data._id;
    let isLiked = false;
    const { description } = data;
    const { tags } = data;
    const { comments } = data;
    const { likes } = data;

    const tagLinks = [];

    if (tags && tags.length > 0) {
      tagLinks.push('Tagged: ');

      tags.forEach((tag) => {
        const url = `/profile/${tag}`;

        tagLinks.push(
          <a href={url}>
            {tag}
            {' '}
          </a>,
        );
      });
    }

    const renderComments = [];

    if (comments) {
      comments.forEach((comment) => {
        renderComments.push(<Comment
          key={comment._id}
          postId={postId}
          commentId={comment._id}
          username={comment.username}
          datetime={comment.datetime}
          text={comment.text}
          currentUser={currentUser}
        />);
      });
    }

    if (likes && likes.indexOf(currentUser) !== -1) {
      isLiked = true;
    }

    if (currentUser !== data.username) {
      return (
        <div className="uk-card uk-card-default uk-card-hover uk-align-center" uk-scrollspy="cls: uk-animation-slide-left; repeat: true">
          <div className="uk-card-header">
            <h3 className="uk-card-title uk-margin-small-top">{data.title}</h3>
          </div>
          <div className="uk-card-media-top">
            <img src={src} alt="" />
          </div>
          <div className="uk-card-body">
            <h3 className="uk-card-title uk-text-small">
              Posted by
              <a href={`/profile/${data.username}`} id={data.username}>{` ${data.username}`}</a>
            </h3>
            <p id="">{description}</p>
            <p id="">{tagLinks}</p>
            <Heart isLiked={isLiked} postId={postId} likes={likes} />
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
        <div className="uk-card-header uk-clearfix">
          <button aria-label="edit" type="button" className="uk-margin-small-top uk-float-right" uk-icon="icon: more-vertical" />
          <div className="uk-text-center uk-padding-small" uk-dropdown="mode: click">
            <ul className="uk-nav uk-dropdown-nav">
              <li><button uk-toggle="target: #edit-component" aria-label="edit" type="button" className="uk-button uk-button-text"> Edit Post </button></li>
              <li className="uk-nav-divider" />
              <li><button onClick={this.handleDelete} aria-label="delete" type="button" className="uk-button uk-button-text" style={{ color: 'red' }}> Delete Post </button></li>
            </ul>
          </div>
          <h3 className="uk-card-title uk-float-left" style={{ marginTop: '2px' }}>
            {data.title}
          </h3>
        </div>
        <div className="uk-card-media-top">
          <img src={src} alt="" />
        </div>
        <div className="uk-card-body">
          <h3 className="uk-card-title uk-text-small">
            Posted by
            <a href={`/profile/${data.username}`}>{` ${data.username}`}</a>
          </h3>
          <p id="">{description}</p>
          <p id="">{tagLinks}</p>
          <Heart isLiked={isLiked} postId={postId} likes={likes} />
        </div>
        {message}
        <form onSubmit={this.handleSubmit}>
          <textarea id="text" onChange={this.handleChange} className="uk-textarea" rows="4" placeholder="Reply" />
          <button type="submit" className="uk-button uk-button-primary uk-border uk-width-1-1" id="submit">Submit</button>
        </form>
        {renderComments}
        <div id="edit-component" uk-modal="true">
          <EditPost id={postId} />
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  postId: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default Post;
