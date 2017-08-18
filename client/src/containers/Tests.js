import React, { Component } from 'react';
import Header from '../components/Header';
import TestsComponent from '../components/TestsComponent';
import CircularProgress from 'material-ui/CircularProgress';

class Tests extends Component {
    
    constructor (props) {
        super(props);

        this.state = {
            loading: false
        }
    }
    
    // Update the data when the component mounts
    componentDidMount() {
        this.setState({loading: true});
    }

    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps');
    }

    // Callback from the `UsersComponent` component
    onComponentRefresh = () => {
        this.setState({loading: false});
    }

    render() {
        const { loading } =  this.state;
        const { location } = this.props;

        return (
            <div>
                <Header location={location} title='Tests' />
                <div className='MainContent'>
                    {loading && <CircularProgress />}
                    <TestsComponent onComponentRefresh={this.onComponentRefresh} />
                </div>
            </div>
        );
    }
}

export default Tests;