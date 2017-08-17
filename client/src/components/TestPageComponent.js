import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
// import moment from 'moment';
import TestsApi from '../api/Tests';
import ResultsApi from '../api/Results';
import extend from 'extend';
import { Card, CardActions, CardTitle } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Snackbar from 'material-ui/Snackbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import DisplayQuestionComponent from '../components/DisplayQuestionComponent';
import SelectField from "material-ui/SelectField";
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentEdit from 'material-ui/svg-icons/content/create';

class TestPageComponent extends Component {
    constructor(props) {
        super(props);
        const state = {
            redirectToReferer: false,
            message: {
                isShow: false,
                content: ''
            },
            test: {
                time: 0,
                questions: []
            },
            isStarted: false,
            duration: 0,
            modififed: false
        }
        this.state = extend(state, this.getTime())
    }

    goBack = () => {
        this.setState({ redirectToReferer: true })
    }

    onChange = (newState) => {
        extend(this.props.test, newState);

        this.setState({
            modififed: true
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
                // this.goBack(); 
                // return;
            }
            this.setState({
                 message: message
            }, this.props.onComponentRefresh());
        })
    }

    handleStart = (e) => { 
        this.setState({
            isStarted: true,
        })
    }

    setTimer() {
        this.timeout = setTimeout(this.updateTime.bind(this), 1000);
    }

    updateTime() {
        let { duration, isStarted } = this.state;
        let time = this.getTime();

        if (isStarted) {
            duration++;
            time.duration = duration;
        }
        this.setState(time, this.setTimer);
    }

    getTime() {
        const currentTime = new Date();
        return {
            hours: currentTime.getHours(),
            minutes: currentTime.getMinutes(),
            seconds: currentTime.getSeconds(),
            ampm: currentTime.getHours() >= 12 ? 'pm' : 'am'
        }
    }

    componentDidMount() {
        this.setTimer();
    }

    componentWillUnmount() {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
      }

    handleRequestClose = () => {
        let message = extend({}, this.state.message);
        message.isShow = false;
        this.setState({message: message});
    }
    
    render() {
        const { test, users, assignments } = this.props;
        const from = { pathname: '/home' };
        const { redirectToReferer, message, modififed, hours, minutes, seconds, ampm, duration, isStarted } =  this.state;
        // console.log(duration);
        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }
        // console.log(selectedUsers);
        let listQuestions = test.questions && isStarted ? 
            (
                <DisplayQuestionComponent questions={test.questions} disabled={false} />
            )
            : '';

        let clockRender = hours ? 
            (
                <div className="clock">
                    {
                    hours === 0 ? 12 :
                        (hours > 12) ?
                        hours - 12 : hours
                    }:{
                    minutes > 9 ? minutes : `0${minutes}`
                    }:{
                    seconds > 9 ? seconds : `0${seconds}`
                    } {ampm}
                </div>
            ) : '';

        return (
            <div>
                {/* <h2>Test Information</h2> */}
                <Snackbar
                    open={message.isShow}
                    message={message.content}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
                <h5>
                    {clockRender}
                    <FloatingActionButton mini={true} secondary={true} style={{float: 'right'}} onTouchTap={this.handleStart}>
                        <ContentEdit />
                    </FloatingActionButton>
                    <div className='clear' />
                </h5>
                <Paper zDepth={2}>
                    <Card className='defaultForm'>
                        <CardTitle className='title' subtitle='Title'>
                            {test.title}
                        </CardTitle>
                        <Divider />
                        <CardTitle subtitle='Position'>
                            {test.position.name}
                        </CardTitle>
                        <Divider />
                        <CardTitle subtitle='Time for answer (second)'>
                            {test.time}
                        </CardTitle> 
                        <Divider />
                        <CardTitle subtitle='Questions'>
                            {listQuestions}
                        </CardTitle>
                        <CardActions>
                            <RaisedButton primary disabled={!modififed} onClick={this.edit} label="Submit" />
                        </CardActions>
                    </Card>
                </Paper>
            </div>
        );
    }
}

export default TestPageComponent;