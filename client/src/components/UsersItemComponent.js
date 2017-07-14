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
                        {name} {isAdmin ? <Label circular empty color='blue'></Label> :  <Label circular color='green' size='mini'>user</Label>}
                    </Item.Header>
                    <Item.Meta>{email}</Item.Meta>
                    <Item.Description>Created: {moment(dateModified).fromNow()}</Item.Description>
                </Item.Content>
            </Item>
        );
    }
}

export default UsersItemComponent;