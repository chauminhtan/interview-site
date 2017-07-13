import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon, Segment } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import Auth from '../api/Auth';
import { Store }  from '../api/index';

const UserNav = withRouter(({ history }) => (
    Auth.isAuthenticated() ? (
        <Menu.Menu>
            <Dropdown text={Store.getUserInfo() ? JSON.parse(Store.getUserInfo()).name : ''} className='link item' pointing>
                <Dropdown.Menu>
                    <Menu.Item header>View Profile</Menu.Item>
                    <Menu.Item name='logout' onClick={() => {Auth.signout(() => history.push('/'))}} />
                </Dropdown.Menu>
            </Dropdown>
        </Menu.Menu>
    ) : (
        <Menu.Item name='login' as={NavLink} to='/login' />
    )
))

class Header extends Component {
    state = { activeItem: 'home' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state;
        const {title, isLoggedIn} = this.props;
        
        if (!Auth.isAuthenticated()) {
            return (
                <Segment as='h1' color='grey'>
                    <Icon name='sign in' /> Login
                </Segment>
            )
        }
        
        return (
            <Menu pointing secondary>
                <Menu.Item name='home' as={NavLink} to='/home' onClick={this.handleItemClick} />
                <Menu.Item name='users' as={NavLink} to='/users' onClick={this.handleItemClick} />
                <Menu.Item name='setting' as={NavLink} to='/setting' onClick={this.handleItemClick} />
                <Menu.Menu position='right'>
                    <UserNav />
                </Menu.Menu>
            </Menu>
        );
    }
}

export default Header;