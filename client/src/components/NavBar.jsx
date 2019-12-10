/* globals fetch */

import React, { Component } from 'react';
import { api } from '../api';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = { apiResponse: '' };

    this.callAPI = this.callAPI.bind(this);
  }

  componentDidMount() {
    this.callAPI();
  }

  callAPI() {
    fetch(`${api.url}/testAPI`)
      .then((res) => this.setState({ apiResponse: res }))
      .catch((err) => err);
  }

  render() {
    return (
      <header className="uk-margin-medium-bottom" style={{ backgroundColor: '#fff', borderBottom: '1px solid #dbdbdb' }} data-uk-sticky={{ 'show-on-up': 'true', animation: 'uk-animation-fade' }}>
        <div className="uk-container uk-container-small">
          <nav id="navbar" data-uk-navbar={{ mode: 'click' }}>
            <div className="uk-navbar-left">
              <a className="uk-navbar-item uk-logo" href="/"><img src={require('../images/photogram.png')} alt="Logo" style={{ width: '180px', height: '40px' }} /></a>
            </div>
            <div className="uk-navbar-right">
              <ul className="uk-navbar-nav">
                <li>
                  <a href="/like" data-uk-icon="icon:heart"> </a>
                </li>
                <li>
                  <a href="/profile" data-uk-icon="icon:user"> </a>
                </li>
                <li>
                  <a href="/makePost" data-uk-icon="icon:image"> </a>
                </li>
                <li>
                  <a href="/follow" data-uk-icon="icon:users" />
                </li>
                <li>
                  <a href={`${api.url}/testAPI`} data-uk-icon="icon:sign-out" uk-toggle="true"> </a>
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
