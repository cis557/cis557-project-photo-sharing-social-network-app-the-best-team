/* globals fetch */
import React, { Component } from 'react';
import { api } from '../api';
import PropTypes from 'prop-types';
import { addComment, editComment, deleteComment} from '../javascripts/commentRequests';

//function used to do the spliting, move the the backend

// let stringToArray = function(s){
//   const res = s.split(",")
//   return res
// }

// const testData = {
//     postID: 'abcd',
//     comments: [{
//       mentions: ['Jeff'],
//       username: 'Nick1',
//       text: "I like it!"
//     },{
//       mentions: ['Jack'],
//       username: 'Nick2',
//       text: "I love it!"
//     }]
//   };

class Comment extends Component {
  constructor(props) {
    super(props);
    
    this.state = { 
      data: null,
      isLoading: true,
      currentUser: null,
    };
  }

render() {
  const {data} = this.state;
    const comments = data.comments.map((comment) => { return(
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
  )});
    return (
    <div className="uk-container uk-container-small">

    </div>
    );
  }
}

Comment.propTypes = {
  postid: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default Comment;
