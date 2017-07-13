import React, { Component } from "react";
import { Grid, Segment, Icon } from 'semantic-ui-react';

class Footer extends Component {
  render() {
    return (
        <Grid relaxed>
            <Grid.Row verticalAlign="middle">
                <Grid.Column width={12} mobile={16}>
                    <Segment as="h3">
                        <Icon name="copyright" /> Interview System. The project is under building.
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
  }
}

export default Footer;
