import React, { Component } from "react";
import Checkbox from 'material-ui/Checkbox';
import { Card, CardTitle, CardText } from 'material-ui/Card';

class MultipleChoiceQuestion extends Component {
    
    constructor (props) {
        super(props);
        this.state = {
            separator: ','
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

    isChecked(values, index) {
        const { separator } = this.state;
        const arAnswer = values.length ? values.split(separator) : [];
        return arAnswer.indexOf(index.toString()) !== -1;
    }

    render() {
        const { question, index, disabled } = this.props;
        // console.log(this.props);
        const subtitle = (index + 1) + '.';
        return (
            <Card className='defaultForm'>
                <CardTitle className='title' subtitle={subtitle}>
                    <span>{question.title}</span>
                </CardTitle>
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
