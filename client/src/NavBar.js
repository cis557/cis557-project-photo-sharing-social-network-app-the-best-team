import React, { Component } from 'react';
import { api } from './api.js'

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: '' };
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
      <header className="uk-margin-medium-bottom" style={{backgroundColor: "#fff", borderBottom: "1px solid #dbdbdb"}} data-uk-sticky="show-on-up: true; animation: uk-animation-fade">
        <div className="uk-container uk-container-small">
          <nav id="navbar" data-uk-navbar="mode: click;">
            <div className="uk-navbar-left">
              <a className="uk-navbar-item uk-logo" href={api.url + "#/feed"}><img src={require('./images/photogram.png')} alt="Logo" style={{width: "180px", height: "40px"}}></img></a>
            </div>
            <div className="uk-navbar-right">
              <ul className="uk-navbar-nav">
                <li>
                  <a href={api.url + "#/feed"} data-uk-icon="icon:heart"> </a>
                </li>
                <li>
                  <a href={api.url + "#/profile"} data-uk-icon="icon:user"> </a>
                </li>
                <li>
                  <a id="signout" href="#modal-overflow" data-uk-icon="icon:sign-out" uk-toggle="true"> </a>
                  <div id="modal-overflow" uk-modal="true">
                    <div className="uk-modal-dialog">
                      <button className="uk-modal-close-default" type="button" uk-close="true"></button>
                      <div className="uk-modal-header">
                        <h2 className="uk-modal-title">Sign-out</h2>
                      </div>
                      <div className="uk-modal-body" uk-overflow-auto="true">
                        <p className = "uk-text-large">Are you sure you want to log out?</p>
                      </div>
                      <div className="uk-modal-footer uk-text-right">
                        <form action={api.url + "#/logout?_method=DELETE"} method="POST">
                          <button className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                          <button type="submit" className="uk-button uk-button-danger">Log Out</button>
                        </form>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    );
  }
}

export default NavBar;