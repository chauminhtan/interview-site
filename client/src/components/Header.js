import React, { Component } from "react";
import { Menu, Dropdown, Icon, Segment } from "semantic-ui-react";
import { NavLink, withRouter, Redirect } from "react-router-dom";
import Auth from "../api/Auth";
import { Store } from "../api/index";
import PropTypes from 'prop-types';
import AppBar from "material-ui/AppBar";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import FontIcon from "material-ui/FontIcon";
import NavigationExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import MenuItem from "material-ui/MenuItem";
import DropDownMenu from "material-ui/DropDownMenu";
import FlatButton from "material-ui/FlatButton";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from "material-ui/Toolbar";
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Drawer from 'material-ui/Drawer';

// const ShowTheLocation = withRouter(Header);
// const UserNav = withRouter(
//   ({ history }) =>
//     Auth.isAuthenticated()
//       ? <Menu.Menu>
//           <Dropdown
//             text={
//               Store.getUserInfo() ? JSON.parse(Store.getUserInfo()).name : ""
//             }
//             className="link item"
//             pointing
//           >
//             <Dropdown.Menu>
//               <Menu.Item header>View Profile</Menu.Item>
//               <Menu.Item
//                 name="logout"
//                 onClick={() => {
//                   Auth.signout(() => history.push("/home"));
//                 }}
//               />
//             </Dropdown.Menu>
//           </Dropdown>
//         </Menu.Menu>
//       : <Menu.Item name="login" as={NavLink} to="/login" />
// );

class Login extends Component {
    static muiName = "FlatButton";

    render() {
        return <FlatButton {...this.props} label="Login"><NavLink to='/login'></NavLink></FlatButton>;
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
                        <MoreVertIcon />
                    </IconButton>
                }
                targetOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
            >
                <MenuItem><NavLink to='/home'>{name}</NavLink></MenuItem>
                <MenuItem primaryText="Sign out" onTouchTap={this.signOut} />
            </IconMenu>
        )
    }
}

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

    render() {
        const { openSideBar } = this.state;
        const { title } = this.props;
        const logged = Auth.isAuthenticated();
        let menus = [
            {title: 'Home', link: '/home'},
            {title: 'Users', link: '/Users'},
            {title: 'Questions', link: '/questions'},
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
                    {menus.map((menu, i) => {
                        return <MenuItem key={i} onTouchTap={this.handleClose}><NavLink to={menu.link}>{menu.title}</NavLink></MenuItem>
                    })}
                </Drawer>
            </AppBar>
        );
    }
}

export default Header;
