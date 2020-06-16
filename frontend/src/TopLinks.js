import React, {Component} from "react";
import {Button, ListGroup} from "react-bootstrap";
import {URL} from "./config";

class TopLinks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            links: [],
            allLinks: [],
            user: '',
            page: false
        }
        this.handleClick = this.handleClick.bind(this);
    }

     async componentDidMount() {
        this.fetchWithAuth();

    }

     async handleClick(link){
         const requestOptions = {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 shortUrl: link.short_url,
             })
         };
         const response = await fetch(`${URL}/api/allLinks`, requestOptions);
         const data = await response.json();
         console.log(data);
         // this.setState({ urlCode: data.urlCode });
         this.setState({
             page: true,
             allLinks: data.allLinks
         });

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
        return this.state.page ? (
            <div>
                <ListGroup>
                    {this.state.allLinks.map(link =>
                        <ListGroup.Item variant="Light" key={link.id}>
                            <a href={baseUrl+link.short_url}>
                                {baseUrl+link.short_url}
                            </a>
                            {', Country: '+link.country_code} {', Device: '+link.device_type}  {', ip: '+link.ip_address} {', longUrl: '+link.long_url} {', user-agent: '+link.user_agent}
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </div>
        ) : (
            <div>
                <ListGroup>
                    {this.state.links.map(link =>
                        <ListGroup.Item variant="Light" key={link.id}>
                            <a href={baseUrl+link.short_url}>
                                {baseUrl+link.short_url}
                            </a>
                            {', cnt: '+link.count} {', Redirect: '+link.redirection_type} {', longUrl: '+link.long_url}
                            <Button variant="primary" type="button" className="pull-right" onClick={() => this.handleClick(link)} >
                                check
                            </Button>
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

