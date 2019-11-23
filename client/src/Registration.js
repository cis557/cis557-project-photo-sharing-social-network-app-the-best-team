import React, { Component } from "react";
import {rgba} from 'polished';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };
    }

    callAPI() {
        fetch("http://localhost:9000/testAPI")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }

    render() {
        return (
            <div className="Registration">
            <body id="slide-show" class="uk-cover-container uk-background-secondary uk-flex uk-flex-center uk-flex-middle uk-height-viewport uk-overflow-hidden uk-light" data-uk-height-viewport>
            <div class="uk-position-cover uk-overlay-primary">
            <div class="uk-border-rounded uk-width-large uk-padding-large uk-position-z-index" uk-scrollspy="cls: uk-animation-fade" style={{backgroundColor: rgba(253, 253, 253, 0.253)}}>
                <div class="uk-text-center uk-margin"> <img src="images/photogram.png" alt="Logo"></img></div>
                <h4 class="uk-heading-line uk-text-center" style= {{color: rgba(255, 255, 255, .8)}}><span> Registration </span></h4>
                <form action="/register" enctype="multipart/form-data" method="POST" class="toggle-class">
                    <fieldset class="uk-fieldset">
                        <div class="uk-margin-small">
                            <div class="uk-inline uk-width-1-1">
                                <span class="uk-form-icon uk-form-icon-flip"></span>
                                <input id="firstname" name="firstname" class="uk-input uk-border-pill" placeholder="First Name" type="text" required></input>
                            </div>
                        </div>
                        <div class="uk-margin-small">
                            <div class="uk-inline uk-width-1-1">
                                <span class="uk-form-icon uk-form-icon-flip"></span>
                                <input id="lastname" name="lastname" class="uk-input uk-border-pill" placeholder="Last Name" type="text" required></input>
                            </div>
                        </div>
                        <div class="uk-margin-small">
                            <div class="uk-inline uk-width-1-1">
                                <span class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: mail"></span>
                                <input id="email" name="email" class="uk-input uk-border-pill" placeholder="Email" type="email" required></input>
                                    </div>
                            </div> 
                        <div class="uk-margin-small">
                            <div class="uk-inline uk-width-1-1">
                                <span class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: user"></span>
                                <input id="username" name="username" class="uk-input uk-border-pill" placeholder="Username" type="text" required></input>
                            </div>
                        </div>
                        <div class="uk-margin-small">
                            <div class="uk-inline uk-width-1-1">
                                <span class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: lock"></span>
                                <input id="password" name="password" class="uk-input uk-border-pill" placeholder="Password" type="password" required></input>
                            </div>
                        </div>
                        <div class="uk-margin">
                            <div class="uk-inline uk-width-1-1" uk-form-custom="target: true">
                                <input id="image" name="image" type="file" accept="image/*"></input>
                                <input class="uk-input uk-border-pill" type="text" placeholder="Select profile image"></input>
                            </div>
                        </div>
                        <div class="uk-margin-bottom" style= {{textAlign: "center"}}>
                            <button type="submit" class="uk-button uk-button-primary uk-border-pill uk-width-1-1"
                                id="submit">Register</button>
                            <p>Already have an account? <a href="/login" id="login" class="uk-position-relative">Login</a></p>
                        </div>
                    </fieldset>
                </form>
            </div>
            <script src="javascripts/uikit.min.js"></script>
            <script src="javascripts/uikit-icons.min.js"></script>
            </div>
        </body>
    </div>
        )
    }
}

export default Registration;
