import React, { Component } from "react";
import { Loader } from "semantic-ui-react";
import { Helmet } from 'react-helmet';
import UsersApi from '../api/Users';
import UsersComponent from '../components/UsersComponent';

class Users extends Component {

    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            users: [],
            requestRefresh: false
        }
    }
    
    // Update the data when the component mounts
    componentDidMount() {
        this.setState({loading: true}, this.updateData);
    }

    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps');
    }

    // Callback from the `UsersComponent` component
    onComponentRefresh = () => {
        this.setState({loading: true}, this.updateData);
    }

    // Call out to server data and refresh directory
    updateData = () => {
        UsersApi.getUsers(res => {
            // console.log(res);
            this.setState({
                loading: false,
                users: res.data
            });
        })
    }

    render() {
        const { loading, users } =  this.state;
        const props = { users };
        // console.log(users);
        return (
            <div>
                <Helmet>
                    <title>Interview System: Users</title>
                </Helmet>
                {!loading ? <UsersComponent onComponentRefresh={this.onComponentRefresh} {...props} /> : <Loader active>Loading...</Loader>}
            </div>
        );
    }
}

export default Users;