import React, { Component } from "react";
import { Button, Checkbox, Form } from "semantic-ui-react";
import { BrowserRouter as Router, Route, Redirect, withRouter } from "react-router-dom";
import Auth from "./Auth";

class Login extends Component {

    state = {
        redirectToReferer: false
    }

    login = () => {
        Auth.authenticate(() => {
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
            <Form onSubmit={this.login}>
                <Form.Field>
                    <label>Email</label>
                    <input placeholder="Email" />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input type="password" placeholder="Last Name" />
                </Form.Field>
                <Form.Field>
                    <Checkbox label="Remember me" />
                </Form.Field>
                <Button type="submit">Login</Button>
            </Form>
        );
  }
}

export default Login;
