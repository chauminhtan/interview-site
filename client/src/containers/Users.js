import React, { Component } from "react";
import { Loader, Grid } from "semantic-ui-react";
import { Helmet } from 'react-helmet';
import UsersApi from '../api/Users';
import UsersComponent from '../components/UsersComponent';

class Users extends Component {

    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            users: []
        }
    }
    
    // Update the data when the component mounts
    componentDidMount() {
        UsersApi.getUsers(res => {
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
        this.setState({
            loading: false,
            users: data
        });
    }

    render() {
        const { loading, users } =  this.state;
        const props = { users };
        console.log(users);
        return (
            <div>
                <Helmet>
                    <title>Interview System: Users</title>
                </Helmet>
                {!loading ? <UsersComponent {...props} /> : <Loader active>Loading...</Loader>}
            </div>
        );
    }
}

export default Users;