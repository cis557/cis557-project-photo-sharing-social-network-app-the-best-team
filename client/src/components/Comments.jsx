/* globals fetch */
import React, { Component } from 'react';
import { api } from '../api';
import PropTypes from 'prop-types';
import { addComment, editComment, deleteComment} from '../javascripts/commentRequests';
import { getPost } from '../javascripts/postRequests';

//function used to do the spliting, move the the backend

class Comment extends Component {
  constructor(props) {
    super(props);
    
    this.state = { 
      postid: props.postid,
      commentid: props.commentid,
      data: null,
      isLoading: true,
      currentUser: props.currentUser,
    };
  }

  componentDidMount() {
    const { postid } = this.state;

    getPost(postid)
      .then((data) => {
        data.json()
          .then((post) => {
            this.setState({ isLoading: false, data: post.comments });
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
  const {data, commentid } = this.state;
  const comments = data.comments.map((comment) => { 
    if(comment._id == commentid){
      return(
        <article className="uk-comment-primary uk-visible-toggle uk-box-shadow-hover-small" tabindex="-1">
          <header className="uk-comment-header uk-position-relative">
              <div className="uk-grid-medium uk-flex-middle" uk-grid>
                  <div className="uk-width-expand">
                      <h5 className="uk-comment-title uk-margin-remove"><a class="uk-link" href="#">{comment.username}</a></h5>
                  </div>
              </div>
              <div class="uk-position-top-right uk-position-small uk-hidden-hover"><a class="uk-link-muted" href="#">Delete</a></div>  
          </header>
        <div className="uk-comment-body">
      <p className = "uk-text-large">{comment.text}</p>
    </div>
  </article>
    )};
  })    
  return(
    <div></div>
    )
  }
}


Comment.propTypes = {
  postid: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default Comment;
