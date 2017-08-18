import React, { Component } from "react";
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { Card, CardTitle, CardText } from 'material-ui/Card';

class PickQuestionComponent extends Component {

    onChange = (e, value) => {
        let { question } = this.props;
        const val = parseInt(value, 10);
        question.made = val ? val : 0;
        // console.log(question);
        this.props.onChange(question);
    }

    render() {
        const { question, index, disabled } = this.props;
        // console.log(this.props);
        const subtitle = '' + (index + 1) + '.';
        const defaultSelected = parseInt(question.made, 10);
        return (
            <Card className='defaultForm'>
                <CardTitle className='title' subtitle={subtitle}>
                    <span>{question.title}</span>
                </CardTitle>
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
