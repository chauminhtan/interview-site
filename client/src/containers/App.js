import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import Header from '../components/Header';
import Home from './Home';
import Users from './Users';
import UserDetail from './UserDetail';
import Setting from './Setting';
import Login from './Login';
import AuthApi from '../api/Auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={ props => (
        AuthApi.isAuthenticated() ? 
        ( <Component {...props} /> ) : 
        ( <Redirect to={{pathname: '/login', state: { from: props.location }}} /> )
    )} />
)

class App extends Component {
    render() {
        return (
            <Router>
                <div className="MainLayout">
                    <Header />
                    <Route path="/login" component={Login} />
                    <Grid verticalAlign="middle" container centered columns={1} textAlign="left" relaxed>
                        <Grid.Row>
                            <Grid.Column tablet={16} mobile={16} computer={16}>
                                <PrivateRoute exact path="/" component={Home} />
                                <PrivateRoute path="/home" component={Home} />
                                <PrivateRoute exact path="/users" component={Users} />
                                <PrivateRoute exact path="/users/:id" component={UserDetail} />
                                <PrivateRoute path="/setting" component={Setting} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Router>
        );
    }
}

export default App;