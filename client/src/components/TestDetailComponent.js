import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
// import moment from 'moment';
import TestsApi from '../api/Tests';
import ResultsApi from '../api/Results';
import extend from 'extend';
import { Card, CardActions, CardTitle } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Snackbar from 'material-ui/Snackbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import TableQuestionComponent from '../components/TableQuestionComponent';
import TableAssignmentComponent from '../components/TableAssignmentComponent';
import SelectField from "material-ui/SelectField";
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import RichEditorComponent from '../components/RichEditorComponent';

const subject = 'Test Assignment from Interview System';
const valueHtml = '<h3>hi {{name}},</h3><p>Please click {{link}} to do your test.</p';

class TestDetailComponent extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            redirectToReferer: false,
            message: {
                isShow: false,
                content: ''
            },
            test: {
                time: 0,
                questions: []
            },
            selectedQuestions: [],
            selectedUser: {},
            email: {
                to: '',
                subject: subject,
                content: valueHtml             
            },
            modififed: false,
            language: '',
            category: '',
            questions: []
        }
    }

    goBack = () => {
        this.setState({ redirectToReferer: true })
    }

    isValidAssignment = () => {
        const { selectedUser, email } = this.state;
        // console.log(email);
        return selectedUser.name && selectedUser.name.length && 
            email.to.length && email.subject.length && email.content.length;
    }

    onChangeEmailContent = (content) => {
        // console.log(content);
        let email = extend({}, this.state.email);
        email.content = content;
        this.setState({ 
            email: email,
        })
    }

    onChangeEmailTextField = (e) => {
        // console.log(e.target.value);
        let email = extend({}, this.state.email);
        email[e.target.id] = e.target.value;
        
        this.setState({
            email: email,
        });
    }

    onChangeTextField = (e) => {
        // console.log(e.target.value);
        let test = this.props.test;
        test[e.target.id] = e.target.value;
        extend(this.props.test, test);
        
        this.setState({
            modififed: true
        });
    }

    edit = () => {
        // console.log(this.props.test);
        let data = this.props.test;
        if (this.state.test.questions.length) {
            data = extend(data, this.state.test);
            console.log(data)
        }
        TestsApi.update(data, res => {
            // console.log(res);
            let message = extend({}, this.state.message);
            message.content = res.message;
            message.isShow = true;

            if(res.status === 1) {
                // this.goBack(); 
                // return;
            }
            this.setState({
                 message: message
            }, this.props.onComponentRefresh());
        })
    }

    delete = () => {
        TestsApi.delete(this.props.test.id, res => {
            // console.log(res);
            let message = extend({}, this.state.message);
            message.content = res.message;
            message.isShow = true;

            if(res.status === 1) {
                this.goBack(); 
                return;
            }
            
            this.setState({message: message});
        })
    }

    assignment = () => {
        const { selectedUser, email } = this.state;

        let assignmentInfo = {
            test: this.props.test,
            user: selectedUser,
            email: email
        }
        console.log(assignmentInfo);
        ResultsApi.create(assignmentInfo, res => {
            let message = extend({}, this.state.message);
            message.content = res.message;
            message.isShow = true;

            if(res.status === 1) {
                // this.goBack(); 
                // return;
            }
            this.setState({
                message: message
           }, this.props.onComponentRefresh());
        })
    }

    handleRequestClose = () => {
        let message = extend({}, this.state.message);
        message.isShow = false;
        this.setState({message: message});
    }

    updateSelectedQuestions = (selectedQuestions) => {
        console.log(selectedQuestions);
        const originalQuestions = this.props.questions;
        let test = extend({}, this.props.test);
        test.questions = [];
        test.time = 0;

        originalQuestions.map((row,index) => {
            let found = selectedQuestions.indexOf(row.id);
            if ( found !== -1 ) {
                row.typeQ = row.type;
                test.questions.push(row);
                test.time += row.time;
            }
            return true;
        });

        console.log(selectedQuestions);
        // console.log(test);
        this.setState({ 
            test: test, 
            selectedQuestions: selectedQuestions,
            modififed: selectedQuestions.length > 0
        });
    }

    handleChange = (event, index, value) => {
        // console.log(value);
        let email = extend({}, this.state.email);
        // let to = email.to.length ? [email.to] : [];
        // to.push(value.email);
        // email.to = to.join(',');
        email.to = value.email;

        this.setState({
            email: email,
            selectedUser: value,
        });
    }

    handleChangeLang = (event, index, value) => {
        // console.log(value)
        const { questions, position } = this.props;
        let filteredQuestions = [];
        
        if (value === 'both') {
            const languages = position.languages.map(lang => lang.name);
            filteredQuestions = questions.filter(question => {
                return languages.indexOf(question.language) > -1;
            });
        } else {
            filteredQuestions = questions.filter(question => {
                return question.language === value;
            });
        }
        
        this.setState({
            language: value,
            questions: filteredQuestions
        });
    }

    handleChangeCategory = (event, index, value) => {
        // console.log(value);
        const { language } = this.state;
        const { questions } = this.props;
        let filteredQuestions = questions.filter(question => {
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

    menuItems(data, value) {
        return data.map((item, i) => (
            <MenuItem
                key={i}
                insetChildren={true}
                checked={ value && value.name === item.name }
                value={item}
                primaryText={item.name}
            />
        ));
    }
    
    render() {
        const { test, users, assignments, position } = this.props;
        const from = { pathname: '/tests' };
        const { redirectToReferer, message, modififed, selectedQuestions, selectedUser, language, category, questions, email } =  this.state;
        const selectedQ = selectedQuestions.length > 0 ? selectedQuestions : test.questions.map( question => question.id );
        // console.log(selectedUser);
        
        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }

        let UserSelectField = users ? 
            (
                <SelectField
                    fullWidth={true}
                    hintText="Select a name"
                    value={selectedUser}
                    onChange={this.handleChange}
                >
                    {this.menuItems(users, selectedUser)}
                </SelectField>
            ) : '';
        
        //
        let LangSelectField = test.position && position ? 
        (
            <SelectField id='language'
                value={language}
                onChange={this.handleChangeLang}
                floatingLabelText="Language"
                style={{ marginRight: '20px' }}
                >
                <MenuItem key={'both'} value='both' primaryText='Both' />
                {position.languages.map((item, i) => {
                    return <MenuItem key={i} value={item.name} primaryText={item.name} />
                })}
            </SelectField>
        ) : '';
    
        let categories = language && language !== 'both' && position ? position.languages.filter(item => item.name === language)[0].categories : [];
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
        
        // console.log(selectedQ);
        let listAvailableQuestions = language ? questions : test.questions;

        let listQuestions = listAvailableQuestions && listAvailableQuestions.length ? 
            (
                <TableQuestionComponent questions={listAvailableQuestions} selectedQuestions={selectedQ} updateSelectedQuestions={this.updateSelectedQuestions} />
            )
            : '';

        return (
            <div>
                <h2>Test Information</h2>
                
                <Snackbar
                    open={message.isShow}
                    message={message.content}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
                <Paper zDepth={2}>
                    <Tabs>
                        <Tab label="General">
                            <Card className='defaultForm'>
                                <CardTitle className='title' subtitle='Title'>
                                    <TextField id="title"
                                        fullWidth={true}
                                        hintText="Title Field"
                                        floatingLabelText=""
                                        onChange={this.onChangeTextField}
                                        value={test.title}
                                        />
                                </CardTitle>
                                <Divider />
                                <CardTitle subtitle='Position'>
                                    {test.position.name}
                                </CardTitle>
                                <Divider />
                                <CardTitle subtitle='Time for answer (second)'>
                                    <TextField id="time"
                                        fullWidth={true}
                                        hintText="Number Field"
                                        floatingLabelText=""
                                        onChange={this.onChangeTextField}
                                        value={test.time}
                                        />
                                </CardTitle> 
                                <CardActions>
                                    <RaisedButton primary disabled={!modififed} onClick={this.edit} label="Save" />
                                    <RaisedButton secondary onClick={this.delete} label="Delete" />
                                </CardActions>
                            </Card>
                        </Tab>
                        <Tab label="Questions">
                            <Card>
                                <CardTitle subtitle='Filters'>
                                { LangSelectField } 
                                { CategorySelectField }
                                </CardTitle>
                                <Divider />
                                <CardTitle>
                                { listQuestions }
                                </CardTitle>
                                <Divider />
                                <CardActions>
                                    <RaisedButton primary disabled={!modififed} onClick={this.edit} label="Save" />
                                    <RaisedButton secondary onClick={this.delete} label="Delete" />
                                </CardActions>
                            </Card>
                        </Tab>
                        <Tab label="Assignment">
                            <Card>
                                <CardTitle subtitle='Select Users'>
                                    { UserSelectField }
                                </CardTitle>
                                <Divider />
                                <CardTitle subtitle='Email To'>
                                    <TextField id="to"
                                        fullWidth={true}
                                        hintText='Emails separate by ","'
                                        floatingLabelText=""
                                        onChange={this.onChangeEmailTextField}
                                        value={email.to}
                                        />
                                </CardTitle>
                                <Divider />
                                <CardTitle subtitle='Subject'>
                                    <TextField id="subject"
                                        fullWidth={true}
                                        hintText="Text Field"
                                        floatingLabelText=""
                                        onChange={this.onChangeEmailTextField}
                                        value={email.subject}
                                        />
                                </CardTitle>
                                <CardTitle subtitle='Content'>
                                    <RichEditorComponent valueHtml={email.content} onChange={this.onChangeEmailContent} />
                                </CardTitle>
                                {/* <Divider /> */}
                                <CardActions>
                                    <RaisedButton secondary disabled={!this.isValidAssignment()} onClick={this.assignment} label="Save" />
                                </CardActions>
                                <Divider />
                                <TableAssignmentComponent assignments={assignments} clickable={true} path={'/results/'} />
                            </Card>
                        </Tab>
                    </Tabs>
                </Paper>
                <h4>
                    <RaisedButton primary={false} label='back' icon={<ArrowBack />} onTouchTap={this.goBack} />
                </h4>
            </div>
        );
    }
}

export default TestDetailComponent;