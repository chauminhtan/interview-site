import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import QuestionsApi from '../api/Questions';
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
const CategoryTypes = [
  <MenuItem key={1} value='Coding' primaryText="Developer" />,
  <MenuItem key={2} value='Other' primaryText="QA" />,
];
const LanguageTypes = ['General','Java','C#','Python','Javascript', 'QA'];

const PickAnswers = ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'];

class QuestionsComponent extends Component {
    constructor (props) {
        super(props);
        this.state = {
            search: '',
            searchText: '',
            message: {
                isShow: false,
                content: ''
            },
            modalOpen: false,
            questions: [],
            originalQuestions: [],
            question: {
                title: '',
                language: '',
                category: '',
                answer: '',
                time: 0,
                type: ''
            },
            pickAnswers: PickAnswers,
            isReadySubmit: false,
            redirectToReferer: ''
        }
    }

    addData = () => {
        // call to api server
        let data = this.state.question;
        if (data.type.toLowerCase() === 'pick') {
            data.pickAnswers = this.state.pickAnswers.map((item, index) => {
                let obj = {id: index+1, text: item};
                return obj;
            });
            console.log(data.pickAnswers);
        }
        QuestionsApi.create(data, res => {

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
        let question = extend({}, this.state.question);
        question[e.target.id] = e.target.value;
        // console.log(question);
        const isValid = question.title.length && 
                        question.category.length && 
                        question.answer.length && 
                        question.time > 0 && 
                        question.type.length;
        this.setState({question: question, isReadySubmit: isValid});
    }

    handleChangeType = (event, index, value) => {
        // console.log(value);
        let question = extend({}, this.state.question);
        question.type = value;
        this.setState({question: question});
    }

    handleChangeCategory = (event, index, value) => {
        // console.log(value);
        let question = extend({}, this.state.question);
        question.category = value;
        this.setState({question: question});
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

    handleSearch = (event) => {
        const questions = this.state.originalQuestions;
        let filteredQuestions = questions.filter(question => {
            return question.title.search(event.target.value) > -1;
        });
        // console.log(filteredQuestions);
        this.setState({
            search: event.target.value,
            questions: filteredQuestions
        });
    };

    // Update the data when the component mounts
    componentDidMount() {
        this.setState({loading: true}, this.updateData);
    }

    // Call out to server data and refresh directory
    updateData = () => {
        QuestionsApi.getAll(res => {
            // console.log(res);
            this.setState({
                loading: false,
                questions: res.data,
                originalQuestions: res.data,
            }, this.props.onComponentRefresh);
        })
    }

    newAnswer () {
        return 'New Answer';
    }

    addMoreAnswer = () => {
        const newAnswer = this.newAnswer(this.state.pickAnswers.length + 1);
        let pickAnswers = this.state.pickAnswers;
        pickAnswers.push(newAnswer);
        console.log(pickAnswers);
        this.setState({pickAnswers: pickAnswers});
    }

    removedAnswer = (key) => {
        console.log(key);
        const pickAnswers = this.state.pickAnswers.filter((answer, index) => {
            return index !== key;
        })

        this.setState({pickAnswers: pickAnswers});
    }

    onPickAnswerChange = (data) => {
        // console.log(data);
        let pickAnswers = this.state.pickAnswers;
        if (data.index > -1 && data.index <= pickAnswers.length) {
            pickAnswers[data.index] = data.value;
            // console.log(pickAnswers);
            this.setState({pickAnswers: pickAnswers});
        }
    }

    renderAnswer(answer, i) {
        return (
            // <div style={styles.pickAnswer} key={i}>
            //     <IconButton tooltip="Removed this answer" tooltipPosition="top-right" onTouchTap={this.removedAnswer.bind(this, i)}>
            //         <ContentRemoved />
            //     </IconButton>
            //     <RIEInput propName={'Answer'+i} value={answer} change={this.onPickAnswerChange} />
            // </div>
            <PickAnswerComponent key={i} AnswerIndex={i} answer={answer} onRemoved={this.removedAnswer} onChange={this.onPickAnswerChange} />
        )
    }

    renderAnswers(question) {
        const totalPickAnswer = question.pickAnswers ? question.pickAnswers.length : 0;
        let renderPickAnswers = [];
        for (let i=0; i < totalPickAnswer; i++) {
            renderPickAnswers.push(this.renderAnswer(question.pickAnswers[i], i));
        }
        const moreAnswer = <FlatButton key={totalPickAnswer + 1} label="add more" onTouchTap={this.addMoreAnswer} />;
        renderPickAnswers.push(moreAnswer);
        return (renderPickAnswers);
    }

    handleUpdateInput = (searchText) => {
        this.setState({
            searchText: searchText,
        });
    };

    handleNewRequest = (searchText) => {
        let question = extend({}, this.state.question);
        question['language'] = searchText;
        // console.log(question);
        const isValid = question.title.length && 
                        question.language.length && 
                        question.category.length && 
                        question.answer.length && 
                        question.time > 0 && 
                        question.type.length;
        this.setState({question: question, isReadySubmit: isValid});
        // this.setState({
        //     searchText: searchText,
        // });
    };

    render() {
        const { message, isReadySubmit, questions, redirectToReferer, search, question } =  this.state;
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

        const renderPickAnswers = question.type.toLowerCase() === 'pick' ? this.renderAnswers(this.state) : '';

        return (
            <div>
                <Snackbar
                    open={message.isShow}
                    message={message.content}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
                <Dialog
                    title="New Question"
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
                        /><br />
                    <AutoComplete
                        hintText="Language"
                        searchText={this.state.searchText}
                        onUpdateInput={this.handleUpdateInput}
                        onNewRequest={this.handleNewRequest}
                        dataSource={LanguageTypes}
                        filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
                        openOnFocus={true}
                        /><br />
                    <SelectField id='category'
                        value={question.category}
                        onChange={this.handleChangeCategory}
                        floatingLabelText="Category"
                        style={{marginRight: '20px'}}
                        >
                        {CategoryTypes}
                    </SelectField>
                    <SelectField id='type'
                        value={question.type}
                        onChange={this.handleChangeType}
                        floatingLabelText="Type"
                        >
                        {QuestionTypes}
                    </SelectField><br />
                    <TextField id="answer"
                        fullWidth={true}
                        hintText="Answer Field"
                        floatingLabelText="Correct Answer"
                        multiLine={true}
                        rowsMax={4}
                        onChange={this.onChange}
                        /><br />
                    <div className='defaultForm'>
                        { renderPickAnswers }
                    </div>
                    <TextField id="time"
                        fullWidth={true}
                        hintText="Time in second"
                        floatingLabelText="Time"
                        onChange={this.onChange}
                        />
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
                                <TableHeaderColumn>Language</TableHeaderColumn>
                                <TableHeaderColumn>Category</TableHeaderColumn>
                                <TableHeaderColumn>Type</TableHeaderColumn>
                                <TableHeaderColumn>Time</TableHeaderColumn>
                                <TableHeaderColumn>Created</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} showRowHover={true} stripedRows={true}>
                            {questions.map( (row, index) => (
                            <TableRow key={index}>
                                <TableRowColumn>{row.title}</TableRowColumn>
                                <TableRowColumn>{row.language}</TableRowColumn>
                                <TableRowColumn>{row.category}</TableRowColumn>
                                <TableRowColumn>{row.type}</TableRowColumn>
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

export default QuestionsComponent;