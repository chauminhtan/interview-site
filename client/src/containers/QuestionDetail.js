import React, { Component } from "react";
import { Loader } from "semantic-ui-react";
import { Helmet } from 'react-helmet';
import QuestionsApi from '../api/Questions';
import QuestionDetailComponent from '../components/QuestionDetailComponent';
import Header from '../components/Header';

class QuestionDetail extends Component {

    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            question: {}
        }
    }

    
    // Update the data when the component mounts
    componentDidMount() {
        QuestionsApi.getOne(this.props.match.params.id, res => {
            // console.log(res);
            this.updateData(res.data);
        })
        this.setState({loading: true});
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
            question: data
        });
    }

    render() {
        const { loading, question } =  this.state;
        const props = { question };
        // console.log(question);
        return (
            <div>
                <Header title='Question Detail' />
                <Helmet>
                    <title>Interview System: Question Detail</title>
                </Helmet>
                <div className='MainContent'>
                    {!loading && props ? <QuestionDetailComponent {...props} /> : <Loader active>Loading...</Loader>}
                </div>
            </div>
        );
    }
}

export default QuestionDetail;