import React, { Component } from "react";
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';
import { Card, CardTitle, CardText } from 'material-ui/Card';

class MultipleChoiceQuestion extends Component {
    
    constructor (props) {
        super(props);
        this.state = {
            separator: ',',
            isCorrect: false
        }
    }

    onChange = (e, isChecked) => {
        let { question } = this.props;
        const value = e.target.value;
        const { separator } = this.state;
        let arAnswer = question.made.length ? question.made.split(separator) : [];

        if (isChecked) {
            arAnswer.push(value);
        } else {
            arAnswer = this._removeOutArray(value, arAnswer);
        }
        
        question.made = arAnswer.join(separator);
        // console.log(question.made);
        this.props.onChange(question);
    }

    _removeOutArray(item, arr) {
        let found = arr.indexOf(item);
        if ( found !== -1 ) {
            arr.splice(found, 1);
        }
        return arr;
    }

    handleToggle = (e, toggle) => {
        let { question } = this.props;

        question.isCorrect = toggle;
        this.setState({
            isCorrect: toggle
        }, this.props.onChange(question));
    }

    isChecked(values, index) {
        const { separator } = this.state;
        const arAnswer = values.length ? values.split(separator) : [];
        return arAnswer.indexOf(index.toString()) !== -1;
    }

    render() {
        const { question, index, disabled } = this.props;
        const { isCorrect } = this.state;
        // console.log(this.props);
        const subtitle = (index + 1) + '.';
        const answer = question.answer ? <CardTitle className='title answer' subtitle='correct'>{question.answer}</CardTitle> : '';
        const className = question.isCorrect ? 'correctQuestion' : '';
        const review = !question.answer.length > 0 ? '' :
            <CardText>
                <Toggle
                    toggled={question.isCorrect || isCorrect}
                    onToggle={this.handleToggle}
                    labelPosition='right'
                    label='is correct'
                    />
            </CardText>;

        return (
            <Card className={className}>
                <CardTitle className='title' subtitle={subtitle}>
                    <span>{question.title}</span>
                </CardTitle>
                {answer}
                {review}
                <CardText>
                    {question.pickAnswers.map((item, i) => 
                        <Checkbox
                            key={i}
                            value={item.id}
                            checked={this.isChecked(question.made, item.id)}
                            onCheck={this.onChange}
                            label={item.text}
                            disabled={disabled}
                            className='checkBox'
                            />
                    )}
                </CardText>
            </Card>
        );
    }
}

export default MultipleChoiceQuestion;
