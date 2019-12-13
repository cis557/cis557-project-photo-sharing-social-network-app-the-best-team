import React, { Component } from 'react';
import { rgba } from 'polished';
import { register } from '../javascripts/authRequests';
import slideImage from '../images/slide-1.jpg';
import logo from '../images/photogram.png';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      image: null,
      message: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleFileChange(event) {
    this.setState({ image: event.target.files[0] });
  }

  handleSubmit(event) {
    event.preventDefault();

    // eslint-disable-next-line react/prop-types
    const { history } = this.props;

    const { firstName } = this.state;
    const { lastName } = this.state;
    const { email } = this.state;
    const { password } = this.state;
    const { username } = this.state;
    const { image } = this.state;

    register(
      firstName,
      lastName,
      email,
      password,
      username,
      image,
    )
      .then((res) => {
        if (res.ok) {
          // eslint-disable-next-line react/prop-types
          history.push('/');
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

  render() {
    let { message } = this.state;

    if (message !== '') {
      message = (
        <div>
          {message}
          <br />
          <br />
        </div>
      );
    } else {
      message = '';
    }

    return (
      <div
        id="slideshow"
        className="uk-cover-container uk-background-secondary uk-flex uk-light uk-flex-center uk-flex-middle uk-height-viewport uk-background-cover"
        data-uk-height-viewport="true"
        style={{ backgroundImage: `url(${slideImage})` }}
      >
        <div className="uk-border-rounded uk-width-large uk-padding-large uk-position-z-index" uk-scrollspy="cls: uk-animation-fade" style={{ backgroundColor: rgba(0, 0, 0, 0.4) }}>
          <div className="uk-text-center uk-margin">
            &nbsp;
            <img src={logo} alt="Logo" />
          </div>
          <h4 className="uk-heading-line uk-text-center" style={{ color: rgba(255, 255, 255, 0.8) }}><span> Registration </span></h4>
          <form onSubmit={this.handleSubmit} className="toggle-class">
            <fieldset className="uk-fieldset">
              <div className="uk-margin-small">
                <div className="uk-inline uk-width-1-1">
                  <span className="uk-form-icon uk-form-icon-flip" />
                  <input onChange={this.handleChange} id="firstName" name="firstName" className="uk-input uk-border-pill" placeholder="First Name" type="text" required />
                </div>
              </div>
              <div className="uk-margin-small">
                <div className="uk-inline uk-width-1-1">
                  <span className="uk-form-icon uk-form-icon-flip" />
                  <input onChange={this.handleChange} id="lastName" name="lastName" className="uk-input uk-border-pill" placeholder="Last Name" type="text" required />
                </div>
              </div>
              <div className="uk-margin-small">
                <div className="uk-inline uk-width-1-1">
                  <span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: mail" />
                  <input onChange={this.handleChange} id="email" name="email" className="uk-input uk-border-pill" placeholder="Email" type="email" required />
                </div>
              </div>
              <div className="uk-margin-small">
                <div className="uk-inline uk-width-1-1">
                  <span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: user" />
                  <input onChange={this.handleChange} id="username" name="username" className="uk-input uk-border-pill" placeholder="Username" type="text" required />
                </div>
              </div>
              <div className="uk-margin-small">
                <div className="uk-inline uk-width-1-1">
                  <span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: lock" />
                  <input onChange={this.handleChange} id="password" name="password" className="uk-input uk-border-pill" placeholder="Password" type="password" required />
                </div>
              </div>
              <div className="uk-margin">
                <div className="uk-inline uk-width-1-1" uk-form-custom="target: true">
                  <input onChange={this.handleFileChange} id="image" name="image" type="file" accept="image/*" />
                  <input className="uk-input uk-border-pill" type="text" placeholder="Select profile image" />
                </div>
              </div>
              <div className="uk-margin-bottom" style={{ textAlign: 'center' }}>
                {message}
                <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-1-1" id="submit">
                  Register
                </button>
                <p>
                  Already have an account?
                  &nbsp;
                  <a href="/login" id="login" className="uk-position-relative">Login.</a>
                </p>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
