import React, { Component } from "react";
import TextField from 'material-ui/TextField';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';

class TextQuestionComponent extends Component {

    constructor (props) {
        super(props);
        this.state = {
            isCorrect: false
        }
    }

    onChange = (e) => {
        let { question } = this.props;
        question.made = e.target.value;
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
        const subtitle = '' + (index + 1);
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
                <CardTitle className='title' subtitle={subtitle + '.'}>
                    <span>{question.title}</span>
                </CardTitle>
                {answer}
                {review}
                <CardText>
                    <TextField id={question.id}
                        fullWidth={true}
                        multiLine={true}
                        floatingLabelText={'Answer for question ' + subtitle}
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
