import React, { Component } from "react";
import {rgba} from 'polished';

class Post extends Component {
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
            <div id = "cards" class="uk-child-width-1-2@m uk-align-center uk-background-default">
            <div class="uk-card uk-card-default uk-card-hover uk-align-center" uk-scrollspy="cls: uk-animation-slide-left; repeat: true">
                <h3 class="uk-card-title uk-text-left-medium">Post Title</h3>
                <div class="uk-card-media-top">
                    <img src={require('FIX ME')} alt=""></img>
                </div>
                <div class="uk-card-body">
                    <h3 class="uk-card-title uk-text-small">Posted by <a href="">Somebody</a></h3>
                    <p id="">I Love Mountains...</p>
                    <a href="" uk-icon = "heart"></a>
                    <a href="" uk-icon = "comments"></a>
                </div>
                </div>
            </div>
        )
    }
}

export default Post;
