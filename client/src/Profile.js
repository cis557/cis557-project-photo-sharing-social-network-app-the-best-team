import React, { Component } from "react";
import {rgba} from 'polished';
import { api } from './api.js'
import './stylesheets/uikit.min.css';

let data = {
    name: "Yiwen"
}

class Profile extends Component
 {
    constructor(props) {
        super(props);
        this.x = Math.random()
        this.state = { visibility: 1,
                       data: data };
        console.log(this.x)
    }

    callAPI() {
        fetch("`${api.url}/testAPI`")
            .then(res => res.text())
            .then(res => this.setState({ visibility: 1}))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }

    render(data) {
        if(this.state.visibility == 1){
        return (
            <div className="uk-flex uk-flex-center uk-background-default">
                <div className="uk-container uk-container-small">
                    <div className="uk-grid" uk-grid>
                        <div className="uk-width-1-3 uk-flex uk-flex-middle uk-flex-center">
                            <img className="uk-border-pill" style= {{height: "150px", width: "150px"}} id="profile-image" src={require('./images/photogram.png')} alt=""></img>
                        </div>
                    <div className="uk-width-expand uk-padding-small uk-flex uk-flex-column">
                        <p id="username" className="uk-text-lead uk-text-light">Yiwen123</p>
                        <span> <p id="followers" className="uk-text-bold">Follower: 1</p><p id="following" className="uk-text-bold">Following: 1</p> </span>
                        <p id="name" className="uk-text-bold uk-text-small">data</p>
                    </div>
                </div>
                <form className="uk-margin-small-bottom" action="/post" encType="multipart/form-data" method="POST" className="uk-form-stacked">
                    <div className="uk-margin">
                        <label for="image" className="uk-form-label uk-text-large">Select an image to upload:</label>
                        <input id="image" className="uk-input uk-form-width-large" type="file" name="image" accept="image/*" />
                        <input type="submit" className="uk-button-muted uk-button-small" value="Upload" />
                    </div>
                </form>
                <div className="uk-container uk-container-small uk-margin-top">
                    <div id="recentPost" className="uk-child-width-1-2@m uk-align-center uk-background-default">
                    </div>
                </div>
            </div>
        </div>
        )
    }
    else{
        return null;
    }
    }
}

export default Profile;
