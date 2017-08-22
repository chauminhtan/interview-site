import React, { Component } from 'react';
import './App.css';
import './Draft.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
// import Header from '../components/Header';
import Home from './Home';
import Users from './Users';
import UserDetail from './UserDetail';
import Questions from './Questions';
import Positions from './Positions';
import Tests from './Tests';
import Login from './Login';
import AuthApi from '../api/Auth';
import QuestionDetail from './QuestionDetail';
import TestDetail from './TestDetail';
import TestPage from './TestPage';
import PositionDetail from './PositionDetail';

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
                    <PrivateRoute exact path="/positions" component={Positions} />
                    <PrivateRoute exact path="/positions/:id" component={PositionDetail} />
                    <PrivateRoute exact path="/tests" component={Tests} />
                    <PrivateRoute exact path="/tests/:id" component={TestDetail} />
                    <PrivateRoute exact path="/testpage/:id" component={TestPage} />
                </div>
            </Router>
        );
    }
}

export default App;