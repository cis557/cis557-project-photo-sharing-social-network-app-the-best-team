import React, { Component } from 'react';
import { rgba } from 'polished'
import { api } from '../api.js'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: ''  };
  }

  callAPI() {
    fetch(`${api.url}/testAPI`)
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }))
      .catch(err => err);
  }

  componentDidMount() {
    this.callAPI();
  }

  render() {
    return (
          <div className="uk-border-rounded uk-width-large uk-padding-large uk-position-z-index" uk-scrollspy="cls: uk-animation-fade" style={{backgroundColor: rgba(253, 253, 253, 0.253)}}>
            <div className="uk-text-center uk-margin">
              <img src={require('../images/photogram.png')} alt="Logo"></img>
            </div>
            <h4 className="uk-heading-line uk-text-center" style={{color: rgba(255, 255, 255, .8)}}><span>Log In</span></h4>
            <form action={api.url + "/login"} method="POST" className="toggle-class">
              <fieldset className="uk-fieldset">
                <div className="uk-margin-small">
                  <div className="uk-inline uk-width-1-1">
                    <span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: mail"></span>
                    <input id="email" name="email" className="uk-input uk-border-pill" placeholder="Email" type="email" required></input>
                  </div>
                </div>
                <div className="uk-margin-small">
                  <div className="uk-inline uk-width-1-1">
                    <span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: lock"></span>
                    <input id="password" name="password" className="uk-input uk-border-pill" placeholder="Password" type="password" required></input>
                  </div>
                </div>
                <div className="uk-margin-bottom" style={{textAlign: "center"}}>
                  <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-1-1" id="submit">Login</button>
                  <p>Don't have an account? <a href="/register" id="register" className="uk-position-relative">Register.</a></p> 
                </div>
              </fieldset>
            </form>
          </div>
    );
  }
}

export default Login;