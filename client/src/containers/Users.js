import React, { Component } from "react";
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import UsersComponent from '../components/UsersComponent';
import CircularProgress from 'material-ui/CircularProgress';

class Users extends Component {

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
        
        return (
            <div>
                <Header title='Users' />
                <Helmet>
                    <title>Interview System: Users</title>
                </Helmet>
                <div className='MainContent'>
                    {loading && <CircularProgress />}
                    <UsersComponent onComponentRefresh={this.onComponentRefresh} />
                </div>
            </div>
        );
    }
}

export default Users;