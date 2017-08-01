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
import AutoComplete from 'material-ui/AutoComplete';
import moment from 'moment';
import { Input } from "semantic-ui-react";
import PickAnswerComponent from '../components/PickAnswerComponent';

const QuestionTypes = [
  <MenuItem key={1} value='Text' primaryText="Text" />,
  <MenuItem key={2} value='Pick' primaryText="Pick" />,
];

const LanguageTypes = ['General','Java','C#','Python','Javascript', 'QA'];

const CategoryTypes = ['Coding','Other'];

const PickAnswers = ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'];

class TestsComponent extends Component {
    constructor (props) {
        super(props);
        this.state = {
            search: '',
            langText: '',
            categoryText: '',
            message: {
                isShow: false,
                content: ''
            },
            modalOpen: false,
            questions: [],
            originalQuestions: [],
            selectedQuestions: [],
            tests: [],
            originalTests: [],
            test: {
                title: '',
                category: '',
                questions: [],
                time: 0
            },
            pickAnswers: PickAnswers,
            isReadySubmit: false,
            redirectToReferer: ''
        }
    }

    addData = () => {
        // call to api server
        let data = this.state.test;
        
        TestsApi.create(data, res => {

            let message = extend({}, this.state.message);
            message.content = res.message;
            message.isShow = true;
            if(res.status === 1) {
                //
                // return;
            }

            this.setState({message: message, modalOpen: false, loading: true}, this.updateData);
        });
    }

    onChange = (e) => {
        let test = extend({}, this.state.test);
        test[e.target.id] = e.target.value;
        // console.log(test);
        const isValid = test.title.length && 
                        test.questions.length && 
                        test.time > 0;
        this.setState({test: test, isReadySubmit: isValid});
    }

    handleRequestClose = () => {
        let message = extend({}, this.state.message);
        message.isShow = false;
        this.setState({message: message});
    }

    handleOpen = (e) => this.setState({
        modalOpen: true,
    })

    handleClose = (e) => this.setState({
        modalOpen: false,
    })

    handleRowSelection = (selectedRows) => {
        // console.log(selectedRows[0]);
        for (var key in this.state.questions) {
            if (key === selectedRows[0].toString()) {
                // redirect to user detail page
                this.setState({redirectToReferer: '/questions/' + this.state.questions[key].id})
                break;
            }
        }
    };

    _unSelectedQuestions(questions, selectedQuestions){
        questions.map((row,index) => {
            let found = selectedQuestions.indexOf(row.id);
            if ( found !== -1 ) {
                selectedQuestions.splice(found, 1);
                // console.log(row.id);
            };
        });
        return selectedQuestions;
    }

    _selectedAllQuestions(questions, selectedQuestions){
        questions.map((row,index) => {
            // console.log(row);
            if (selectedQuestions.indexOf(row.id) === -1) {
                // test.questions.push(row);
                selectedQuestions.push(row.id);
            }
        })
        return selectedQuestions;
    }

    _updateSelectedQuestions(originalQuestions, selectedQuestions){
        let questions = [], time = 0;
        originalQuestions.map((row,index) => {
            let found = selectedQuestions.indexOf(row.id);
            if ( found !== -1 ) {
                questions.push(row);
                time += row.time;
            }
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
                });
                break;
        }

        let refreshData = this._updateSelectedQuestions(originalQuestions, selectedQuestions);
        test.questions = refreshData.questions;
        test.time = refreshData.time;

