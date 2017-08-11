import React, { Component } from "react";
import { Loader } from "semantic-ui-react";
import { Helmet } from 'react-helmet';
import TestsApi from '../api/Tests';
import UsersApi from '../api/Users';
import ResultsApi from '../api/Results';
import TestDetailComponent from '../components/TestDetailComponent';
import Header from '../components/Header';

class TestDetail extends Component {

    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            test: null,
            users: null,
            assignments: null
        }
    }
    
    // Update the data when the component mounts
    componentDidMount() {
        // TestsApi.getOne(this.props.match.params.id, res => {
        //     // console.log(res);
        //     this.updateData(res.data);
        // })
        // this.setState({loading: true});
        console.log('componentDidMoun');
        this.getUserData();
        this.setState({loading: true}, this.updateData);
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');
        // Check to see if the requestRefresh prop has changed
    }

    // Call out to server data and refresh directory
    // updateData(data) {
    //     // console.log(data);
    //     this.setState({
    //         loading: false,
    //         test: data
    //     });
    // }

    // Callback from the `UsersComponent` component
    onComponentRefresh = () => {
        console.log('refreshing data..');
        this.setState({ loading: true }, this.updateData);
    }

    updateData = () => {
        TestsApi.getOne(this.props.match.params.id, res => {
            // console.log(res);
            // this.setState({
            //     loading: false,
            //     test: res.data
            // });
            this.getAssignmentData(res.data);
        })
    }

    // Call out to server data and refresh directory
    getUserData = () => {
        UsersApi.getAll(res => {
            // console.log(res);
            this.setState({
                loading: false,
                users: res.data
            });
        })
    }

    // Call out to server data and refresh directory
    getAssignmentData = (test) => {
        ResultsApi.getByTestId(test.id, res => {
            console.log(res);
            this.setState({
                loading: false,
                test: test,
                assignments: res.data
            });
        })
    }

    render() {
        const { loading, test, users, assignments } = this.state;
        const props = { test, users, assignments };
        const { location } = this.props;

        return (
            <div>
                <Header location={location} title='Test Detail' />
                <Helmet>
                    <title>Interview System: Test Detail</title>
                </Helmet>
                <div className='MainContent'>
                    {!loading && test && users ? <TestDetailComponent onComponentRefresh={this.onComponentRefresh} {...props} /> : <Loader active>Loading...</Loader>}
                </div>
            </div>
        );
    }
}

export default TestDetail;