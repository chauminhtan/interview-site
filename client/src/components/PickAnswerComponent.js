import React, { Component } from "react";
import IconButton from 'material-ui/IconButton';
import ContentRemoved from 'material-ui/svg-icons/content/remove-circle';
import { RIEInput } from 'riek';

const styles = {
    pickAnswer: {
        margin: 4,
    }
}

class PickAnswer extends Component {

    onChange = (newState) => {
        const key = Object.keys(newState)[0];
        const index = parseInt(key.substr(6), 10);
        if (index > -1) {
            const data = {index: index, value: newState[key]};
            console.log(data);
            this.props.onChange(data);
        }
    }

    render() {
        const { answer, AnswerIndex, onRemoved } = this.props;
        let value = answer ? answer : '';
        // console.log(answer);
        return (
            <div style={styles.pickAnswer} key={AnswerIndex}>
                <IconButton tooltip="Removed this answer" tooltipPosition="top-right" onTouchTap={ onRemoved.bind(this, AnswerIndex) }>
                    <ContentRemoved />
                </IconButton>
                <RIEInput propName={'Answer'+AnswerIndex} value={value} change={ this.onChange } />
            </div>
        );
    }
}

export default PickAnswer;
