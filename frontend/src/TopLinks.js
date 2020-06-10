import React, {Component} from "react";
import {ListGroup} from "react-bootstrap";
import {URL} from "./config";

class TopLinks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            links: [],
            user: ''
        }
    }

     async componentDidMount() {
        this.fetchWithAuth();

    }

    async refreshToken(url, requestOptions){
        const response = await fetch(`${URL}/token`, requestOptions);
        const data = await response.json();
        await sessionStorage.setItem('tokenData', JSON.stringify(data));
        console.log(data);
    }

    async fetchWithAuth() {
        const loginUrl = '/login';
        let tokenData = null;
        let token = null;

        if (sessionStorage.tokenData) {
            tokenData = JSON.parse(sessionStorage.tokenData);
            token = tokenData.refreshToken;
            console.log(tokenData);
        } else {
            return window.location.replace(loginUrl);
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ token })
        };

        let decode = parseJwt(tokenData.accessToken);
        if (Date.now() >= decode.exp * 1000) {
            console.log('time over');
            await this.refreshToken(`${URL}/token`, requestOptions);
        }

        let NewToken = JSON.parse(sessionStorage.tokenData);
        const options = {
            method: "Get",
            headers: {
                "content-type": "application/json",
                "auth-token": NewToken.accessToken
            }
        };

        fetch(URL, options)
            .then(res => res.json())
            .then(data => this.setState({links: data.links, user: data.user}, () => console.log('links fetched', data.links)));

    }

    render() {
        const baseUrl = `${URL}/`;
        return (
            <div>
                <ListGroup>
                    {this.state.links.map(link =>
                        <ListGroup.Item variant="Light" key={link.id}>
                            <a href={baseUrl+link.short_url}>
                                {baseUrl+link.short_url}
                            </a>
                            {', Country: '+link.country_code} {', Device: '+link.device_type} {', cnt: '+link.count} {', longUrl: '+link.long_url}
                        </ListGroup.Item>
                    )}
                </ListGroup>
                <div>{this.state.user}</div>
            </div>
        );
    }
}


const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};


export default TopLinks;

