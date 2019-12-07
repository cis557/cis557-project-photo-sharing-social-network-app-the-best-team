/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Heart from './Heart';
import { getPost } from '../javascripts/postRequests';
import loading from '../images/loading-post.svg';
import Comment from '../components/Comments';
import { addComment } from '../javascripts/commentRequests';

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postid: props.postid,
      isLoading: true,
      currentUser: props.currentUser,
      data: [],
      text: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event){
    event.preventDefault();

    const { text } = this.state;
    const { postId } = this.state;

    addComment(
      postId,
      text,
      )
      .then((res) => {
        if(res.ok){
          console.log(text);
        } else {
          console.log(res)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  render() {
    const { data, isLoading, currentUser } = this.state;
    console.log(data.comments);
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
    const comments = data.comments;
    const { likes } = data;

    //New: Come back
  //   const renderComments = [];
    
  //   comments.forEach((comment) => {
  //   renderComments.push(<Comment postid={postid} commentid = {comment.comment_id} currentUser = {currentUser}/>);
  // });

    //END

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
          <Heart isLiked={isLiked} postid={postid} />
        </div>
        <form onSubmit={this.handleSubmit}>
        <textarea onChange={this.handleChange} className="uk-textarea" rows="4" placeholder="Reply"></textarea>
        <button type="submit" className="uk-button uk-button-primary uk-border uk-width-1-1" id="submit">Sumbit</button>
      </form>
      </div>
    );
  }
}

Post.propTypes = {
  postid: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default Post;
