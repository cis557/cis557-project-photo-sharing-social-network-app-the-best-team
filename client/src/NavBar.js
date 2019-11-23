import React, { Component } from 'react';
import './stylesheets/uikit.min.css';
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
      <header class="uk-margin-medium-bottom" style={{backgroundColor: "#fff", borderBottom: "1px solid #dbdbdb"}} data-uk-sticky="show-on-up: true; animation: uk-animation-fade">
        <div class="uk-container uk-container-small">
          <nav id="navbar" data-uk-navbar="mode: click;">
            <div class="uk-navbar-left">
              <a class="uk-navbar-item uk-logo" href="/feed"><img src="images/photogram.png" alt="Logo" style="width: 180px; height: 40px"></img></a>
            </div>
            <div class="uk-navbar-center">
              <ul class="uk-navbar-nav">
                <li>
                  <form class="uk-search uk-search-default">
                    <span class="uk-search-icon-flip" uk-search-icon></span>
                    <input class="uk-border-rounded uk-search-input" type="search" placeholder="Search..."></input>
                  </form>
                </li>
              </ul>
            </div>
            <div class="uk-navbar-right">
              <ul class="uk-navbar-nav">
                <li>
                  <a href={api.url + "#demo"} data-uk-icon="icon:heart"> </a>
                </li>
                <li>
                  <a href={api.url + "#demo"} data-uk-icon="icon:user"> </a>
                </li>
                <li>
                  <a id="signout" href="#modal-overflow" data-uk-icon="icon:sign-out" uk-toggle> </a>
                  <div id="modal-overflow" uk-modal>
                    <div class="uk-modal-dialog">
                      <button class="uk-modal-close-default" type="button" uk-close></button>
                      <div class="uk-modal-header">
                        <h2 class="uk-modal-title">Sign-out</h2>
                      </div>
                      <div class="uk-modal-body" uk-overflow-auto>
                        <p class = "uk-text-large">Are you sure you want to log out?</p>
                      </div>
                      <div class="uk-modal-footer uk-text-right">
                        <form action="/logout?_method=DELETE" method="POST">
                          <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                          <button type="submit" class="uk-button uk-button-danger">Log Out</button>
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

export default Login;