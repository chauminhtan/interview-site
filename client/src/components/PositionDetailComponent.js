import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
// import moment from 'moment';
import PositionsApi from '../api/Positions';
import { RIETextArea } from 'riek';
import extend from 'extend';
import { Card, CardActions, CardTitle } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Snackbar from 'material-ui/Snackbar';
import { Tabs, Tab } from 'material-ui/Tabs';

import InputQtyPerCategory from '../components/InputQtyPerCategoryComponent';
import SelectFieldLangComponent from '../components/SelectFieldLangComponent';

class positionDetailComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirectToReferer: false,
            message: {
                isShow: false,
                content: ''
            },
            position: {
                name: '',
                languages: []
            },
            modififed: false,
            tabsValue: 'g'
        }
    }

    goBack = () => {
        this.setState({ redirectToReferer: true })
    }

    onChange = (newState) => {
        // console.log(newState);
        let position = extend(this.props.position, newState);
        // console.log(position);
        this.setState({
            position: position, 
            modififed: true
        });
    }

    edit = () => {
        // console.log(this.props.position);
        let data = this.props.position;
        if (this.state.position.name.length) {
            data = extend(data, this.state.position);
            console.log(data)
        }
        PositionsApi.update(data, res => {
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
        PositionsApi.delete(this.props.position.id, res => {
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

    handleRequestClose = () => {
        let message = extend({}, this.state.message);
        message.isShow = false;
        this.setState({message: message});
    }

    handleChange = (event, index, values) => {
        console.log(values);
        this.setState({
            selectedUsers: values,
            isAssignment: Object.keys(values).length > 0
        });
    }

    handleChangeTab = (value) => {
        this.setState({
            tabsValue: value
        });
    }

    handleChangeLang = (values) => {
        console.log(values);
        let position = this.props.position;
        position.languages = values;
        this.setState({ 
            position: position, 
            modififed: true
        });
    }

    onCategoryChange = (data) => {
        // console.log(data);
        let position = extend({}, this.props.position);
        position.languages.forEach( (lang, i) => {
            if (lang.name === data.language) {
                lang.categories.forEach(category => {
                    if (category.title === data.category) {
                        category.quantity = data.value;
                    }
                })
            }
        })
        // console.log(position.languages);
        this.setState({ 
            position: position, 
            modififed: true
        });
    }

    getCategories(selectedLangs) {
        // console.log(selectedLangs);
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
        const { position, languages } = this.props;
        const from = { pathname: '/positions' };
        const { redirectToReferer, message, modififed, tabsValue } =  this.state;
        console.log(position);
        
        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }

        const langNames = position.languages.map(lang => lang.name);
        let LangSelectField = languages ? (<SelectFieldLangComponent value={langNames} languages={languages} onChange={this.handleChangeLang} />) : '';

        let categoriesField = position.languages.length ? 
        this.getCategories(position.languages) : '';

        return (
            <div>
                <h2>Position Information</h2>
                <Snackbar
                    open={message.isShow}
                    message={message.content}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
                <Paper zDepth={2}>
                    <Tabs value={tabsValue} onChange={this.handleChangeTab}>
                        <Tab label="General" value='g'>
                            <Card className='defaultForm'>
                                <CardTitle className='title' subtitle='Name'>
                                    <RIETextArea propName='name' value={position.name} change={this.onChange} />
                                </CardTitle>
                                <Divider />
                                <CardTitle subtitle=''>
                                    {LangSelectField}
                                </CardTitle> 
                                <CardActions>
                                    <RaisedButton primary disabled={!modififed} onClick={this.edit} label="Save" />
                                    <RaisedButton secondary onClick={this.delete} label="Delete" />
                                </CardActions>
                            </Card>
                        </Tab>
                        <Tab label="Category" value='c'>
                            <Card>
                                <CardTitle subtitle='Question Number for Each Category'>
                                    {categoriesField}
                                </CardTitle>
                                <CardActions>
                                    <RaisedButton primary disabled={!modififed} onClick={this.edit} label="Save" />
                                    <RaisedButton secondary onClick={this.delete} label="Delete" />
                                </CardActions>
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

export default positionDetailComponent;