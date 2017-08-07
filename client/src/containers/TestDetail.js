import React, { Component } from "react";
import { Loader } from "semantic-ui-react";
import { Helmet } from 'react-helmet';
import TestsApi from '../api/Tests';
import TestDetailComponent from '../components/TestDetailComponent';
import Header from '../components/Header';

class TestDetail extends Component {

    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            test: {}
        }
    }
    
    // Update the data when the component mounts
    componentDidMount() {
        TestsApi.getOne(this.props.match.params.id, res => {
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
            test: data
        });
    }

    render() {
        const { loading, test } = this.state;
        const props = { test };
        const { location } = this.props;

        return (
            <div>
                <Header location={location} title='Test Detail' />
                <Helmet>
                    <title>Interview System: Question Detail</title>
                </Helmet>
                <div className='MainContent'>
                    {!loading && props ? <TestDetailComponent {...props} /> : <Loader active>Loading...</Loader>}
                </div>
            </div>
        );
    }
}

export default TestDetail;