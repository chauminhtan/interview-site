import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card, Icon, Message, Header } from 'semantic-ui-react';
import moment from 'moment';
import UsersApi from '../api/Users';
import { RIEInput } from 'riek';
import extend from 'extend';

class UserDetailComponent extends Component {

    state = {
        redirectToReferer: false,
        message: {
            isShow: false,
            color: 'green',
            header: '',
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
            let message = extend({}, this.state.message);
            message['header'] = 'Save User!';
            message.content = res.message;
            message.color = 'red';
            message.isShow = true;

            if(res.status === 1) {
                message.color = 'green';
                this.goBack(); 
                return;
            }
            this.setState({message: message}, this.hideMessage(2000));
        })
    }

    delete = () => {
        UsersApi.delete(this.props.user.id, res => {
            // console.log(res);
            let message = extend({}, this.state.message);
            message['header'] = 'Delete User!';
            message.content = res.message;
            message.color = 'red';
            message.isShow = true;

            if(res.status === 1) {
                message.color = 'green';
                this.goBack(); 
                return;
            }
            
            this.setState({message: message}, this.hideMessage(2000));
        })
    }

    hideMessage = (time) => {
        time = time ? time : 0;
        let message = extend({}, this.state.message);
        message.isShow = false;
        setTimeout(() => {
            this.setState({message: message});
        }, time)
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
                {message.isShow ? <Message onDismiss={this.hideMessage} color={message.color} header={message.header} content={message.content} /> : ''}
                <Header as='h2'>User Information</Header>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>
                            <RIEInput propName='name' value={user.name} change={this.onChange} />
                        </Card.Header>
                        <Card.Description>
                            <RIEInput  propName='email' value={user.email} change={this.onChange} />
                        </Card.Description>
                        <Card.Meta>
                            Created: {moment(user.dateModified).fromNow()}
                        </Card.Meta>
                    </Card.Content>
                    <Card.Content extra>
                        {/* <div className='ui two buttons'> */}
                            <Button color='green' disabled={!modififed} onClick={this.edit}>Save</Button>
                            <Button color='red' onClick={this.delete}>Delete</Button>
                        {/* </div> */}
                    </Card.Content>
                </Card>
                <Button color='grey' animated onClick={this.goBack}>
                    <Button.Content hidden>Back</Button.Content>
                    <Button.Content visible>
                        <Icon name='left arrow' />
                    </Button.Content>
                </Button>
            </div>
        );
    }
}

export default UserDetailComponent;