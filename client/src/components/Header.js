import React, { Component } from "react";
// import { Menu, Dropdown, Icon, Segment } from "semantic-ui-react";
import { Link, Redirect } from "react-router-dom";
import Auth from "../api/Auth";
import { Store } from "../api/index";
import PropTypes from 'prop-types';
import AppBar from "material-ui/AppBar";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import SocialPeople from 'material-ui/svg-icons/social/people';
import ActionHome from 'material-ui/svg-icons/action/home';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import EventNote from 'material-ui/svg-icons/notification/event-note';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';

class Login extends Component {
    static muiName = "FlatButton";

    render() {
        return <FlatButton {...this.props} label="Login"><Link to='/login'></Link></FlatButton>;
    }
}

class Logged extends Component {
    static muiName = "IconMenu";
    state = {
        redirectToReferer: false
    }

    signOut = (event, logged) => {
        Auth.signout(() => this.setState({redirectToReferer: true}))
    };

    render() {
        const { props } = this.props;
        const { from } = { from: { pathname: '/home' } };
        const { redirectToReferer } =  this.state;
        const name = Store.getUserInfo() ? JSON.parse(Store.getUserInfo()).name : ""

        if (redirectToReferer) {
            return (
                <Redirect to={from} />
            )
        }

        return (
            <IconMenu
                {...props}
                iconButtonElement={
                    <IconButton>
                        <MoreVertIcon color={'white'} />
                    </IconButton>
                }
                targetOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
            >
                <MenuItem primaryText={name} containerElement={<Link to='/home' />}></MenuItem>
                <MenuItem primaryText="Sign out" onTouchTap={this.signOut} />
            </IconMenu>
        )
    }
}

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends Component {
        static propTypes = {
            children: PropTypes.node.isRequired,
            defaultValue: PropTypes.number.isRequired,
        };

        componentWillMount() {
            this.setState({
                selectedIndex: this.props.defaultValue,
            });
        }

        handleRequestChange = (event, index) => {
            this.setState({
                selectedIndex: index,
            });
        };

        render() {
            return (
                <ComposedComponent
                value={this.state.selectedIndex}
                onChange={this.handleRequestChange}
                >
                {this.props.children}
                </ComposedComponent>
            );
        }
    };
}

SelectableList = wrapState(SelectableList);

class Header extends Component {
    state = {
        openSideBar: false
    };

    // static propTypes = {
    //     match: PropTypes.object.isRequired,
    //     location: PropTypes.object.isRequired,
    //     history: PropTypes.object.isRequired
    // } 

    handleToggle = () => this.setState({openSideBar: !this.state.openSideBar});

    handleClose = () => this.setState({openSideBar: false});

    onTap = (e, data) => {
        console.log(e.target);
        this.handleClose();
    }

    render() {
        const { openSideBar } = this.state;
        const { title, location } = this.props;
        const pathname = location.pathname === '/' ? '/home' : location.pathname;
        const logged = Auth.isAuthenticated();
        let menus = [
            {title: 'Home', link: '/home', value: pathname === '/home' ? 1 : 0, icon: <ActionHome />},
            {title: 'Users', link: '/users', value: pathname === '/users' ? 1 : 0, icon: <SocialPeople />},
            {title: 'Questions', link: '/questions', value: pathname === '/questions' ? 1 : 0, icon: <ContentInbox />},
            {title: 'Tests', link: '/tests', value: pathname === '/tests' ? 1 : 0, icon: <EventNote />},
            {title: 'Positions', link: '/positions', value: pathname === '/positions' ? 1 : 0, icon: <ContentFilter />},
        ]

        if (!logged) {
            menus = [{title: 'Login', link: '/login'}]
        }

        return (
            <AppBar
                title={title} onLeftIconButtonTouchTap={this.handleToggle}
                iconElementRight={logged ? <Logged /> : <Login />}>
                <Drawer
                    docked={false}
                    width={200}
                    open={openSideBar}
                    onRequestChange={(openSideBar) => this.setState({openSideBar})}
                    >
                    <SelectableList defaultValue={1}>
                    {menus.map((menu, i) => {
                        return <ListItem containerElement={<Link to={menu.link} />} 
                                    primaryText={menu.title} onTouchTap={this.handleClose} 
                                    value={menu.value} leftIcon={menu.icon} key={i} />
                    })}
                    </SelectableList>
                </Drawer>
            </AppBar>
        );
    }
}

export default Header;
