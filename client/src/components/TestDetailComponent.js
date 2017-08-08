import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
// import moment from 'moment';
import TestsApi from '../api/Tests';
import { RIETextArea, RIENumber, RIESelect } from 'riek';
import extend from 'extend';
import { Card, CardActions, CardTitle } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Snackbar from 'material-ui/Snackbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import TableQuestionComponent from '../components/TableQuestionComponent';
import SelectField from "material-ui/SelectField";
import MenuItem from 'material-ui/MenuItem';

class TestDetailComponent extends Component {

    state = {
        redirectToReferer: false,
        message: {
            isShow: false,
            content: ''
        },
        test: {
            time: 0,
            questions: []
        },
        selectedQuestions: [],
        selectedUsers: [],
        email: {
            subject: '',
            content: ''
        },
        modififed: false
    }

    goBack = () => {
        this.setState({ redirectToReferer: true })
    }

    onChange = (newState) => {
        // console.log(newState);
        extend(this.props.test, newState);
        // let test = extend(data, this.state.test);

        this.setState({
            modififed: true
        });
    }

    onChangeEmail = (newState) => {
        // console.log(newState);
        let email = extend(this.state.email, newState);

        this.setState({
            email: email
        });
    }

    edit = () => {
        // console.log(this.props.test);
        let data = this.props.test;
        if (this.state.test.questions.length) {
            data = extend(data, this.state.test);
            console.log(data)
        }
        TestsApi.update(data, res => {
            // console.log(res);
            let message = extend({}, this.state.message);
            message.content = res.message;
            message.isShow = true;

            if(res.status === 1) {
                this.goBack(); 
                return;
            }
            this.setState({message: message});
        })
    }

    delete = () => {
        TestsApi.delete(this.props.test.id, res => {
            // console.log(res);
            let message = extend({}, this.state.message);
            message.content = res.message;
            message.isShow = true;

            if(res.status === 1) {
                this.goBack(); 
                return;
            }
            
            this.setState({message: message});
        })
    }

    sendmail = () => {
        console.log(this.state.selectedUsers);
        console.log(this.state.email);
        // TestsApi.sendmail(res => {
        //     // console.log(res);
        //     const message = { isShow: true, content: res.message };

        //     if(res.status === 1) {
        //         // this.goBack(); 
        //         // return;
        //     }
            
        //     this.setState({message: message});
        // })
    }

    handleRequestClose = () => {
        let message = extend({}, this.state.message);
        message.isShow = false;
        this.setState({message: message});
    }

    updateSelectedQuestions = (selectedQuestions) => {
        console.log(selectedQuestions);
        const originalQuestions = this.props.test.questions;
        let test = extend({}, this.props.test);
        test.questions = [];
        test.time = 0;

        originalQuestions.map((row,index) => {
            let found = selectedQuestions.indexOf(row.id);
            if ( found !== -1 ) {
                row.typeQ = row.type;
                test.questions.push(row);
                test.time += row.time;
            }
            return true;
        });

        console.log(selectedQuestions);
        console.log(test);
        this.setState({ 
            test: test, 
            selectedQuestions: selectedQuestions,
            modififed: true
        });
    }

    handleChange = (event, index, values) => {
        console.log(values);
        let selectedUsers = this.state.selectedUsers;
        this.setState({
            selectedUsers: values
        });
    }

    menuItems(data, values) {
        return data.map((item, i) => (
            <MenuItem
                key={i}
                insetChildren={true}
                checked={values && values.indexOf(item.name) > -1}
                value={item.name}
                primaryText={item.name}
            />
        ));
    }
    
    render() {
        const { test, users } = this.props;
        const from = { pathname: '/tests' };
        const { redirectToReferer, message, modififed, selectedQuestions, selectedUsers } =  this.state;
        const selectedQ = selectedQuestions.length > 0 ? selectedQuestions : test.questions.map( question => question.id );
        const listUsers = users.map( user => user.name);
        // console.log(this.props.test);
        // console.log(listUsers);
        const email = {
            subject: test.title,
            content: 'this is contnent'
        }
        
        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }
        console.log(selectedUsers);
        let listQuestions = test.questions ? 
            (
                <TableQuestionComponent questions={test.questions} selectedQuestions={selectedQ} updateSelectedQuestions={this.updateSelectedQuestions} />
            )
            : '';

        let UserSelectField = users ? 
            (
                <SelectField
                    multiple={true}
                    hintText="Select a name"
                    value={selectedUsers}
                    onChange={this.handleChange}
                >
                    {this.menuItems(users, selectedUsers)}
                </SelectField>
            ) : '';

        return (
            <div>
                <h2>Test Information</h2>
                <Snackbar
                    open={message.isShow}
                    message={message.content}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
                <Paper zDepth={2}>
                    <Tabs>
                        <Tab label="General" >
                            <Card className='defaultForm'>
                                <CardTitle className='title' subtitle='Title'>
                                    <RIETextArea propName='title' value={test.title} change={this.onChange} />
                                </CardTitle>
                                <Divider />
                                <CardTitle subtitle='Position'>
                                    {test.position.name}
                                </CardTitle>
                                <Divider />
                                <CardTitle subtitle='Time for answer (second)'>
                                    <RIENumber propName='time' value={test.time} change={this.onChange} />
                                </CardTitle> 
                                <CardActions>
                                    <RaisedButton primary disabled={!modififed} onClick={this.edit} label="Save" />
                                    <RaisedButton secondary onClick={this.delete} label="Delete" />
                                </CardActions>
                            </Card>
                        </Tab>
                        <Tab label="Questions">
                            <Card>
                                <CardTitle subtitle='Title'>
                                    <RIETextArea className='fullWidth' propName='title' value={test.title} change={this.onChange} />
                                </CardTitle>
                                <Divider />
                                { listQuestions }
                                <Divider />
                                <CardActions>
                                    <RaisedButton primary disabled={!modififed} onClick={this.edit} label="Save" />
                                    <RaisedButton secondary onClick={this.delete} label="Delete" />
                                </CardActions>
                            </Card>
                        </Tab>
                        <Tab label="Assigment">
                            <Card>
                                <CardTitle subtitle='Subject'>
                                    <RIETextArea className='fullWidth' propName='subject' value={email.subject} change={this.onChangeEmail} />
                                </CardTitle>
                                <CardTitle subtitle='Content'>
                                    <RIETextArea className='fullWidth' propName='content' value={email.content} change={this.onChangeEmail} />
                                </CardTitle>
                                <Divider />
                                <CardTitle subtitle='Select Users'>
                                    { UserSelectField }
                                </CardTitle>
                                <Divider />
                                <CardActions>
                                    <RaisedButton primary disabled={!modififed} onClick={this.edit} label="Save" />
                                </CardActions>
                            </Card>
                        </Tab>
                    </Tabs>
                </Paper>
                <h4>
                    <RaisedButton primary={false} label='back' icon={<ArrowBack />} onTouchTap={this.goBack} />
                </h4>
            </div>
        );
    }
}

export default TestDetailComponent;