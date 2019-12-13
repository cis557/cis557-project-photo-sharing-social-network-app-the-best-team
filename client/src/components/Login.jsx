/* globals */

import React, { Component } from 'react';
import { rgba } from 'polished';
import { login } from '../javascripts/authRequests';
import image from '../images/slide-5.jpg';
import '../stylesheets/auth-pages.css';
import logo from '../images/photogram.png';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      message: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    // eslint-disable-next-line react/prop-types
    const { history } = this.props;

    const { email } = this.state;
    const { password } = this.state;

    login(email, password)
      .then((res) => {
        if (res.ok) {
          // eslint-disable-next-line react/prop-types
          history.push('/');
        } else {
          // TODO: Don't hardcode this message.
          this.setState({ message: '[!] Invalid credentials' });
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
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="uk-border-rounded uk-width-large uk-padding-large uk-position-z-index" uk-scrollspy="cls: uk-animation-fade" style={{ backgroundColor: rgba(0, 0, 0, 0.4) }}>
          <div className="uk-text-center uk-margin">
            <img src={logo} alt="Logo" />
          </div>
          <h4 className="uk-heading-line uk-text-center" style={{ color: rgba(255, 255, 255, 0.8) }}><span>Log In</span></h4>
          <form onSubmit={this.handleSubmit} className="toggle-class">
            <fieldset className="uk-fieldset">
              <div className="uk-margin-small">
                <div className="uk-inline uk-width-1-1">
                  <span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: mail" />
                  <input onChange={this.handleChange} id="email" name="email" className="uk-input uk-border-pill" placeholder="Email" type="email" required />
                </div>
              </div>
              <div className="uk-margin-small">
                <div className="uk-inline uk-width-1-1">
                  <span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: lock" />
                  <input onChange={this.handleChange} id="password" name="password" className="uk-input uk-border-pill" placeholder="Password" type="password" required />
                </div>
              </div>
              <div className="uk-margin-bottom" style={{ textAlign: 'center' }}>
                {message}
                <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-1-1" id="submit">Login</button>
                <p>
                  Don&apos;t have an account?
                  &nbsp;
                  <a href="/register" id="register" className="uk-position-relative">Register.</a>
                </p>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
