import React, { Component } from "react";
import { Item, Grid } from "semantic-ui-react";
import UsersItemComponent from './UsersItemComponent';

class UsersComponent extends Component {
    constructor (props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        // Check to see if the requestRefresh prop has changed
        // console.log('componentWillReceiveProps');
        // console.log(this.props);
        // console.log(nextProps);
    }

    render() {
        const { users } = this.props;
        console.log(users);
        return (
            <Grid stackable>
                <Grid.Column width={16}>
                {!users
                    ? 'Hm, it looks like there are no items to show you :('
                    : <Item.Group divided link>
                        {users.map((user, i) => {
                            return <UsersItemComponent key={i} {...user} />
                        })}
                    </Item.Group>}
                </Grid.Column>
            </Grid>
        );
    }
}

export default UsersComponent;