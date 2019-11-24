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
      <header className ="uk-margin-medium-bottom" style={{backgroundColor: "#fff", borderBottom: "1px solid #dbdbdb"}} data-uk-sticky= {{"show-on-up": "true", animation: "uk-animation-fade"}}>
        <div className ="uk-container uk-container-small">
          <nav id = "navbar" data-uk-navbar = {{mode: "click"}}>
            <div className = "uk-navbar-left">
              <a className = "uk-navbar-item uk-logo" href = "/feed"><img src = {require('./images/photogram.png')} alt="Logo" style={{width: "180px", height: "40px"}}></img></a>
            </div>
            <div className="uk-navbar-right">
              <ul className="uk-navbar-nav">
                <li>
                  <a href={api.url + "demo"} data-uk-icon="icon:heart"> </a>
                </li>
                <li>
                  <a href={api.url + "demo"} data-uk-icon="icon:user"> </a>
                </li>
                <li>
                  <a href={api.url + "demo"} data-uk-icon="icon:image"> </a>
                </li>
                <li>
                  <a href={api.url + "demo"} data-uk-icon="icon:sign-out" uk-toggle> </a>
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