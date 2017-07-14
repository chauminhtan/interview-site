import React, { Component } from "react";
import { Button, Form, Grid } from "semantic-ui-react";
import { Helmet } from 'react-helmet';
import { Redirect } from "react-router-dom";
import Auth from "../api/Auth";

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

        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }

        return (
            <Grid verticalAlign="middle" centered columns={1} textAlign="left" relaxed>
                <Helmet>
                    <title>Interview System: Login</title>
                </Helmet>
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
        )
    }
}

export default Login;
