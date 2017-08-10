import React, { Component } from "react";
import { Loader } from "semantic-ui-react";
import { Helmet } from 'react-helmet';
import QuestionsApi from '../api/Questions';
import LangsApi from '../api/Languages';
import QuestionDetailComponent from '../components/QuestionDetailComponent';
import Header from '../components/Header';

class QuestionDetail extends Component {

    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            question: null,
            language: null
        }
    }

    
    // Update the data when the component mounts
    componentDidMount() {
        QuestionsApi.getOne(this.props.match.params.id, res => {
            // console.log(res);
            this.updateData(res.data);
        })
        this.setState({
            loading: true
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');
        // Check to see if the requestRefresh prop has changed
    }

    // Call out to server data and refresh directory
    updateData(data) {
        // console.log(data);
        this.setState({
            loading: false,
            question: data.question,
            language: data.language
        });
    }

    render() {
        const { loading, question, language } =  this.state;
        const props = { question, language };
        const { location } = this.props;

        return (
            <div>
                <Header location={location} title='Question Detail' />
                <Helmet>
                    <title>Interview System: Question Detail</title>
                </Helmet>
                <div className='MainContent'>
                    {!loading && question && language ? <QuestionDetailComponent {...props} /> : <Loader active>Loading...</Loader>}
                </div>
            </div>
        );
    }
}

export default QuestionDetail;