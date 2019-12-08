/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as clearHeart } from '@fortawesome/free-regular-svg-icons';
import { addLike, deleteLike } from '../javascripts/likeRequests';
import '../stylesheets/heart-style.css';


class Heart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postId: props.postId,
      liked: props.isLiked,
    };

    this.handleEvent = this.handleEvent.bind(this);
  }

  handleEvent(e) {
    e.preventDefault();

    const { postId, liked } = this.state;

    if (liked) {
      deleteLike(postId)
        .then(() => {
          this.setState({ liked: false });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      addLike(postId)
        .then(() => {
          this.setState({ liked: true });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  render() {
    const { liked } = this.state;

    if (liked) {
      return (
        <FontAwesomeIcon className="liked" onClick={this.handleEvent} icon={solidHeart} />
      );
    }

    return (
      <FontAwesomeIcon className="not-liked" onClick={this.handleEvent} icon={clearHeart} />
    );
  }
}

Heart.propTypes = {
  postId: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
};

export default Heart;
