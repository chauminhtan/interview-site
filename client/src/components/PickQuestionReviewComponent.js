import React, { Component } from "react";
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Toggle from 'material-ui/Toggle';
import { Card, CardTitle, CardText } from 'material-ui/Card';

class PickQuestionComponent extends Component {

    constructor (props) {
        super(props);
        this.state = {
            isCorrect: false
        }
    }

    onChange = (e, value) => {
        let { question } = this.props;
        const val = parseInt(value, 10);
        question.made = val ? val : 0;
        // console.log(question);
        this.props.onChange(question);
    }

    handleToggle = (e, toggle) => {
        let { question } = this.props;

        question.isCorrect = toggle;
        this.setState({
            isCorrect: toggle
        }, this.props.onChange(question));
    }

    render() {
        const { question, index, disabled } = this.props;
        const { isCorrect } = this.state;
        // console.log(this.props);
        const subtitle = '' + (index + 1) + '.';
        const defaultSelected = parseInt(question.made, 10);
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
                    <RadioButtonGroup name={question.id} defaultSelected={defaultSelected} onChange={this.onChange}>
                        {question.pickAnswers.map((item, i) => 
                            <RadioButton
                                key={i}
                                value={item.id}
                                label={item.text}
                                disabled={disabled}
                                className='radioButton'
                                />
                        )}
                    </RadioButtonGroup>
                </CardText>
            </Card>
        );
    }
}

export default PickQuestionComponent;
