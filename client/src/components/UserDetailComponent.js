import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import UsersApi from '../api/Users';
import { RIEInput } from 'riek';
import extend from 'extend';
import Snackbar from 'material-ui/Snackbar';
import { Card, CardActions, CardTitle } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

class UserDetailComponent extends Component {

    state = {
        redirectToReferer: false,
        message: {
            isShow: false,
            content: ''
        },
        user: {
            name: '',
            email: ''
        },
        modififed: false
    }

    goBack = () => {
        this.setState({ redirectToReferer: true })
    }

    onChange = (newState) => {
        extend(this.props.user, newState);
        // console.log(this.props.user);
        this.setState({modififed: true});
    }

    edit = () => {
        UsersApi.update(this.props.user, res => {
            // console.log(res);
            const message = { isShow: true, content: res.message };

            if(res.status === 1) {
                this.goBack(); 
                return;
            }
            this.setState({message: message});
        })
    }

    delete = () => {
        UsersApi.delete(this.props.user.id, res => {
            // console.log(res);
            const message = { isShow: true, content: res.message };

            if(res.status === 1) {
                this.goBack(); 
                return;
            }
            
            this.setState({message: message});
        })
    }

    handleRequestClose = () => {
        let message = extend({}, this.state.message);
        message.isShow = false;
        this.setState({message: message});
    }
    
    render() {
        const { user } = Object.keys(this.props.user).length ? this.props : this.state;
        const from = { pathname: '/users' };
        const { redirectToReferer, message, modififed } =  this.state;
        // console.log(user);

        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }

        return (
            <div>
                <h2>User Information</h2>
                <Snackbar
                    open={message.isShow}
                    message={message.content}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
                <Paper zDepth={2}>
                    <Card className='defaultForm'>
                        <CardTitle className='title' subtitle='Name'>
                            <RIEInput propName='name' value={user.name} change={this.onChange} />
                        </CardTitle>
                        <Divider />
                        <CardTitle subtitle='Email'>
                            <RIEInput propName='email' value={user.email} change={this.onChange} />
                        </CardTitle>
                        <Divider />
                        <CardTitle subtitle='Created'>
                            {moment(user.dateModified).fromNow()}
                        </CardTitle>
                        {/* <Divider /> */}
                        <CardActions>
                            <RaisedButton primary disabled={!modififed} onClick={this.edit} label="Save" />
                            <RaisedButton secondary onClick={this.delete} label="Delete" />
                        </CardActions>
                    </Card>
                </Paper>
                <h4>
                    <RaisedButton primary={false} label='back' icon={<ArrowBack />} onTouchTap={this.goBack} />
                </h4>
            </div>
        );
    }
}

export default UserDetailComponent;