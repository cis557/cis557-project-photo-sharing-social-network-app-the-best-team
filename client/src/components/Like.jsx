import React, { Component } from 'react';
import NavBar from './NavBar';
import Post from './Post';
import { getUser } from '../javascripts/userRequests';
import { getLikes } from '../javascripts/postRequests';

class Like extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: '',
      isLoading: true,
      posts: [],
    };
  }

  componentDidMount() {
    getUser()
      .then((res) => {
        res.json()
          .then((usr) => {
            getLikes()
              .then((feed) => {
                feed.json()
                  .then((posts) => {
                    this.setState({ currentUser: usr.username, posts, isLoading: false });
                  });
              });
          })
          .catch(() => {});
      })
      .catch(() => {});
  }

  render() {
    const { isLoading, posts, currentUser } = this.state;

    const renderPosts = [];

    posts.forEach((id) => {
      renderPosts.push(<Post key={id} postId={id} currentUser={currentUser} />);
    });

    if (isLoading) {
      return (
        <div>
          <NavBar />
          <div className="uk-container uk-container-small">
            <div id="cards" className="uk-child-width-1-2@m uk-align-center uk-background-default">
              LOADING
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <NavBar />
        <div className="uk-container uk-container-small">
          <div id="cards" className="uk-child-width-1-2@m uk-align-center uk-background-default">
            {renderPosts}
          </div>
        </div>
      </div>
    );
  }
}

export default Like;
