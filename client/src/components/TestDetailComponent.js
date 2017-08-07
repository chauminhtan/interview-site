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
// import {
//   Table,
//   TableBody,
//   TableHeader,
//   TableHeaderColumn,
//   TableRow,
//   TableRowColumn,
// } from 'material-ui/Table';
import TableQuestionComponent from '../components/TableQuestionComponent';

class TestDetailComponent extends Component {

    state = {
        redirectToReferer: false,
        message: {
            isShow: false,
            content: ''
        },
        test: {
            title: '',
            position: {},
            time: 0,
            questions: []
        },
        modififed: false
    }

    goBack = () => {
        this.setState({ redirectToReferer: true })
    }

    onChange = (newState) => {
        // console.log(newState);
        extend(this.props.test, newState);
        this.setState({modififed: true});
    }

    edit = () => {
        // console.log(this.props.question)
        let data = this.props.test;
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

    handleRequestClose = () => {
        let message = extend({}, this.state.message);
        message.isShow = false;
        this.setState({message: message});
    }

    updateSelectedQuestions = (selectedQuestions) => {
        console.log(selectedQuestions);
        const originalQuestions = this.state.test.questions;
        let test = extend({}, this.state.test);
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
            // isReadySubmit: isValidSubmit, 
            // isReadyGenerate: isValidGenerate
        });
    }

    isSelected = (data) => {
        return this.props.test.questions.findIndex(i => i.id === data.id) !== -1;
    };
    
    render() {
        const { test } = Object.keys(this.props.test).length ? this.props : this.state;
        const from = { pathname: '/tests' };
        const { redirectToReferer, message, modififed } =  this.state;
        const selectedQuestions = test.questions.length == 0 ? [] : test.questions.map( question => question.id);
        // console.log(this.props.test);
        console.log(selectedQuestions);
        
        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }
        console.log(test);
        let listQuestions = test.questions ? 
            (
                <TableQuestionComponent questions={test.questions} selectedQuestions={selectedQuestions} updateSelectedQuestions={this.updateSelectedQuestions} />
            )
            : '';

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
                        <Tab label="Questions" >
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