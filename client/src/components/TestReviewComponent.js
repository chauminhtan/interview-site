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
import DisplayReviewQuestionComponent from '../components/DisplayReviewQuestionComponent';
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
            modififed: false,
            point: this.props.result.point
        }
    }

    goBack = () => {
        // this.setState({ redirectToReferer: true })
        this.props.goBack();
    }

    onChange = (data) => {
        // console.log(data)
        let point = 0;
        this.props.result.test.questions = data;
        this.props.result.test.questions.map(ques => {
            if (ques.isCorrect) {
                point++;
            }
            return true;
        })
        this.props.result.point = point;

        this.setState({
            modififed: true,
            point: point
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
        const { result } = this.props;
        const test = result.test;
        const from = { pathname: '/tests' };
        const { redirectToReferer, message, modififed, point } =  this.state;
        
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
                <DisplayReviewQuestionComponent questions={test.questions} disabled={true} onChange={this.onChange} />
            )
            : '';

        const submitBtn = !result.done ? '' : <RaisedButton secondary disabled={!modififed} onClick={this.save} label="Submit" />;

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
                        <CardTitle subtitle='Point'>
                            {result.done ? point + ' / ' + result.test.questions.length : '-'}
                        </CardTitle>
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