import React, { Component } from "react";
import {rgba} from 'polished';
import './stylesheets/uikit.min.css';
import { api } from './api.js'

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };
    }

    callAPI() {
        fetch("`${api.url}/testAPI`")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }

    render() {
        return (
            <div class="uk-container uk-container-small">
            <div id = "cards" className="uk-child-width-1-2@m uk-align-center uk-background-default">
            <div className="uk-card uk-card-default uk-card-hover uk-align-center" uk-scrollspy="cls: uk-animation-slide-left; repeat: true">
                <h3 className="uk-card-title uk-text-left-medium">Post Title</h3>
                <div className="uk-card-media-top">
                    <img src={require('./images/photogram.png')} alt=""></img>
                </div>
                <div className="uk-card-body">
                    <h3 className="uk-card-title uk-text-small">Posted by <a href="">Somebody</a></h3>
                    <p id="">I Love Mountains...</p>
                    <a href="" uk-icon = "heart"></a>
                    <a href="" uk-icon = "comments"></a>
                </div>
                </div>
                <div className="uk-card uk-card-default uk-card-hover uk-align-center" uk-scrollspy="cls: uk-animation-slide-left; repeat: true">
                <h3 className="uk-card-title uk-text-left-medium">Post Title</h3>
                <div className="uk-card-media-top">
                    <img src={require('./images/photogram.png')} alt=""></img>
                </div>
                <div className="uk-card-body">
                    <h3 className="uk-card-title uk-text-small">Posted by <a href="">Somebody</a></h3>
                    <p id="">I Love Mountains...</p>
                    <a href="" uk-icon = "heart"></a>
                    <a href="" uk-icon = "comments"></a>
                </div>
                </div>
            </div>
        </div>   
        )
    }
}

export default Post;
