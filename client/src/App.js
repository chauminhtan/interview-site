import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Redirect, withRouter } from "react-router-dom";
import Index from "./containers/Index";
import Header from "./containers/Header";
import Home from "./Home";
import Setting from "./Setting";
import Login from "./Login";
import Auth from "./Auth";
const Users = () => <h2>Users</h2>

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={ props => (
        Auth.isAuthenticated ? 
        ( <Component {...props} /> ) : 
        ( <Redirect to={{pathname: '/login', state: { from: props.location }}} /> )
    )} />
)

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Header />
                    <PrivateRoute exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <PrivateRoute path="/users" component={Users} />
                    <PrivateRoute path="/setting" component={Setting} />
                </div>
            </Router>
        );
    }
}

export default App;