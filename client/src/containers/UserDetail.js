import React, { Component } from "react";
import { Loader } from "semantic-ui-react";
import { Helmet } from 'react-helmet';
import UsersApi from '../api/Users';
import UserDetailComponent from '../components/UserDetailComponent';
import Header from '../components/Header';

class UserDetail extends Component {

    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            user: {}
        }
    }

    
    // Update the data when the component mounts
    componentDidMount() {
        // console.log(this.props);
        UsersApi.getUser(this.props.match.params.id, res => {
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
            user: data
        });
    }

    render() {
        const { loading, user } =  this.state;
        const props = { user };
        const { location } = this.props;
        // console.log(user);
        return (
            <div>
                <Header location={location} title='User Detail' />
                <Helmet>
                    <title>Interview System: User Detail</title>
                </Helmet>
                <div className='MainContent'>
                    {!loading && props ? <UserDetailComponent {...props} /> : <Loader active>Loading...</Loader>}
                </div>
            </div>
        );
    }
}

export default UserDetail;