import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import PositionsApi from '../api/Positions';

import extend from 'extend';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import { Input } from "semantic-ui-react";

import InputQtyPerCategory from '../components/InputQtyPerCategoryComponent';
import SelectFieldLangComponent from '../components/SelectFieldLangComponent';

class ClickableRow extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            redirectToReferer: ''
        }
    }

    onClick = (path) => {
        // console.log('clicked', path);
        path = '/positions/' + path; 
        this.setState({ redirectToReferer: path });
    }

    render() {
        const { redirectToReferer } = this.state;
        const { rowData, ...restProps } = this.props;
        if (redirectToReferer.length) {
            return (
                <Redirect to={{pathname: redirectToReferer}} />
            )
        }

        return (
            <TableRow {...restProps} onMouseDown={()=> this.onClick(rowData)}>
                {this.props.children}
            </TableRow>
        )
    }
}

class PositionsComponent extends Component {
    
    constructor (props) {
        super(props);

        this.state = {
            search: '',
            message: {
                isShow: false,
                content: ''
            },
            modalOpen: false,
            filteredPositions: [],
            position: {
                name: '',
                languages: []
            },
            isReadySubmit: false,
            isReadyGenerate: false,
            redirectToReferer: ''
        }
    }

    addData = () => {
        // call to api server
        let data = this.state.position;
        console.log(data);
        PositionsApi.create(data, res => {

            let message = extend({}, this.state.message);
            message.content = res.message;
            message.isShow = true;
            if(res.status === 1) {
                //
                // return;
            }

            this.setState({ 
                message: message, 
                modalOpen: false
            }, this.props.onComponentRefresh());
        });
    }

    isValid = (position) => {
        return position.name.length && 
            position.languages.length;
    }

    onChange = (e) => {
        let position = extend({}, this.state.position);
        position[e.target.id] = e.target.value;
        // console.log(position);
        const isValidSubmit = this.isValid(position);
        this.setState({ 
            position: position, 
            isReadySubmit: isValidSubmit
        });
    }

    handleChangeLang = (values) => {
        // console.log(values);
        let position = extend({}, this.state.position);
        position.languages = values;
        const isValidSubmit = this.isValid(position);
        this.setState({ 
            position: position, 
            isReadySubmit: isValidSubmit
        });
    }

    handleRequestClose = () => {
        let message = extend({}, this.state.message);
        message.isShow = false;
        this.setState({ message: message });
    }

    handleOpen = (e) => this.setState({
        modalOpen: true,
    })

    handleClose = (e) => this.setState({
        modalOpen: false,
    })

    handleRowSelection = (selectedRows) => {
        console.log(selectedRows);
    }

    handleSearch = (event) => {
        const positions = this.props.positions;
        let filteredPositions = positions.filter(item => {
            return item.name.toLowerCase().search(event.target.value) > -1;
        });
        
        this.setState({
            search: event.target.value,
            filteredPositions: filteredPositions
        });
    };

    // Update the data when the component mounts
    componentDidMount() {
        console.log('componentDidMoun');
    }

    onCategoryChange = (data) => {
        console.log(data);
        let position = extend({}, this.state.position);
        position.languages.forEach( (lang, i) => {
            if (lang.name === data.language) {
                lang.categories.forEach(category => {
                    if (category.title === data.category) {
                        category.quantity = data.value;
                    }
                })
            }
        })
        console.log(position.languages);
        const isValidSubmit = this.isValid(position);
        this.setState({ 
            position: position, 
            isReadySubmit: isValidSubmit
        });
    }

    getCategories(selectedLangs) {
        let categories = [];
        selectedLangs.forEach( (lang, i) => {
            lang.categories.forEach(category => {
                const inputName = lang.name + '-' + category.title;
                categories.push(<InputQtyPerCategory key={inputName} category={category.title} language={lang.name} name={inputName} value={category.quantity} onChange={this.onCategoryChange} />);
            })
        });
        
        return categories;
    }

    render() {
        const { message, isReadySubmit, position, redirectToReferer, search } =  this.state;
        const { positions, languages } = this.props;
        const filteredPositions = this.state.filteredPositions.length > 0 ? this.state.filteredPositions : positions;
        // console.log(position.languages);
        if (redirectToReferer.length) {
            return (
                <Redirect to={{ pathname: redirectToReferer }} />
            )
        }

        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleClose}
                />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.addData}
                disabled={!isReadySubmit}
                />,
        ];

        const langNames = position.languages.map(lang => lang.name);
        let LangSelectField = languages ? 
            (<SelectFieldLangComponent value={langNames} languages={languages} onChange={this.handleChangeLang} />) : '';

        let categoriesField = position.languages.length ? this.getCategories(position.languages) : '';
        
        return (
            <div>
                <Snackbar
                    open={message.isShow}
                    message={message.content}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
                <Dialog
                    title="New Position"
                    actions={actions}
                    modal={false}
                    open={this.state.modalOpen}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                    >
                    <TextField id="name"
                        fullWidth={true}
                        hintText="Name Field"
                        floatingLabelText="Name"
                        onChange={this.onChange}
                        value={position.name}
                        /><br />
                    { LangSelectField }<br />
                    { categoriesField }
                </Dialog>
                <h5>
                    <Input icon='search' value={search} onChange={this.handleSearch} placeholder='Search...' />
                    <FloatingActionButton mini={true} secondary={true} style={{float: 'right'}} onTouchTap={this.handleOpen}>
                        <ContentAdd />
                    </FloatingActionButton>
                    <div className='clear' />
                </h5>
                <Paper zDepth={2}>
                    <Table onRowSelection={this.handleRowSelection}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                <TableHeaderColumn>Languages</TableHeaderColumn>
                                <TableHeaderColumn>Created</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} showRowHover={true} stripedRows={true}>
                            {filteredPositions.map( (row, index) => (
                            <ClickableRow key={index} rowData={row.id}>
                                <TableRowColumn>{row.name}</TableRowColumn>
                                <TableRowColumn>{row.languages.map(lang => lang.name).join(', ')}</TableRowColumn>
                                <TableRowColumn>{moment(row.dateModified).fromNow()}</TableRowColumn>
                            </ClickableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
}

export default PositionsComponent;