        const isValid = test.title.length && 
                        test.questions.length && 
                        test.time > 0;
        console.log(selectedQuestions);
        this.setState({test: test, selectedQuestions: selectedQuestions, isReadySubmit: isValid});
    };

    isSelected = (data) => {
        return this.state.selectedQuestions.indexOf(data.id) !== -1;
    };

    handleSearch = (event) => {
        const tests = this.state.originalTests;
        let filteredTests = tests.filter(test => {
            return test.title.search(event.target.value) > -1;
        });
        // console.log(filteredQuestions);
        this.setState({
            search: event.target.value,
            tests: filteredTests
        });
    };

    // Update the data when the component mounts
    componentDidMount() {
        console.log('componentDidMoun');
        this.getQuestionData();
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

    handleUpdateInput = (searchText) => {
        this.setState({
            searchText: searchText,
        });
    };

    handleLangguage = (langText) => {
        console.log(langText);
        const questions = this.state.originalQuestions;
        const categoryText = this.state.categoryText;
        let filteredQuestions = questions.filter(question => {
            return categoryText.length ? 
                question.language.toLowerCase() === langText.toLowerCase() && question.category.toLowerCase() === categoryText.toLowerCase() :
                question.language.toLowerCase() === langText.toLowerCase();
        });
        // console.log(filteredQuestions);
        this.setState({
            langText: langText,
            questions: filteredQuestions
        });
    };

    handleCategory = (categoryText) => {
        console.log(categoryText);
        const questions = this.state.originalQuestions;
        const langText = this.state.langText;
        let filteredQuestions = questions.filter(question => {
            return langText.length ? 
                question.language.toLowerCase() === langText.toLowerCase() && question.category.toLowerCase() === categoryText.toLowerCase() :
                question.category.toLowerCase() === categoryText.toLowerCase();
        });
        // console.log(filteredQuestions);
        this.setState({
            categoryText: categoryText,
            questions: filteredQuestions
        });
    };

    render() {
        const { message, isReadySubmit, test, tests, questions, redirectToReferer, search, question, selectedQuestions } =  this.state;
        // console.log(questions);
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
        ];

        
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
                    {/* <AutoComplete
                        hintText="Language"
                        searchText={this.state.langText}
                        onUpdateInput={this.handleUpdateInput}
                        onNewRequest={this.handleNewLangguage}
                        dataSource={LanguageTypes}
                        filter={(langText, key) => (key.indexOf(langText) !== -1)}
                        openOnFocus={true}
                        style={{marginRight: '20px'}}
                        />
                    <AutoComplete
                        hintText="Category"
                        searchText={this.state.categoryText}
                        onUpdateInput={this.handleUpdateInput}
                        onNewRequest={this.handleNewRequest}
                        dataSource={CategoryTypes}
                        filter={(categoryText, key) => (key.indexOf(categoryText) !== -1)}
                        openOnFocus={true}
                        /><br /> */}
                    <TextField id="time"
                        fullWidth={true}
                        hintText="Time in second"
                        floatingLabelText="Time"
                        onChange={this.onChange}
                        value={test.time}
                        /><br />
                    <Table fixedHeader={true} multiSelectable={true} onRowSelection={this.handleQuestionSelection}>
                        <TableHeader displaySelectAll={true}>
                             <TableRow>
                                <TableHeaderColumn colSpan="4" tooltip="Super Header">
                                    <AutoComplete
                                        hintText="Language"
                                        searchText={this.state.langText}
                                        onUpdateInput={this.handleUpdateInput}
                                        onNewRequest={this.handleLangguage}
                                        dataSource={LanguageTypes}
                                        filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
                                        openOnFocus={true}
                                        style={{marginRight: '20px'}}
                                        />
                                    <AutoComplete
                                        hintText="Category"
                                        searchText={this.state.categoryText}
                                        onUpdateInput={this.handleUpdateInput}
                                        onNewRequest={this.handleCategory}
                                        dataSource={CategoryTypes}
                                        filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
                                        openOnFocus={true}
                                        />
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
                                <TableRowColumn>{row.id}</TableRowColumn>
                                <TableRowColumn>{row.language}</TableRowColumn>
                                <TableRowColumn>{row.category}</TableRowColumn>
                                {/* <TableRowColumn>{row.time}</TableRowColumn> */}
                                {/* <TableRowColumn>{moment(row.dateModified).fromNow()}</TableRowColumn> */}
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                                <TableHeaderColumn>Category</TableHeaderColumn>
                                <TableHeaderColumn>Time</TableHeaderColumn>
                                <TableHeaderColumn>Created</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} showRowHover={true} stripedRows={true}>
                            {tests.map( (row, index) => (
                            <TableRow key={index}>
                                <TableRowColumn>{row.title}</TableRowColumn>
                                <TableRowColumn>{row.category}</TableRowColumn>
                                <TableRowColumn>{row.time}</TableRowColumn>
                                <TableRowColumn>{moment(row.dateModified).fromNow()}</TableRowColumn>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
}

export default TestsComponent;