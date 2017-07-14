import React, { Component } from "react";
import { Item, Grid, Button, Icon, Message, Header, Modal, Form } from "semantic-ui-react";
import UsersItemComponent from './UsersItemComponent';
import UsersApi from '../api/Users';
import extend from 'extend';

class UsersComponent extends Component {
    constructor (props) {
        super(props);
        this.state = {
            message: {
                isShow: false,
                color: 'green',
                header: '',
                content: ''
            },
            modalOpen: false,
            user: {
                name: '',
                email: '',
                password: '',
                isAdmin: false
            },
            isReadySubmit: false
        }
    }

    addUser = () => {
        // call to api server
        const userData = {
            'email': document.getElementById('email').value, 
            'password': document.getElementById('password').value,
            'name': document.getElementById('name').value,
            'isAdmin': false
        };

        UsersApi.create(userData, res => {

            let message = extend({}, this.state.message);

            message.header = 'Add User';
            message.content = res.message;
            message.color = 'red';
            message.isShow = true;
            if(res.status === 1) {
                message.color = 'green';
                this.setState({message: message, modalOpen: false}, this.props.onComponentRefresh);
                return;
            }

            this.setState({message: message, modalOpen: false}, this.hideMessage(2000));
        });
    }

    onChange = (e) => {
        const isValid = document.getElementById('name').value.length && document.getElementById('email').value.length && document.getElementById('password').value.length;
        this.setState({isReadySubmit: isValid});
    }

    hideMessage = (time) => {
        time = time ? time : 0;
        let message = extend({}, this.state.message);
        message.isShow = false;
        setTimeout(() => {
            this.setState({message: message});
        }, time)
    }

    handleOpen = (e) => this.setState({
        modalOpen: true,
    })

    handleClose = (e) => this.setState({
        modalOpen: false,
    })

    render() {
        const { users } = this.props;
        const { message, isReadySubmit } =  this.state;
        // console.log(users);
        return (
            <Grid stackable>
                <Grid.Column width={16}>
                    {message.isShow ? <Message onDismiss={this.hideMessage} color={message.color} header={message.header} content={message.content} /> : ''}
                    
                    <Modal dimmer='blurring' size='small' trigger={<Button circular icon='add user' color='blue' floated='right' onClick={this.handleOpen} />} open={this.state.modalOpen}>
                        <Header icon='user' content='New User Information' />
                        <Modal.Content>
                            {/* <p>Your form should go here</p> */}
                            <Form id="loginForm" onSubmit={this.addUser} widths="equal">
                                <Form.Input id="name" label="Name" placeholder="Name" onChange={this.onChange} />
                                <Form.Input id="email" label="Email" placeholder="Email" onChange={this.onChange} />
                                <Form.Input id="password" label="Password" type="password" placeholder="Password" onChange={this.onChange} />
                                {/* <Button content="Save" /> */}
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='red' onClick={this.handleClose}>
                                <Icon name='remove' /> Cancel
                            </Button>
                            <Button color='green' disabled={!isReadySubmit} onClick={this.addUser}>
                                <Icon name='checkmark' /> Save
                            </Button>
                        </Modal.Actions>
                    </Modal>
                
                {!users
                    ? 'Hm, it looks like there are no items to show you :('
                    : <Item.Group divided link>
                        {users.map((user, i) => {
                            return <UsersItemComponent key={i} {...user} />
                        })}
                    </Item.Group>}
                </Grid.Column>
            </Grid>
        );
    }
}

export default UsersComponent;