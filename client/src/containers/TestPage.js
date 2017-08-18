import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import ResultsApi from '../api/Results';
import { Store } from '../api/index';
import TestPageComponent from '../components/TestPageComponent';
import Header from '../components/Header';
import CircularProgress from 'material-ui/CircularProgress';

const userInfo = Store.getUserInfo() ? JSON.parse(Store.getUserInfo()) : null;

class TestPage extends Component {

    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            test: null,
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
        let data = { testId: this.props.match.params.id, userId: userInfo.userId};
        ResultsApi.getByUserAndTest(data, res => {
            // console.log(res);
            this.setState({
                loading: false,
                result: res.data
            });
        })
    }

    render() {
        const { loading, result } = this.state;
        const props = { result };
        const { location } = this.props;
        
        console.log(props);
        console.log(userInfo);

        return (
            <div>
                <Header location={location} title='Test Page' />
                <Helmet>
                    <title>Interview System: Test Page</title>
                </Helmet>
                <div className='MainContent'>
                    {!loading && result ? <TestPageComponent onComponentRefresh={this.onComponentRefresh} {...props} /> : <CircularProgress className='loader' />}
                </div>
            </div>
        );
    }
}

export default TestPage;