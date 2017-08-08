import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { Input } from "semantic-ui-react";
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
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import moment from 'moment';

class UsersComponent extends Component {
    constructor (props) {
        super(props);
        this.state = {
            search: '',
            message: {
                isShow: false,
                color: 'green',
                header: '',
                content: ''
            },
            modalOpen: false,
            users: [],
            originalUsers: [],
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
        const {user} = this.state;

        UsersApi.create(user, res => {

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
        // const isValid = document.getElementById('name').value.length && document.getElementById('email').value.length && document.getElementById('password').value.length;
        // this.setState({isReadySubmit: isValid});
        let user = extend({}, this.state.user);
        user[e.target.id] = e.target.value;
        // console.log(user);
        const isValid = user.name.length && 
                        user.email.length && 
                        user.password.length;
        this.setState({user: user, isReadySubmit: isValid});
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
            if (key === selectedRows[0].toString()) {
                // redirect to user detail page
                this.setState({redirectToReferer: '/users/' + this.state.users[key].id})
                break;
            }
        }
    };

    handleSearch = (event) => {
        const users = this.state.originalUsers;
        let filteredUsers = users.filter(user => {
            return user.name.search(event.target.value) > -1;
        });
        
        this.setState({
            search: event.target.value,
            users: filteredUsers
        });
    };

    // Update the data when the component mounts
    componentDidMount() {
        this.setState({loading: true}, this.updateData);
    }

    // Call out to server data and refresh directory
    updateData = () => {
        UsersApi.getAll(res => {
            // console.log(res);
            this.setState({
                loading: false,
                users: res.data,
                originalUsers: res.data
            }, this.props.onComponentRefresh);
        })
    }

    render() {
        // const { users } = this.props;
        const { message, isReadySubmit, users, redirectToReferer, search } =  this.state;
        // console.log(users);
        if (redirectToReferer.length) {
            return (
                <Redirect to={{pathname: redirectToReferer}} />
            )
        }

        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
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
                    open={message.isShow}
                    message={message.content}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
                <Dialog
                    title="New User"
                    actions={actions}
                    modal={false}
                    open={this.state.modalOpen}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                    >
                    <TextField id="name"
                        fullWidth={true}
                        hintText="Name Field"
                        floatingLabelText="Name"
                        onChange={this.onChange}
                        /><br />
                    <TextField id="email"
                        fullWidth={true}
                        hintText="Email Field"
                        floatingLabelText="Email"
                        onChange={this.onChange}
                        /><br />
                    <TextField id="password"
                        fullWidth={true}
                        hintText="Password Field"
                        floatingLabelText="Password"
                        type='password'
                        onChange={this.onChange}
                        />
                </Dialog>
                <h5>
                    <Input icon='search' value={search} onChange={this.handleSearch} placeholder='Search...' />
                    <FloatingActionButton mini={true} secondary={true} style={{float: 'right'}} onTouchTap={this.handleOpen}>
                        <ContentAdd />
                    </FloatingActionButton>
                    <div className='clear' />
                </h5>
                <Paper zDepth={2}>
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
                </Paper>
            </div>
        )
    }
}

export default UsersComponent;