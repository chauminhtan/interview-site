import React, { Component } from "react";
import extend from 'extend';
import TextQuestionComponent from '../components/TextQuestionComponent';
import PickQuestionComponent from '../components/PickQuestionComponent';
import MultipleChoiceQuestionComponent from '../components/MultipleChoiceQuestionComponent';

class DisplayQuestionComponent extends Component {

    onChange = (question) => {
        let { questions } = this.props;
        for (let ques of questions) {
            if (ques.id === question.id) {
                ques = extend(ques, question);
                break;
            }
        }
        // console.log(questions);
        this.props.onChange(questions);
    }

    render() {
        const { questions, disabled } = this.props;
        
        if (questions.length === 0) {
            return (<p>Question is empty</p>);
        }

        return (
            <div>
            {questions.map( (question, index) => {
                let quesElement = '';
                switch (question.typeQ.toLowerCase()) {
                    case 'text':
                        quesElement = <TextQuestionComponent key={index} disabled={disabled} index={index} question={question} onChange={this.onChange} />
                        break;
                    case 'pick':
                        quesElement = <PickQuestionComponent key={index} disabled={disabled} index={index} question={question} onChange={this.onChange} />
                        break;
                    case 'multiple':
                        quesElement = <MultipleChoiceQuestionComponent key={index} disabled={disabled} index={index} question={question} onChange={this.onChange} />
                        break;
                    default:
                        quesElement = <TextQuestionComponent key={index} disabled={disabled} index={index} question={question} onChange={this.onChange} />
                        break;
                }
                return quesElement;
            })}
            </div>
        );
    }
}

export default DisplayQuestionComponent;
