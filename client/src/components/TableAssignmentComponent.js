import React, { Component } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import moment from 'moment';

class TableAssignmentComponent extends Component {

    render() {
        const { assignments } = this.props;
        
        console.log(assignments);
        // if (!assignments || assignments.length === 0) {
        //     return (<p>Data is empty</p>);
        // }

        return (
            <Table fixedHeader={true}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>Test Title</TableHeaderColumn>
                        <TableHeaderColumn>User</TableHeaderColumn>
                        <TableHeaderColumn>Created</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} showRowHover={true} stripedRows={true}>
                    {!assignments && (
                    <TableRow>
                        <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                            Data is empty
                        </TableRowColumn>
                    </TableRow>
                    )}
                    {assignments && assignments.map( (row, index) => (
                    <TableRow key={index}>
                        <TableRowColumn>{row.test.title}</TableRowColumn>
                        <TableRowColumn>{row.user.name}</TableRowColumn>
                        <TableRowColumn>{moment(row.dateModified).fromNow()}</TableRowColumn>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

export default TableAssignmentComponent;
