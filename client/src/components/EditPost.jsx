/* globals location */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { editPost } from '../javascripts/postRequests';

class EditPost extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props;

    this.state = {
      postId: id,
      newTitle: '',
      newDesc: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { postId, newTitle, newDesc } = this.state;
    await editPost(postId, newTitle, newDesc);
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }

  render() {
    return (
      <div className="uk-modal-dialog uk-modal-body">
        <button aria-label="close" className="uk-modal-close-default" type="button" uk-close="true" />
        <h2 className="uk-modal-title">Editing Post</h2>
        <form onSubmit={this.handleSubmit} className="toggle-class">
          <fieldset className="uk-fieldset">
            <div className="uk-margin">
              <input onChange={this.handleChange} id="newTitle" className="uk-input" type="text" placeholder="New Title" />
            </div>
            <div className="uk-margin">
              <textarea onChange={this.handleChange} id="newDesc" className="uk-textarea" rows="3" placeholder="New Description" />
            </div>
            <div className="uk-margin-bottom">
              <button id="submit" type="submit" className="uk-button uk-button-primary uk-border-pill">Submit</button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}

EditPost.propTypes = {
  id: PropTypes.string.isRequired,
};

export default EditPost;
