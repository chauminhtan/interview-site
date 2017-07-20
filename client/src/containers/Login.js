import React, { Component } from "react";
import { Button, Form, Grid } from "semantic-ui-react";
import { Helmet } from 'react-helmet';
import { Redirect } from "react-router-dom";
import Auth from "../api/Auth";
import Header from '../components/Header';

class Login extends Component {

    state = {
        redirectToReferer: false
    }

    login = (e) => {
        e.preventDefault();
        const userData = {
            'email': document.getElementById('email').value, 
            'password': document.getElementById('password').value
        };
        // console.log(userData);
        
        Auth.authenticate(userData, () => {
            this.setState({ redirectToReferer: true })
        })
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const { redirectToReferer } =  this.state;
        const { location } = this.props;

        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }

        return (
            <div>
                <Header location={location} title='Login' />
                <Helmet>
                    <title>Interview System: Login</title>
                </Helmet>
                <div className='MainContent'>
                    <Grid verticalAlign="middle" centered columns={1} textAlign="left" relaxed>
                        <Grid.Row>
                            <Grid.Column tablet={10} mobile={16} computer={6}>
                                <Form id="loginForm" onSubmit={this.login} widths="equal">
                                    <Form.Input id="email" label="Email" placeholder="Email" />
                                    <Form.Input id="password" label="Password" type="password" placeholder="Password" />
                                    <Button content="Login" />
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        )
    }
}

export default Login;
