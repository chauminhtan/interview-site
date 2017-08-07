import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import QuestionsApi from '../api/Questions';
import TestsApi from '../api/Tests';
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
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";
import TextField from 'material-ui/TextField';
import moment from 'moment';
import { Input } from "semantic-ui-react";

// const ClickableRow = (props) => {
//   // Destructure props to keep the expected MUI TableRow props
//   // while having access to the rowData prop
//   const {rowData, ...restProps} = props;
//   return (
//     <TableRow
//       {...restProps}
//       onMouseDown={()=> console.log('clicked', props.rowData)}>
//       {props.children}
//     </TableRow>
//   )
// };

class ClickableRow extends Component {
    state = {
        redirectToReferer: ''
    }

    onClick = (path) => {
        // console.log('clicked', path);
        path = '/tests/' + path; 
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

class TestsComponent extends Component {
    constructor (props) {
        super(props);
        this.state = {
            search: '',
            language: '',
            category: '',
            message: {
                isShow: false,
                content: ''
            },
            modalOpen: false,
            positions: [],
            questions: [],
            originalQuestions: [],
            selectedQuestions: [],
            tests: [],
            originalTests: [],
            test: {
                title: '',
                position: { 
                    name: '', id: ''
                },
                questions: [],
                time: 0
            },
            isReadySubmit: false,
            isReadyGenerate: false,
            redirectToReferer: ''
        }
    }

    addData = () => {
        // call to api server
        let data = this.state.test;
        // console.log(data);
        TestsApi.create(data, res => {

            let message = extend({}, this.state.message);
            message.content = res.message;
            message.isShow = true;
            if(res.status === 1) {
                //
                // return;
            }

            this.setState({ message: message, modalOpen: false, loading: true }, this.updateData);
        });
    }

    generateData = () => {
        // call to api server
        let data = this.state.test;
        // console.log(data);
        TestsApi.generate(data, res => {

            let message = extend({}, this.state.message);
            message.content = res.message;
            message.isShow = true;
            if(res.status === 1) {
                //
                // return;
            }

            this.setState({ message: message, modalOpen: false, loading: true }, this.updateData);
        });
    }

    isValid = (test) => {
        return test.title.length && 
            test.position.name.length && 
            test.questions.length && 
            test.time > 0;
    }

    isValidGenerate = (test) => {
        return test.title.length && 
            test.position.name.length;
    }

    onChange = (e) => {
        let test = extend({}, this.state.test);
        test[e.target.id] = e.target.value;
        // console.log(test);
        const isValidSubmit = this.isValid(test);
        const isValidGenerate = this.isValidGenerate(test);
        this.setState({ 
            test: test, 
            isReadySubmit: isValidSubmit, 
            isReadyGenerate: isValidGenerate
        });
    }

    handleChangePosition = (event, index, value) => {
        // console.log(value);
        let test = extend({}, this.state.test);
        test.position = value;
        const isValidSubmit = this.isValid(test);
        const isValidGenerate = this.isValidGenerate(test);
        this.setState({ 
            test: test, 
            isReadySubmit: isValidSubmit, 
            isReadyGenerate: isValidGenerate, 
            language: '', 
            category: '' 
        });
    }

    handleChangeLang = (event, index, value) => {
        console.log(value)
        const questions = this.state.originalQuestions;
        let filteredQuestions = questions.filter(question => {
            return question.language.search(value) > -1;
        });
        
        this.setState({
            language: value,
            questions: filteredQuestions
        });
    }

    handleChangeCategory = (event, index, value) => {
        // console.log(value);
        const { originalQuestions, language } = this.state;
        let filteredQuestions = originalQuestions.filter(question => {
            return language.length ? 
                question.language.toLowerCase() === language.toLowerCase() && question.category.toLowerCase() === value.toLowerCase() :
                question.category.toLowerCase() === value.toLowerCase();
        });
        // console.log(filteredQuestions);
        this.setState({
            category: value,
            questions: filteredQuestions
        });
    };

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
        // const rows = this.state.tests;
        // for (var key in rows) {
        //     if (key === selectedRows[0].toString()) {
        //         // redirect to user detail page
        //         this.setState({ redirectToReferer: '/tests/' + rows[key].id })
        //         break;
        //     }
        // }
    }

    _unSelectedQuestions(questions, selectedQuestions){
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

    _updateSelectedQuestions(originalQuestions, selectedQuestions){
        let questions = [], time = 0;
        originalQuestions.map((row,index) => {
            let found = selectedQuestions.indexOf(row.id);
            if ( found !== -1 ) {
                row.typeQ = row.type;
                questions.push(row);
                time += row.time;
            }
            return true;
        });
        return { questions, time }
    }

    handleQuestionSelection = (selectedRows) => {
        console.log(selectedRows);
        const { questions, originalQuestions } = this.state;
        let { selectedQuestions } = this.state;
        let test = extend({}, this.state.test);
        test.questions = [];
        test.time = 0;

        switch (selectedRows) {
            case 'all':
                selectedQuestions = this._selectedAllQuestions(questions, selectedQuestions);
                break;
            case 'none':
                selectedQuestions = this._unSelectedQuestions(questions, selectedQuestions);
                break;
            default:
                selectedQuestions = this._unSelectedQuestions(questions, selectedQuestions);
                // only select checked questions
                selectedRows.map((row,index) => {
                    if (selectedQuestions.indexOf(questions[row].id) === -1) {
                        selectedQuestions.push(questions[row].id);
                    }
                    return true;
                });
                break;
        }

        let refreshData = this._updateSelectedQuestions(originalQuestions, selectedQuestions);
        test.questions = refreshData.questions;
        test.time = refreshData.time;

        const isValidSubmit = this.isValid(test);
        const isValidGenerate = this.isValidGenerate(test);
        console.log(selectedQuestions);
        console.log(test);
        this.setState({ 
            test: test, 
            selectedQuestions: selectedQuestions, 
            isReadySubmit: isValidSubmit, 
            isReadyGenerate: isValidGenerate
        });
    };

    isSelected = (data) => {
        return this.state.selectedQuestions.indexOf(data.id) !== -1;
    };

    handleSearch = (event) => {
        const tests = this.state.originalTests;
        let filteredTests = tests.filter(test => {
            return test.title.search(event.target.value) > -1;
        });
        
        this.setState({
            search: event.target.value,
            tests: filteredTests
        });
    };

    // Update the data when the component mounts
    componentDidMount() {
        console.log('componentDidMoun');
        this.getQuestionData();
        this.getPositionData();
        this.setState({loading: true}, this.updateData);
    }

    // Call out to server data and refresh directory
    updateData = () => {
        TestsApi.getAll(res => {
            // console.log(res);
            this.setState({
                loading: false,
                tests: res.data,
                originalTests: res.data,
            }, this.props.onComponentRefresh);
        })
    }

    // Call out to server data and refresh directory
    getQuestionData = () => {
        QuestionsApi.getAll(res => {
            // console.log(res);
            this.setState({
                loading: false,
                questions: res.data,
                originalQuestions: res.data,
            }, this.props.onComponentRefresh);
        })
    }

    getPositionData = () => {
        TestsApi.getAllPosition(res => {
            // console.log(res);
            this.setState({
                loading: false,
                positions: res.data
            });
        })
    }

    render() {
        const { message, isReadyGenerate, isReadySubmit, test, tests, questions, redirectToReferer, search, language, category, positions } =  this.state;
        // console.log(positions);
        if (redirectToReferer.length) {
            return (
                <Redirect to={{pathname: redirectToReferer}} />
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
            <FlatButton
                label="Generate"
                keyboardFocused={true}
                onTouchTap={this.generateData}
                disabled={!isReadyGenerate}
                />,
        ];

        let positionsSelectField = positions ? 
            (
                <SelectField id='position'
                    value={test.position}
                    onChange={this.handleChangePosition}
                    floatingLabelText="Position"
                    style={{marginRight: '20px'}}
                    >
                    {positions.map((position, i) => {
                        return <MenuItem key={i} value={position} primaryText={position.name} />
                    })}
                </SelectField>
            ) : '';

        
            let LangSelectField = test.position && test.position.languages ? 
            (
                <SelectField id='language'
                    value={language}
                    onChange={this.handleChangeLang}
                    floatingLabelText="Language"
                    style={{ marginRight: '20px' }}
                    >
                    {test.position.languages.map((item, i) => {
                        return <MenuItem key={i} value={item.name} primaryText={item.name} />
                    })}
                </SelectField>
            ) : '';
    
        let categories = language && test.position && test.position.languages ? test.position.languages.filter(item => item.name === language)[0].categories : [];
        // console.log(categories);
        let CategorySelectField = LangSelectField && categories ? 
            (
                <SelectField id='category'
                    value={category}
                    onChange={this.handleChangeCategory}
                    floatingLabelText="Category"
                    >
                    {categories.map((item, i) => {
                        return <MenuItem key={i} value={item.title} primaryText={item.title} />
                    })}
                </SelectField>
            ) : '';

        let listAvailableQuestions = language ? 
            (
                <Table fixedHeader={true} multiSelectable={true} onRowSelection={this.handleQuestionSelection}>
                    <TableHeader displaySelectAll={true}>
                            <TableRow>
                            <TableHeaderColumn colSpan="3" tooltip="Available Quetions">
                                
                            </TableHeaderColumn>
                        </TableRow> 
                        <TableRow>
                            <TableHeaderColumn>Title</TableHeaderColumn>
                            <TableHeaderColumn>Language</TableHeaderColumn>
                            <TableHeaderColumn>Category</TableHeaderColumn>
                            {/* <TableHeaderColumn>Time</TableHeaderColumn> */}
                            {/* <TableHeaderColumn>Created</TableHeaderColumn> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={true} deselectOnClickaway={false} showRowHover={true} stripedRows={true}>
                        {questions.map( (row, index) => (
                        <TableRow key={index} selected={this.isSelected(row)}>
                            <TableRowColumn>{row.title}</TableRowColumn>
                            <TableRowColumn>{row.language}</TableRowColumn>
                            <TableRowColumn>{row.category}</TableRowColumn>
                            {/* <TableRowColumn>{row.time}</TableRowColumn> */}
                            {/* <TableRowColumn>{moment(row.dateModified).fromNow()}</TableRowColumn> */}
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )
            : '';
        
        return (
            <div>
                <Snackbar
                    open={message.isShow}
                    message={message.content}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
                <Dialog
                    title="New Test"
                    actions={actions}
                    modal={false}
                    open={this.state.modalOpen}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                    >
                    <TextField id="title"
                        fullWidth={true}
                        hintText="Title Field"
                        floatingLabelText="Title"
                        onChange={this.onChange}
                        value={test.title}
                        /><br />
                    { positionsSelectField }
                    <TextField id="time"
                        fullWidth={false}
                        hintText="Time in second"
                        floatingLabelText="Time"
                        onChange={this.onChange}
                        value={test.time}
                        style={{verticalAlign: 'top'}}
                        /><br />
                    { LangSelectField } 
                    { CategorySelectField } 
                    { listAvailableQuestions }
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
                                <TableHeaderColumn>Title</TableHeaderColumn>
                                <TableHeaderColumn>Position</TableHeaderColumn>
                                <TableHeaderColumn>Time</TableHeaderColumn>
                                <TableHeaderColumn>Created</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} showRowHover={true} stripedRows={true}>
                            {tests.map( (row, index) => (
                            <ClickableRow key={index} rowData={row.id}>
                                <TableRowColumn>{row.title}</TableRowColumn>
                                <TableRowColumn>{row.position.name}</TableRowColumn>
                                <TableRowColumn>{row.time}</TableRowColumn>
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

export default TestsComponent;