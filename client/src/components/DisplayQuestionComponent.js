import React, { Component } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import extend from 'extend';
import TextQuestionComponent from '../components/TextQuestionComponent';
import PickQuestionComponent from '../components/PickQuestionComponent';

class DisplayQuestionComponent extends Component {

    state = {
        fixedHeader: true,
        stripedRows: false,
        showRowHover: false,
        selectable: true,
        multiSelectable: false,
        enableSelectAll: false,
        deselectOnClickaway: true,
        showCheckboxes: false,
    };

    onChange = (question) => {
        let { questions, disabled } = this.props;
        for (let ques of questions) {
            if (ques.id === question.id) {
                ques = extend(ques, question);
                break;
            }
        }
        console.log(questions);
    }

    render() {
        const { fixedHeader, stripedRows, showRowHover, selectable, multiSelectable, enableSelectAll, deselectOnClickaway, showCheckboxes  } = this.state;
        const { questions, disabled } = this.props;
        
        // console.log(selectedQuestions);
        if (questions.length === 0) {
            return (<p>Questions is empty</p>);
        }

        return (
            <div>
            { questions.map( (question, index) => {
                switch (question.typeQ.toLowerCase()) {
                    case 'text':
                        return <TextQuestionComponent key={index} disabled={disabled} index={index} question={question} onChange={this.onChange} />
                        break;
                    case 'pick':
                        return <PickQuestionComponent key={index} disabled={disabled} index={index} question={question} onChange={this.onChange} />
                        break;
                    case 'multiple':
                        return <TextQuestionComponent key={index} disabled={disabled} index={index} question={question} onChange={this.onChange} />
                        break;
                    default:
                        return <TextQuestionComponent key={index} disabled={disabled} index={index} question={question} onChange={this.onChange} />
                        break;
                }
            })}
            </div>
        );

        // return (
        //     <Table 
        //         fixedHeader={fixedHeader}
        //         selectable={selectable}
        //         multiSelectable={multiSelectable}>
        //         <TableHeader 
        //             displaySelectAll={showCheckboxes}
        //             adjustForCheckbox={showCheckboxes}
        //             enableSelectAll={enableSelectAll}>
        //             <TableRow>
        //                 <TableHeaderColumn>Title</TableHeaderColumn>
        //                 <TableHeaderColumn>Language</TableHeaderColumn>
        //                 <TableHeaderColumn>Category</TableHeaderColumn>
        //             </TableRow>
        //         </TableHeader>
        //         <TableBody 
        //             displayRowCheckbox={showCheckboxes}
        //             deselectOnClickaway={deselectOnClickaway}
        //             showRowHover={showRowHover}
        //             stripedRows={stripedRows}>
        //             {questions.map( (row, index) => (
        //             <TableRow key={index}>
        //                 <TableRowColumn>{row.title}</TableRowColumn>
        //                 <TableRowColumn>{row.language}</TableRowColumn>
        //                 <TableRowColumn>{row.category}</TableRowColumn>
        //             </TableRow>
        //             ))}
        //         </TableBody>
        //     </Table>
        // );
    }
}

export default DisplayQuestionComponent;
