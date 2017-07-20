import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
// import moment from 'moment';
import QuestionsApi from '../api/Questions';
import { RIETextArea, RIENumber, RIESelect } from 'riek';
import extend from 'extend';
import { Card, CardActions, CardTitle } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Snackbar from 'material-ui/Snackbar';

class QuestionDetailComponent extends Component {

    state = {
        redirectToReferer: false,
        message: {
            isShow: false,
            content: ''
        },
        typeOptions : [
            {id: "Text", text: "Text"},
            {id: "Pick", text: "Pick"}
        ],
        categoryOptions : [
            {id: "Developer", text: "Developer"},
            {id: "QA", text: "QA"}
        ],
        question: {
            answer: '',
            category: '',
            description: '',
            time: '',
            type: '',
            dateModified: ''
        },
        modififed: false
    }

    goBack = () => {
        this.setState({ redirectToReferer: true })
    }

    onChange = (newState) => {
        // console.log(newState);
        const key = Object.keys(newState)[0];
        switch (key) {
            case 'type':
                const type = newState.type.text;
                extend(this.props.question, {type: type});
                break;

            case 'category':
                const category = newState.category.text;
                extend(this.props.question, {category: category});
                break;
        
            default:
                extend(this.props.question, newState);
                break;
        }
        this.setState({modififed: true});
    }

    edit = () => {
        // console.log(this.props.question)
        QuestionsApi.update(this.props.question, res => {
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
        QuestionsApi.delete(this.props.question.id, res => {
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
    
    render() {
        const { question } = Object.keys(this.props.question).length ? this.props : this.state;
        const from = { pathname: '/questions' };
        const { redirectToReferer, message, modififed, typeOptions, categoryOptions } =  this.state;
        // console.log(this.props.question);
        const typeQuestion = {id: question.type, text: question.type};
        const category = {id: question.category, text: question.category};

        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }

        return (
            <div>
                <h2>Question Information</h2>
                <Snackbar
                    open={message.isShow}
                    message={message.content}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
                <Paper zDepth={2}>
                    <Card className='defaultForm'>
                        <CardTitle className='title' subtitle='Title'>
                            <RIETextArea propName='description' value={question.description} change={this.onChange} className='' />
                        </CardTitle>
                        <Divider />
                        <CardTitle subtitle='Category'>
                            <RIESelect propName='category' value={category} change={this.onChange} options={categoryOptions} />
                        </CardTitle>
                        <Divider />
                        <CardTitle subtitle='Correct Answer'>
                            <RIETextArea propName='answer' value={question.answer} change={this.onChange} />
                        </CardTitle>
                        <Divider />
                        <CardTitle subtitle='Type (Text | Pick)'>
                            <RIESelect propName='type' value={typeQuestion} change={this.onChange} options={typeOptions} />
                        </CardTitle>
                        <Divider />
                        <CardTitle subtitle='Time for answer (second)'>
                            <RIENumber propName='time' value={question.time} change={this.onChange} />
                        </CardTitle>
                        <CardActions>
                            <RaisedButton primary disabled={!modififed} onClick={this.edit} label="Save" />
                            <RaisedButton secondary onClick={this.delete} label="Delete" />
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

export default QuestionDetailComponent;