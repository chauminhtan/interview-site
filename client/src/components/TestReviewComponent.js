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
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

class TestReviewComponent extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            redirectToReferer: false,
            message: {
                isShow: false,
                content: ''
            },
            modififed: false
        }
    }

    goBack = () => {
        // this.setState({ redirectToReferer: true })
        this.props.goBack();
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

    componentDidMount() {
        
    }

    componentWillUnmount() {
        
    }

    handleRequestClose = () => {
        let message = extend({}, this.state.message);
        message.isShow = false;
        this.setState({message: message});
    }
    
    render() {
        const { result, questions, location } = this.props;
        const test = result.test;
        const from = { pathname: '/tests' };
        const { redirectToReferer, message, modififed } =  this.state;
        
        const timeForAnswer = moment.unix(test.time).utcOffset(0).format('HH:mm:ss');
        const timeDone = moment.unix(result.time).utcOffset(0).format('HH:mm:ss');
        
        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }
        // console.log(selectedUsers);
        let listQuestions = test.questions ? 
            (
                <DisplayQuestionComponent questions={test.questions} disabled={true} onChange={this.onChange} />
            )
            : '';

        const submitBtn = <RaisedButton secondary disabled={!modififed} onClick={this.save} label="Submit" />;

        return (
            <div>
                <Snackbar
                    open={message.isShow}
                    message={message.content}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
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
                            <div className='marginTop10'>
                                {listQuestions}
                            </div>
                        </CardTitle>
                        <CardActions>
                            {submitBtn}
                        </CardActions>
                    </Card>
                </Paper>
                <h4>
                    <RaisedButton primary={false} label='back' icon={<ArrowBack />} onTouchTap={this.goBack} />
                </h4>
            </div>
        );
    }
}

export default TestReviewComponent;