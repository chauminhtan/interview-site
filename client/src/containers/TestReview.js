import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import ResultsApi from '../api/Results';
import QuestionsApi from '../api/Questions';
import TestReviewComponent from '../components/TestReviewComponent';
import Header from '../components/Header';
import CircularProgress from 'material-ui/CircularProgress';
import extend from 'extend';

class TestReview extends Component {

    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            result: null
        }
    }
    
    // Update the data when the component mounts
    componentDidMount() {
        // console.log('componentDidMoun');
        this.setState({loading: true}, this.updateData);
    }

    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps');
        // Check to see if the requestRefresh prop has changed
    }

    // Callback from the `UsersComponent` component
    onComponentRefresh = () => {
        // console.log('refreshing data..');
        this.setState({ loading: true }, this.updateData);
    }

    updateData = () => {
        ResultsApi.getOne(this.props.match.params.id, res => {
            // console.log(res);
            this.setState({
                loading: false,
                result: res.data
            });
            // this.getQuestionData(res.data);
        })
    }

    // Call out to server data and refresh directory
    getQuestionData = (result) => {
        const arrQuesIds = !result ? [] : result.test.questions.map(ques => ques.id);
        // console.log(arrQuesIds);
        QuestionsApi.getByArrayIds(arrQuesIds, res => {
            console.log(res.data);
            const questions = res.data;
            result.test.questions.map(ques => {
                for (let question of questions) {
                    if (ques.id === question.id) {
                        ques = extend(ques, question);
                        break;
                    }
                }
                return ques;
            })
            this.setState({
                loading: false,
                result: result
            });
        })
    }

    goBack = () => {
        const { history } = this.props;
        history.go(-1);
    }

    render() {
        const { loading, result } = this.state;
        const props = { result };
        const { location } = this.props;
        
        // console.log(result);

        return (
            <div>
                <Header location={location} title='Test Review' />
                <Helmet>
                    <title>Interview System: Test Review</title>
                </Helmet>
                <div className='MainContent'>
                    {!loading && result ? <TestReviewComponent goBack={this.goBack} onComponentRefresh={this.onComponentRefresh} {...props} /> : <CircularProgress className='loader' />}
                </div>
            </div>
        );
    }
}

export default TestReview;