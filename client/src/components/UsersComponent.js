import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { Item, Grid, Button, Icon, Message, Header, Modal, Form } from "semantic-ui-react";
// import UsersItemComponent from './UsersItemComponent';
import UsersApi from '../api/Users';
import extend from 'extend';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import moment from 'moment';

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
            users: [],
            user: {
                name: '',
                email: '',
                password: '',
                isAdmin: false
            },
            isReadySubmit: false,
            redirectToReferer: ''
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
            message.content = res.message;
            message.isShow = true;
            if(res.status === 1) {
                //
                // return;
            }

            this.setState({message: message, modalOpen: false, loading: true}, this.updateData);
        });
    }

    onChange = (e) => {
        const isValid = document.getElementById('name').value.length && document.getElementById('email').value.length && document.getElementById('password').value.length;
        this.setState({isReadySubmit: isValid});
    }

    handleRequestClose = () => {
        let message = extend({}, this.state.message);
        message.isShow = false;
        this.setState({message: message});
    }

    handleOpen = (e) => this.setState({
        modalOpen: true,
    })

    handleClose = (e) => this.setState({
        modalOpen: false,
    })

    handleRowSelection = (selectedRows) => {
        // console.log(selectedRows[0]);
        for (var key in this.state.users) {
            if (key == selectedRows[0]) {
                // redirect to user detail page
                this.setState({redirectToReferer: '/users/' + this.state.users[key].id})
                break;
            }
        }
    };

    // Update the data when the component mounts
    componentDidMount() {
        this.setState({loading: true}, this.updateData);
    }

    // Call out to server data and refresh directory
    updateData = () => {
        UsersApi.getUsers(res => {
            // console.log(res);
            this.setState({
                loading: false,
                users: res.data
            }, this.props.onComponentRefresh);
        })
    }

    render() {
        // const { users } = this.props;
        const { message, isReadySubmit, users, redirectToReferer } =  this.state;
        // console.log(users);
        if (redirectToReferer.length) {
            return (
                <Redirect to={{pathname: redirectToReferer}} />
            )
        }

        const actions = [
            <FlatButton
                label="Cancel"
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.addUser}
                disabled={!isReadySubmit}
            />,
        ];

        return (
            <div>
                <Snackbar
                    open={this.state.message.isShow}
                    message={this.state.message.content}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                />
                <Dialog
                    title="New User Information"
                    actions={actions}
                    modal={false}
                    open={this.state.modalOpen}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                    >
                    <Form id="loginForm" onSubmit={this.addUser} widths="equal">
                         <Form.Input id="name" label="Name" placeholder="Name" onChange={this.onChange} />
                         <Form.Input id="email" label="Email" placeholder="Email" onChange={this.onChange} />
                         <Form.Input id="password" label="Password" type="password" placeholder="Password" onChange={this.onChange} />
                    </Form>
                </Dialog>
                <Table onRowSelection={this.handleRowSelection}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Email</TableHeaderColumn>
                            <TableHeaderColumn>Created</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} showRowHover={true}>
                        {users.map( (row, index) => (
                        <TableRow key={index}>
                            <TableRowColumn>{row.name}</TableRowColumn>
                            <TableRowColumn>{row.email}</TableRowColumn>
                            <TableRowColumn>{moment(row.dateModified).fromNow()}</TableRowColumn>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <FloatingActionButton secondary={true} style={{float: 'right'}} onTouchTap={this.handleOpen}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        )
    }
}

export default UsersComponent;