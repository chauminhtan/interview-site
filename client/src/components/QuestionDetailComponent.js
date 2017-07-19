import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
// import { Button, Card, Icon, Message, Header } from 'semantic-ui-react';
import { Button, Icon } from 'semantic-ui-react';
import moment from 'moment';
import QuestionsApi from '../api/Questions';
import { RIEInput, RIETextArea, RIENumber, RIESelect } from 'riek';
import extend from 'extend';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import GoBack from 'material-ui/svg-icons/navigation/chevron-left';
import FloatingActionButton from 'material-ui/FloatingActionButton';

class QuestionDetailComponent extends Component {

    state = {
        redirectToReferer: false,
        message: {
            isShow: false,
            content: ''
        },
        typeOptions : [
            {id: "text", text: "text"},
            {id: "pick", text: "pick"}
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
        console.log(newState);
        if (newState.hasOwnProperty('type')) {
            const type = newState.type.text;
            extend(this.props.question, {type: type});
        }
        else {
            extend(this.props.question, newState);
        }
        this.setState({modififed: true});
    }

    edit = () => {
        console.log(this.props.question)
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
    
    render() {
        const { question } = Object.keys(this.props.question).length ? this.props : this.state;
        const from = { pathname: '/questions' };
        const { redirectToReferer, message, modififed, typeOptions } =  this.state;
        // console.log(this.props.question);
        const typeQuestion = {id: question.type, text: question.type};

        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }

        return (
            <div>
                <h2>Question Information</h2>
                <Card className='defaultForm'>
                    <CardTitle subtitle='Title'>
                        <b>
                            <RIETextArea propName='description' value={question.description} change={this.onChange} className='' />
                        </b>
                    </CardTitle>
                    <Divider />
                    <CardTitle subtitle='Category'>
                        <RIEInput propName='category' value={question.category} change={this.onChange} />
                    </CardTitle>
                    <Divider />
                    <CardTitle subtitle='Answer'>
                        <RIETextArea propName='answer' value={question.answer} change={this.onChange} />
                    </CardTitle>
                    <Divider />
                    <CardTitle subtitle='Type'>
                        <RIESelect propName='type' value={typeQuestion} change={this.onChange} options={typeOptions} />
                    </CardTitle>
                    <Divider />
                    <CardTitle subtitle='Time'>
                        <RIENumber propName='time' value={question.time} change={this.onChange} />
                    </CardTitle>
                    <Divider />
                    <CardActions>
                        <FlatButton primary disabled={!modififed} onClick={this.edit} label="Save" />
                        <FlatButton secondary onClick={this.delete} label="Delete" />
                    </CardActions>
                </Card>
                <Divider />
                <h4>
                    <FloatingActionButton secondary={true} onTouchTap={this.goBack}>
                        <GoBack />
                    </FloatingActionButton>
                </h4>
            </div>
        );
    }
}

export default QuestionDetailComponent;