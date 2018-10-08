import React from 'react';
import { Card, Grid, Segment, Header, Image, Tab } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';

// Tab panes
const panes = [
  {menuItem: "All Events", pane: {key: "allEvents"}},
  {menuItem: "Past Events", pane: {key: "pastEvents"}},
  {menuItem: "Future Events", pane: {key: "futureEvents"}},
  {menuItem: "Hosting Events", pane: {key: "hostingEvents"}},
]

const UserDetailedEvents = ({events, eventsLoading, changeTab}) => {
  return (
    <Grid.Column width={12}>
      <Segment attached loading={eventsLoading}>
        <Header icon="calendar" content="Events"/>

        <Tab onTabChange={(event, data) => changeTab(event,data)} panes={panes} menu={{secondary: true, pointing: true}} />
        <br />

        <Card.Group itemsPerRow={5}>
          {events && events.map((event) => (
            <Card key={event.id} as={Link} to={`/event/${event.id}`}>
              <Image src={`/assets/eventCategories/${event.category}.jpg`}/>
              <Card.Content>
                <Card.Header textAlign="center">{event.title}</Card.Header>
                <Card.Meta textAlign='center'>
                    <div>
                      {format(event.date && event.date.toDate(), "DD MMM YYYY")} {/* firestore is using timestamps for dates so we need to push these into date format with .toDate()*/}
                    </div>
                    <div>
                      {format(event.date && event.date.toDate(), "h:mm A")}
                    </div>
                </Card.Meta>
              </Card.Content>
            </Card>
          ))}

        </Card.Group>
      </Segment>
    </Grid.Column>
  )
}

export default UserDetailedEvents;
