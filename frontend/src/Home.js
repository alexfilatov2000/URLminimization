import React, {Component} from 'react';
import {InputGroup, FormControl, Button, Form} from "react-bootstrap";
import TopLinks from "./TopLinks";
import {URL} from "./config"


class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            urlCode: ''
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleClick302 = this.handleClick302.bind(this);
        this.handleClickJs = this.handleClickJs.bind(this);
        this.handleClickMeta = this.handleClickMeta.bind(this);
    }


    async handleClick(){
        let tokenData = JSON.parse(sessionStorage.tokenData)
        let decode = parseJwt(tokenData.accessToken);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                OriginalName: document.getElementById('basic-url').value,
                Email: decode.email,
                Type: '301'
            })
        };
        const response = await fetch(`${URL}/api/url/shorten`, requestOptions);
        const data = await response.json();
        console.log(data);
        this.setState({ urlCode: data.urlCode });
    }

    async handleClick302() {
        let tokenData = JSON.parse(sessionStorage.tokenData)
        let decode = parseJwt(tokenData.accessToken);

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                OriginalName: document.getElementById('basic-url').value,
                Email: decode.email,
                Type: '302'
            })
        };
        const response = await fetch(`${URL}/api/url/shorten`, requestOptions);
        const data = await response.json();
        console.log(data);
        this.setState({urlCode: data.urlCode});
    }

    async handleClickJs(){
        let tokenData = JSON.parse(sessionStorage.tokenData)
        let decode = parseJwt(tokenData.accessToken);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                OriginalName: document.getElementById('basic-url').value,
                Email: decode.email,
                Type: 'js redirect'
            })
        };
        const response = await fetch(`${URL}/api/url/shorten`, requestOptions);
        const data = await response.json();
        console.log(data);
        this.setState({ urlCode: data.urlCode });
    }

    async handleClickMeta(){
        let tokenData = JSON.parse(sessionStorage.tokenData)
        let decode = parseJwt(tokenData.accessToken);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                OriginalName: document.getElementById('basic-url').value,
                Email: decode.email,
                Type: 'meta tag redirect'
            })
        };
        const response = await fetch(`${URL}/api/url/shorten`, requestOptions);
        const data = await response.json();
        console.log(data);
        this.setState({ urlCode: data.urlCode });
    }

    render() {
        const shortUrl = `${URL}/`+ this.state.urlCode;
        return (
            <div>
                <Form>
                    <label htmlFor="basic-url">Your vanity URL</label>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon3">
                                https://example.com/users/
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl id="basic-url" aria-describedby="basic-addon3" />
                    </InputGroup>

                    <Button variant="danger" type="button" className="pull-right" onClick={this.handleClick} >
                        301 http
                    </Button>

                    <Button variant="primary" type="button" className="pull-right" onClick={this.handleClick302} >
                        302 http
                    </Button>

                    <Button variant="warning" type="button" className="pull-right" onClick={this.handleClickJs} >
                        js redirect
                    </Button>

                    <Button variant="light" type="button" className="pull-right" onClick={this.handleClickMeta} >
                        meta tag redirect
                    </Button>
                </Form>
                <a href={shortUrl}>{this.state.urlCode}</a>
                <TopLinks/>
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

export default Home;



