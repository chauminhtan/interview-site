import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
// import moment from 'moment';
import QuestionsApi from '../api/Questions';
import { RIETextArea, RIENumber, RIESelect } from 'riek';
import extend from 'extend';
import { Card, CardActions, CardTitle } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Snackbar from 'material-ui/Snackbar';
import {Tabs, Tab} from 'material-ui/Tabs';
import PickAnswerComponent from '../components/PickAnswerComponent';

class QuestionDetailComponent extends Component {

    state = {
        redirectToReferer: false,
        message: {
            isShow: false,
            content: ''
        },
        typeOptions : [
            { id: "Text", text: "Text" },
            { id: "Pick", text: "Pick" },
            { id: "Multiple", text: "Multiple" }
        ],
        categoryOptions : [
            {id: "Coding", text: "Coding"},
            {id: "Other", text: "Other"}
        ],
        question: {
            answer: '',
            category: '',
            language: '',
            title: '',
            time: '',
            type: '',
            pickAnswers: [],
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
                extend(this.props.question, {typeQ: type});
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
        let data = this.props.question;
        QuestionsApi.update(data, res => {
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

    newAnswer (id) {
        return {id: id, text: 'New Answer'};
    }

    addMoreAnswer = () => {
        let question = this.props.question;
        const newAnswer = this.newAnswer(question.pickAnswers.length + 1);
        question.pickAnswers.push(newAnswer);
        console.log(question);
        this.setState({modififed: true});
    }

    removedAnswer = (key) => {
        console.log(key);
        let question = this.props.question;
        question.pickAnswers = question.pickAnswers.filter((answer, index) => {
            return index !== key;
        })

        console.log(this.props.question);
        this.setState({modififed: true});
    }

    onPickAnswerChange = (data) => {
        let question = this.props.question;
        if (data.index > -1 && data.index <= question.pickAnswers.length) {
            question.pickAnswers[data.index] = {id: data.index + 1, text: data.value};
            console.log(this.props.question);
            this.setState({modififed: true});
        }
    }

    renderAnswer(answer, i) {
        return (
            <PickAnswerComponent key={i} AnswerIndex={i} answer={answer} onRemoved={this.removedAnswer} onChange={this.onPickAnswerChange} />
        )
    }

    renderAnswers(question) {
        console.log(question);
        let totalPickAnswer = question.pickAnswers ? question.pickAnswers.length : 0;
        let renderPickAnswers = [];
        console.log(totalPickAnswer);
        for (let i=0; i < totalPickAnswer; i++) {
            renderPickAnswers.push(this.renderAnswer(question.pickAnswers[i].text, i));
        }
        const moreAnswer = <FlatButton key={totalPickAnswer + 1} label="add more" onTouchTap={this.addMoreAnswer} />;
        renderPickAnswers.push(moreAnswer);
        return (<CardTitle subtitle='Pick Answers'>{renderPickAnswers}</CardTitle>);
    }
    
    render() {
        const { question } = Object.keys(this.props.question).length ? this.props : this.state;
        const from = { pathname: '/questions' };
        const { redirectToReferer, message, modififed, typeOptions, categoryOptions } =  this.state;
        console.log(this.props.question);
        const typeQuestion = {id: question.typeQ, text: question.typeQ};
        const category = {id: question.category, text: question.category};
        
        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }

        let renderPickAnswers = question.typeQ && (question.typeQ.toLowerCase() === 'pick' || question.typeQ.toLowerCase() === 'multiple') ? 
                                this.renderAnswers(question) : '';

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
                    <Tabs>
                        <Tab label="Question" >
                            <Card className='defaultForm'>
                                <CardTitle className='title' subtitle='Title'>
                                    <RIETextArea propName='title' value={question.title} change={this.onChange} />
                                </CardTitle>
                                <Divider />
                                <CardTitle subtitle='Language'>
                                    {question.language}
                                </CardTitle>
                                <Divider />
                                <CardTitle subtitle='Category'>
                                    <RIESelect propName='category' value={category} change={this.onChange} options={categoryOptions} />
                                </CardTitle>
                                <Divider />
                                {/* <CardTitle subtitle='Correct Answer'>
                                    <RIETextArea propName='answer' value={question.answer} change={this.onChange} />
                                </CardTitle>
                                <Divider />
                                <CardTitle subtitle='Type (Text | Pick)'>
                                    <RIESelect propName='type' value={typeQuestion} change={this.onChange} options={typeOptions} />
                                </CardTitle>
                                <Divider /> */}
                                <CardTitle subtitle='Time for answer (second)'>
                                    <RIENumber propName='time' value={question.time} change={this.onChange} />
                                </CardTitle> 
                                <CardActions>
                                    <RaisedButton primary disabled={!modififed} onClick={this.edit} label="Save" />
                                    <RaisedButton secondary onClick={this.delete} label="Delete" />
                                </CardActions>
                            </Card>
                        </Tab>
                        <Tab label="Answer" >
                            <Card>
                                <Divider />
                                <CardTitle subtitle='Correct Answer'>
                                    <RIETextArea className='fullWidth' propName='answer' value={question.answer} change={this.onChange} />
                                </CardTitle>
                                <Divider />
                                <CardTitle subtitle='Type (Text | Pick | Multiple)'>
                                    <RIESelect propName='type' value={typeQuestion} change={this.onChange} options={typeOptions} />
                                </CardTitle>
                                <Divider />
                                {/* <CardTitle subtitle='Pick Answers'> */}
                                    { renderPickAnswers }
                                {/* </CardTitle>  */}
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

export default QuestionDetailComponent;