import React, { Component } from "react";
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { Card, CardTitle, CardText } from 'material-ui/Card';

class TextQuestionComponent extends Component {

    onChange = (e) => {
        let { question } = this.props;
        question.made = e.target.value;
        // console.log(question);
        this.props.onChange(question);
    }

    render() {
        const { question, index, disabled } = this.props;
        // console.log(this.props);
        const subtitle = 'Question ' + (index + 1);
        return (
            <Card className='defaultForm'>
                <CardTitle className='title' subtitle={subtitle}>
                    {question.title}
                </CardTitle>
                <CardText>
                    <RadioButtonGroup name={question.id}>
                        {question.pickAnswers.map((item, i) => 
                            <RadioButton
                                value={item.id}
                                label={item.text}
                                className='radioButton'
                                />
                        )}
                    </RadioButtonGroup>
                </CardText>
            </Card>
        );
    }
}

export default TextQuestionComponent;
