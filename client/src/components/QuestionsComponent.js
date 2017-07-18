import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import QuestionsApi from '../api/Questions';
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
import { Item, Grid, Button, Icon, Message, Header, Modal, Form } from "semantic-ui-react";

class QuestionsComponent extends Component {
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
            'description': document.getElementById('description').value, 
            'category': document.getElementById('category').value,
            'answer': document.getElementById('answer').value,
            'time': document.getElementById('time').value,
            'type': document.getElementById('type').value
        };

        QuestionsApi.create(userData, res => {

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
        const isValid = document.getElementById('description').value.length && document.getElementById('category').value.length && document.getElementById('answer').value.length && document.getElementById('time').value.length && document.getElementById('type').value.length;
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
                this.setState({redirectToReferer: '/questions/' + this.state.users[key].id})
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
        QuestionsApi.getAll(res => {
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
                         <Form.Input id="description" label="Question" placeholder="Question" onChange={this.onChange} />
                         <Form.Input id="category" label="Category" placeholder="Category" onChange={this.onChange} />
                         <Form.Input id="answer" label="Answer" placeholder="Answer" onChange={this.onChange} />
                         <Form.Input id="time" label="Time" placeholder="Time" onChange={this.onChange} value='10' />
                         <Form.Input id="type" label="Type" placeholder="Type" onChange={this.onChange} value='text' />
                         {/* <Button content="Save" /> */}
                     </Form>
                </Dialog>
                <Table onRowSelection={this.handleRowSelection}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Question</TableHeaderColumn>
                            <TableHeaderColumn>Category</TableHeaderColumn>
                            <TableHeaderColumn>Answer</TableHeaderColumn>
                            <TableHeaderColumn>Created</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {users.map( (row, index) => (
                        <TableRow key={index}>
                            <TableRowColumn>{row.description}</TableRowColumn>
                            <TableRowColumn>{row.category}</TableRowColumn>
                            <TableRowColumn>{row.answer}</TableRowColumn>
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

export default QuestionsComponent;