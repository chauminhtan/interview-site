import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import moment from 'moment';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import ContentCreate from 'material-ui/svg-icons/content/create';

class ClickableRow extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            redirectToReferer: ''
        }
    }

    onClick = (path) => {
        // console.log('clicked', path);
        // path = '/tests/' + path; 
        this.setState({ redirectToReferer: path });
    }

    render() {
        const { redirectToReferer } = this.state;
        const { rowData, ...restProps } = this.props;
        if (redirectToReferer.length) {
            return (
                <Redirect push={true} to={{pathname: redirectToReferer}} />
            )
        }
        
        return (
            <TableRow {...restProps} onMouseDown={()=> this.onClick(rowData)}>
                {this.props.children}
            </TableRow>
        )
    }
}

class TableAssignmentComponent extends Component {

    constructor (props) {
        super(props);
        
        this.state = {
            fixedHeader: true,
            stripedRows: true,
            showRowHover: true,
            selectable: true,
            multiSelectable: false,
            enableSelectAll: false,
            deselectOnClickaway: false,
            showCheckboxes: false,
        }
    }

    getStatus(result) {
        // let status = '';
        // if (result.done) {
        //     status += <ContentCreate />;
        // }
        // if (result.isChecked) {
        //     status += <RemoveRedEye />;
        // }
        const done = result.done ? <ContentCreate key={result.id + 'done'} /> : '';
        const checked = result.isChecked ? <RemoveRedEye key={result.id + 'checked'} /> : '';
        // console.log(status)
        return [done, checked];
    }

    isReviewed(result) {
        console.log(result)
        return result.isChecked ? <RemoveRedEye /> : '';
    }

    render() {
        const { fixedHeader, stripedRows, showRowHover, selectable, multiSelectable, enableSelectAll, deselectOnClickaway, showCheckboxes  } = this.state;
        const { assignments, clickable, path } = this.props;
        
        // console.log(assignments);
        // if (!assignments || assignments.length === 0) {
        //     return (<p>Data is empty</p>);
        // }
        
        return (
            <Table 
                fixedHeader={fixedHeader}
                selectable={selectable}
                multiSelectable={multiSelectable}>
                <TableHeader 
                    displaySelectAll={showCheckboxes}
                    adjustForCheckbox={showCheckboxes}
                    enableSelectAll={enableSelectAll}>
                    <TableRow>
                        <TableHeaderColumn>Test Title</TableHeaderColumn>
                        <TableHeaderColumn>User</TableHeaderColumn>
                        <TableHeaderColumn>Created</TableHeaderColumn>
                        <TableHeaderColumn>Status</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody 
                    displayRowCheckbox={showCheckboxes}
                    deselectOnClickaway={deselectOnClickaway}
                    showRowHover={showRowHover}
                    stripedRows={stripedRows}>
                    {!assignments && (
                    <TableRow>
                        <TableRowColumn colSpan="4" style={{textAlign: 'center'}}>
                            Data is empty
                        </TableRowColumn>
                    </TableRow>
                    )}
                    {clickable && assignments && assignments.map( (row, index) => (
                    <ClickableRow key={index} rowData={path + row.id}>
                        <TableRowColumn>{row.test.title}</TableRowColumn>
                        <TableRowColumn>{row.user.name}</TableRowColumn>
                        <TableRowColumn>{moment(row.dateModified).fromNow()}</TableRowColumn>
                        <TableRowColumn>{this.getStatus(row)}</TableRowColumn>
                    </ClickableRow>
                    ))}
                    {!clickable && assignments && assignments.map( (row, index) => (
                    <TableRow key={index}>
                        <TableRowColumn>{row.test.title}</TableRowColumn>
                        <TableRowColumn>{row.user.name}</TableRowColumn>
                        <TableRowColumn>{moment(row.dateModified).fromNow()}</TableRowColumn>
                        <TableRowColumn>{this.getStatus(row)}</TableRowColumn>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

export default TableAssignmentComponent;
