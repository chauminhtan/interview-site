import React, { Component } from "react";
import { Input, Menu, Dropdown } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import Auth from '../Auth';

const UserProfile = withRouter(({ history }) => (
    Auth.isAuthenticated ? (
        <Menu.Menu>
            <Dropdown text='Welcome Admin' className='link item'>
                <Dropdown.Menu>
                    <Menu.Item header>View Profile</Menu.Item>
                    <Menu.Item name='logout' onClick={() => {Auth.signout(() => history.push('/'))}} />
                </Dropdown.Menu>
            </Dropdown>
        </Menu.Menu>
    ) : (
        <Menu.Item name='login'><Link to='/login'>Login</Link></Menu.Item>
    )
))

class Header extends Component {
    state = { activeItem: 'home' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state;
        
        return (
            <Menu secondary>
                <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}><Link to='/'>Home</Link></Menu.Item>
                <Menu.Item name='users' active={activeItem === 'users'} onClick={this.handleItemClick}><Link to='/users'>Users</Link></Menu.Item>
                <Menu.Item name='setting' active={activeItem === 'setting'} onClick={this.handleItemClick}><Link to='/setting'>Setting</Link></Menu.Item>
                <Menu.Menu position='right'>
                    <UserProfile />
                </Menu.Menu>
            </Menu>
        );
    }
}

export default Header;