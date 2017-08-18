import React, { Component } from "react";
import TextField from 'material-ui/TextField';
import { Card, CardTitle } from 'material-ui/Card';

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
        const subtitle = '' + (index + 1);
        return (
            <Card className='defaultForm'>
                <CardTitle className='title' subtitle={subtitle + '.'}>
                    <span>{question.title}</span>
                    <TextField id={question.id}
                        fullWidth={true}
                        multiLine={true}
                        floatingLabelText={'Answer for question ' + subtitle}
                        onChange={this.onChange}
                        value={question.made}
                        disabled={disabled}
                    />
                </CardTitle>
            </Card>
        );
    }
}

export default TextQuestionComponent;
