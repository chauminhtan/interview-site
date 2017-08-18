import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ResultsApi from '../api/Results';
import extend from 'extend';
import moment from 'moment';
import { Card, CardActions, CardTitle } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import DisplayQuestionComponent from '../components/DisplayQuestionComponent';

class TestPageComponent extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            redirectToReferer: false,
            message: {
                isShow: false,
                content: ''
            },
            isStarted: false,
            duration: 0,
            modififed: false
        }
    }

    goBack = () => {
        this.setState({ redirectToReferer: true })
    }

    onChange = (data) => {
        // console.log(data)
        this.props.result.test.questions = data;

        this.setState({
            modififed: true && !this.props.result.done
        });
    }

    save = () => {
        let { duration } = this.state;
        let data = this.props.result;
        data.done = true;
        data.time = duration;
        // console.log(data);
        ResultsApi.update(data, res => {
            // console.log(res);
            let message = extend({}, this.state.message);
            message.content = res.message;
            message.isShow = true;

            if(res.status === 1) {
                // this.goBack(); 
                // return;
            }
            this.setState({
                 message: message,
                 modififed: false
            }, this.props.onComponentRefresh());
        })
    }

    handleStart = (e) => { 
        this.setState({
            isStarted: true,
            modififed: true
        })
    }

    setTimer() {
        this.timeout = setTimeout(this.updateTime.bind(this), 1000);
    }

    updateTime() {
        let { duration, isStarted } = this.state;

        if (isStarted) {
            duration++;
        }

        this.setState({
            duration: duration
        }, this.setTimer);
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
        const { result } = this.props;
        const test = result.test;
        const from = { pathname: '/home' };
        const { redirectToReferer, message, modififed, duration, isStarted } =  this.state;
        // console.log(duration);
        // test.time = 10;
        const rest = test.time > duration ? test.time - duration : 0; 
        const timeForAnswer = moment.unix(test.time).utcOffset(0).format('HH:mm:ss');
        const timeDone = moment.unix(result.time).utcOffset(0).format('HH:mm:ss');
        const currentTime = moment.unix(rest).utcOffset(0).format('HH:mm:ss');

        if(rest === 0) {
            if (!result.done) {
                result.done = true;
                this.save();
            }
        }
        
        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }
        // console.log(selectedUsers);
        let listQuestions = test.questions && (isStarted || result.done) ? 
            (
                <DisplayQuestionComponent questions={test.questions} disabled={result.done} onChange={this.onChange} />
            )
            : '';

        let clockRender = test.time && !result.done ? 
        (
            <div className="clock">
                { currentTime }
            </div>
        ) : '';

        const startBtn = isStarted || result.done ? '' : <RaisedButton secondary disabled={result.done} onClick={this.handleStart} label="Start" />;
        const submitBtn = !isStarted ? '' : <RaisedButton secondary disabled={!modififed} onClick={this.save} label="Submit" />;

        return (
            <div>
                <Snackbar
                    open={message.isShow}
                    message={message.content}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
                <h5>
                    {clockRender}
                </h5>
                <Paper zDepth={2}>
                    <Card className='defaultForm'>
                        <CardTitle className='title' subtitle=''>
                            {test.title}
                        </CardTitle>
                        <Divider />
                        <CardTitle subtitle='Position'>
                            {test.position.name}
                        </CardTitle>
                        <Divider />
                        <CardTitle subtitle='Time for answer'>
                            {result.done ? timeDone + ' / ' + timeForAnswer : timeForAnswer}
                        </CardTitle> 
                        <Divider />
                        <CardTitle subtitle='Questions'>
                            <div style={ {marginTop: 10} }>
                            {startBtn}
                            {listQuestions}
                            </div>
                        </CardTitle>
                        <CardActions>
                            {submitBtn}
                        </CardActions>
                    </Card>
                </Paper>
            </div>
        );
    }
}

export default TestPageComponent;