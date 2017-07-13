import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card, Icon, Message } from 'semantic-ui-react';
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
        }
    }

    goBack () {
        this.setState({ redirectToReferer: true })
    }

    onChange = (newState) => {
        extend(this.props.user, newState);
        console.log(this.props.user);
    }

    edit () {
        UsersApi.update(this.props.user, res => {
            console.log(res);
            this.setState({message: {isShow: true, color: 'green', header: 'Saved User!', content: res.message}});
        })
    }

    delete () {
        UsersApi.delete(this.props.user.id, res => {
            console.log(res);
            if(res.status === 1) {
                this.goBack();
            }
            this.setState({message: {isShow: true, color: 'red', header: 'Delete User!', content: res.message}});
        })
    }
    
    render() {
        const { user } = Object.keys(this.props.user).length ? this.props : this.state;
        const from = { pathname: '/users' };
        const { redirectToReferer, message } =  this.state;
        console.log(user);

        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }

        return (
            <div>
                {message.isShow ? <Message color={message.color} header={message.header} content={message.content} /> : ''}
                <Card>
                    <Card.Content>
                        <Card.Header>
                            {/* {user.name} */}
                            <RIEInput propName='name' value={user.name} change={this.onChange.bind(this)} />
                        </Card.Header>
                        <Card.Description>
                            {/* {user.email} */}
                            <RIEInput  propName='email' value={user.email} change={this.onChange.bind(this)} />
                        </Card.Description>
                        <Card.Meta>
                            Created: {moment(user.dateModified).fromNow()}
                        </Card.Meta>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui two buttons'>
                            <Button color='green' onClick={this.edit.bind(this)}>Save</Button>
                            <Button color='red' onClick={this.delete.bind(this)}>Delete</Button>
                        </div>
                    </Card.Content>
                </Card>
                <Button color='grey' animated onClick={this.goBack.bind(this)}>
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