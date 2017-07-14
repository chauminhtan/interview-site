import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Item, Divider, Label } from "semantic-ui-react";
import moment from 'moment';

class UsersItemComponent extends Component {
    
    render() {
        const { name, dateModified, email, id, isAdmin } = this.props;
        return (
            <Item as={Link} to={'/users/' + id}>
                <Item.Content>
                    <Item.Header>
                        {name} {isAdmin ? <Label color='blue' size='tiny'>admin</Label> :  <Label color='green' size='tiny'>candidate</Label>}
                    </Item.Header>
                    <Item.Meta>
                        <span>
                        {email}
                        </span>
                    </Item.Meta>
                    <Item.Description>
                        Created: {moment(dateModified).fromNow()}
                    </Item.Description>
                </Item.Content>
            </Item>
        );
    }
}

export default UsersItemComponent;