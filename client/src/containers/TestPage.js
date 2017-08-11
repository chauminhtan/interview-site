import React, { Component } from "react";
import { Loader } from "semantic-ui-react";
import { Helmet } from 'react-helmet';
import TestsApi from '../api/Tests';
import UsersApi from '../api/Users';
import ResultsApi from '../api/Results';
import { Store } from "../api/index";
// import TestDetailComponent from '../components/TestDetailComponent';
import Header from '../components/Header';
import CircularProgress from 'material-ui/CircularProgress';

class TestPage extends Component {

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
        console.log('componentDidMoun');
        // this.getUserData();
        this.setState({loading: true}, this.updateData);
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');
        // Check to see if the requestRefresh prop has changed
    }

    // Callback from the `UsersComponent` component
    onComponentRefresh = () => {
        console.log('refreshing data..');
        // this.setState({ loading: true }, this.updateData);
    }

    updateData = () => {
        TestsApi.getOne(this.props.match.params.id, res => {
            // console.log(res);
            // this.setState({
            //     loading: false,
            //     test: res.data
            // });
            if (res.data) {
                this.getAssignmentData(res.data);
            } else {

            }
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
            // console.log(res);
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
        const userInfo = Store.getUserInfo() ? JSON.parse(Store.getUserInfo()) : null;
        console.log(props);
        console.log(userInfo);

        return (
            <div>
                <Header location={location} title='Test Page' />
                <Helmet>
                    <title>Interview System: Test Page</title>
                </Helmet>
                <div className='MainContent'>
                    <h2>{!loading && test ? test.title : ""}</h2>
                    <p>under building...</p>
                    <CircularProgress />
                </div>
            </div>
        );
    }
}

export default TestPage;