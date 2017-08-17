import React, { Component } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

class TableQuestionComponent extends Component {

    state = {
        fixedHeader: true,
        stripedRows: false,
        showRowHover: false,
        selectable: true,
        multiSelectable: true,
        enableSelectAll: false,
        deselectOnClickaway: true,
        showCheckboxes: true,
    };

    _unSelectedQuestions(questions, selectedQuestions){
        // remove all current questions
        questions.map((row,index) => {
            let found = selectedQuestions.indexOf(row.id);
            if ( found !== -1 ) {
                selectedQuestions.splice(found, 1);
            }
            return true;
        });
        return selectedQuestions;
    }

    _selectedAllQuestions(questions, selectedQuestions){
        questions.map((row,index) => {
            if (selectedQuestions.indexOf(row.id) === -1) {
                selectedQuestions.push(row.id);
            }
            return true;
        })
        return selectedQuestions;
    }

    handleQuestionSelection = (selectedRows) => {
        console.log(selectedRows);
        const { questions } = this.props;
        let { selectedQuestions } = this.props;

        switch (selectedRows) {
            case 'all':
                selectedQuestions = this._selectedAllQuestions(questions, selectedQuestions);
                break;
            case 'none':
                selectedQuestions = this._unSelectedQuestions(questions, selectedQuestions);
                break;
            default:
                // firstly, remove all current questions
                selectedQuestions = this._unSelectedQuestions(questions, selectedQuestions);
                // then only push checked questions to selectedQuestions
                selectedRows.map((row,index) => {
                    if (selectedQuestions.indexOf(questions[row].id) === -1) {
                        selectedQuestions.push(questions[row].id);
                    }
                    return true;
                });
                break;
        }

        console.log(selectedQuestions);
        // callback to parent component with attached selectedQuestions
        this.props.updateSelectedQuestions(selectedQuestions);
    };

    isSelected = (selectedQuestions, data) => {
        return selectedQuestions.indexOf(data.id) !== -1;
    };

    render() {
        const { fixedHeader, stripedRows, showRowHover, selectable, multiSelectable, enableSelectAll, deselectOnClickaway, showCheckboxes  } = this.state;
        const { questions, selectedQuestions } = this.props;
        
        // console.log(selectedQuestions);
        if (questions.length === 0) {
            return (<p>Questions is empty</p>);
        }

        return (
            <Table 
                fixedHeader={fixedHeader}
                selectable={selectable}
                multiSelectable={multiSelectable}
                onRowSelection={this.handleQuestionSelection}>
                <TableHeader 
                    displaySelectAll={showCheckboxes}
                    adjustForCheckbox={showCheckboxes}
                    enableSelectAll={enableSelectAll}
                    >
                    <TableRow>
                        <TableHeaderColumn>Title</TableHeaderColumn>
                        <TableHeaderColumn>Language</TableHeaderColumn>
                        <TableHeaderColumn>Category</TableHeaderColumn>
                        <TableHeaderColumn>Type</TableHeaderColumn>
                        {/* <TableHeaderColumn>Created</TableHeaderColumn> */}
                    </TableRow>
                </TableHeader>
                <TableBody 
                    displayRowCheckbox={showCheckboxes}
                    deselectOnClickaway={deselectOnClickaway}
                    showRowHover={showRowHover}
                    stripedRows={stripedRows}>
                    {questions.map( (row, index) => (
                    <TableRow key={index} selected={this.isSelected(selectedQuestions, row)}>
                        <TableRowColumn>{row.title}</TableRowColumn>
                        <TableRowColumn>{row.language}</TableRowColumn>
                        <TableRowColumn>{row.category}</TableRowColumn>
                        <TableRowColumn>{row.typeQ}</TableRowColumn>
                        {/* <TableRowColumn>{moment(row.dateModified).fromNow()}</TableRowColumn> */}
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

export default TableQuestionComponent;
