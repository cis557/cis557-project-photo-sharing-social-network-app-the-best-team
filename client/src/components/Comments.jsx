/* globals fetch */
import React, { Component } from 'react';
import { api } from '../api';

//function used to do the spliting, move the the backend

let stringToArray = function(s){
  const res = s.split(",")
  return res
}

const testData = {
    postID: 'abcd',
    comments: [{
      mentions: ['Jeff'],
      username: 'Nick1',
      text: "I like it!"
    },{
      mentions: ['Jack'],
      username: 'Nick2',
      text: "I love it!"
    }]
  };

class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      data: testData,
      apiResponse: '' 
    };

    this.callAPI = this.callAPI.bind(this);
  }

  componentDidMount() {
    this.callAPI();
  }

  callAPI() {
    fetch(`${api.url}/testAPI`)
      .then((res) => res.text())
      .then((res) => this.setState({ apiResponse: res }))
      .catch((err) => err);
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
        <textarea className="uk-textarea" rows="4" placeholder="Reply"></textarea>
        <div className="uk-margin-small">
        <textarea className="uk-textarea" rows="1" placeholder="Mentions (Separated with Commas)"></textarea>
        </div>
        <button type="submit" className="uk-button uk-button-primary uk-border uk-width-1-1" id="submit">Sumbit</button>
        {comments}
      </div>
    );
  }
}

export default Comments;
