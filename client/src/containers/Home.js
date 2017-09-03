import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Header from '../components/Header';

class Home extends Component {
    render() {
        const { location } = this.props;
        // console.log(location);
        return (
            <div>
                <Header location={location} title='Home' />
                <Helmet>
                    <title>Interview System: Home</title>
                </Helmet>
                <div className='MainContent'>
                    <h2>Welcome to Interview System</h2>
                </div>
            </div>
        );
    }
}

export default Home;
