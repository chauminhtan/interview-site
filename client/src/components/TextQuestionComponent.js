import React, { Component } from "react";
import TextField from 'material-ui/TextField';
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
                    <TextField id={question.id}
                        fullWidth={true}
                        multiLine={true}
                        floatingLabelText={'Answer for ' + subtitle}
                        onChange={this.onChange}
                        value={question.made}
                        disabled={disabled}
                    />
                </CardText>
            </Card>
        );
    }
}

export default TextQuestionComponent;
