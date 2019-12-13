/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as clearHeart } from '@fortawesome/free-regular-svg-icons';
import { addLike, deleteLike } from '../javascripts/likeRequests';
import { getPost } from '../javascripts/postRequests';
import '../stylesheets/heart-style.css';

class Heart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postId: props.postId,
      liked: props.isLiked,
      likes: props.likes,
    };

    this.handleEvent = this.handleEvent.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.refresh();
  }

  refreshPage() {
    window.location.reload(false);
  }

  refresh() {
    const { postId } = this.state;

    getPost(postId)
      .then((data) => {
        data.json()
          .then((post) => {
            // eslint-disable-next-line react/no-unused-state
            this.setState({ isLoading: false, data: post.likes });
          })
          .catch(() => {});
      })
      .catch(() => {});
  }

  handleEvent(e) {
    e.preventDefault();

    const { postId, liked } = this.state;

    if (liked) {
      deleteLike(postId)
        .then(() => {
          this.setState({ liked: false });
          window.location.reload(false);
        })
        .catch(() => {});
    } else {
      addLike(postId)
        .then(() => {
          this.setState({ liked: true });
          window.location.reload(false);
        })
        .catch(() => {});
    }
  }

  render() {
    const { liked, likes } = this.state;
    if (liked) {
      return (
        <p>
          <FontAwesomeIcon className="liked" onClick={this.handleEvent} icon={solidHeart} />
          {' '}
          :
          {' '}
          {likes.length}
        </p>

      );
    }
    return (
      <p>
        <FontAwesomeIcon className="not-liked" onClick={this.handleEvent} icon={clearHeart} />
        {' '}
        :
        {' '}
        {likes.length}
      </p>
    );
  }
}

Heart.propTypes = {
  postId: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  likes: PropTypes.array.isRequired,
};

export default Heart;
