import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import Header from '../components/Header';
import Home from './Home';
import Users from './Users';
import UserDetail from './UserDetail';
import Questions from './Questions';
import Login from './Login';
import AuthApi from '../api/Auth';
import QuestionDetail from './QuestionDetail';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={ props => (
        AuthApi.isAuthenticated() ? 
        ( <Component {...props} /> ) : 
        ( <Redirect to={{pathname: '/login', state: { from: props.location }}} /> )
    )} />
)

class App extends Component {

    // Update the data when the component mounts
    componentDidMount() {
        
    }

    render() {
        
        return (
            <Router>
                <div className="MainLayout">
                    <Route path="/login" component={Login} />
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute path="/home" component={Home} />
                    <PrivateRoute exact path="/users" component={Users} />
                    <PrivateRoute exact path="/users/:id" component={UserDetail} />
                    <PrivateRoute exact path="/questions" component={Questions} />
                    <PrivateRoute exact path="/questions/:id" component={QuestionDetail} />
                </div>
            </Router>
        );
    }
}

export default App;