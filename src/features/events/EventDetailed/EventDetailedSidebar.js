import React, { Component } from 'react';
import { Segment, List, Item, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class EventDetailedSidebar extends Component {
  render() {
    const { attendees } = this.props;

    return (
      <div>
      <Segment
        textAlign="center"
        style={{ border: 'none', backgroundColor: "#D65A72" }}
        attached="top"
        secondary
        inverted
      >
        {attendees && attendees.length} {attendees && attendees.length ===1 ? "Person" : "People"} Attending
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees && attendees.map(attendee => (
            <Item key={attendee.id} style={{ position: 'relative' }}>
              {attendee.host &&
              <Label
                style={{ position: 'absolute' }}
                color="orange"
                ribbon="right"
              >

                Host
              </Label>
            }
              <Item.Image size="tiny" circular src={attendee.photoURL} />
              <Item.Content verticalAlign="middle">
                <Item.Header as="h3">
                  <Link to={`/profile/${attendee.id}`}>{attendee.displayName}</Link>
                </Item.Header>
              </Item.Content>
            </Item>
          ))}

        </List>
      </Segment>
    </div>
    )
  }
}

export default EventDetailedSidebar
