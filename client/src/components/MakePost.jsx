import React, { Component } from 'react';
import { addPost } from '../javascripts/postRequests';
import NavBar from './NavBar';

class MakePost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      privacy: 'public',
      image: null,
      tags: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleFileChange(event) {
    this.setState({ image: event.target.files[0] });
  }

  handlePrivacyChange(event) {
    this.setState({ privacy: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const {
      title,
      description,
      privacy,
      image,
      tags,
    } = this.state;

    addPost(title, description, privacy, image, tags)
      .then((res) => {
        if (res.ok) {
          this.props.history.push('/');
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <NavBar />
        <div className="uk-cover-container uk-flex uk-flex-center uk-flex-middle">
          <form onSubmit={this.handleSubmit}>
            <fieldset className="uk-fieldset">
              <h2>Create Post</h2>
              <div className="">
                <input onChange={this.handleChange} id="title" className="uk-input" type="text" placeholder="Title" />
              </div>
              <div className="uk-margin">
                <textarea onChange={this.handleChange} className="uk-textarea" id="description" rows="5" placeholder="Description" />
              </div>
              <div className="uk-margin">
                <textarea onChange={this.handleChange} className="uk-textarea" id="tags" rows="1" placeholder="Tags (separated by commas)" />
              </div>
              <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                <label htmlFor="radio1">
                  <input onChange={this.handlePrivacyChange} className="uk-radio" type="radio" name="radio" value="public" checked />
                  Public
                </label>
                <label htmlFor="radio2">
                  <input onChange={this.handlePrivacyChange} className="uk-radio" type="radio" name="radio" value="private" />
                  Private
                </label>
              </div>
              <div className="uk-margin">
                <label htmlFor="image" className="uk-form-label uk-text-large">
                  Select an image to upload:
                  <input onChange={this.handleFileChange} id="image" className="uk-input uk-form-width-xxlarge" type="file" name="image" accept="image/*" />
                </label>
              </div>
              <input type="submit" className="uk-button-primary uk-button-large uk-text-large" value="Upload" />
              <a className="uk-margin-top uk-margin-left uk-button-danger uk-button-large uk-text-large" href="/" value="Upload">Cancel</a>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}


export default MakePost;
