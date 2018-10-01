import React, { Component } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import EventForm from '../EventForm/EventForm';
import cuid from 'cuid';

const events = [
  {
    id: '1',
    title: 'Trip to Tower of London',
    date: '2018-03-27',
    category: 'culture',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
    city: 'London, UK',
    venue: "Tower of London, St Katharine's & Wapping, London",
    hostedBy: 'Bob',
    hostPhotoURL: 'https://randomuser.me/api/portraits/men/20.jpg',
    attendees: [
      {
        id: 'a',
        name: 'Bob',
        photoURL: 'https://randomuser.me/api/portraits/men/20.jpg'
      },
      {
        id: 'b',
        name: 'Tom',
        photoURL: 'https://randomuser.me/api/portraits/men/22.jpg'
      }
    ]
  },
  {
    id: '2',
    title: 'Trip to Punch and Judy Pub',
    date: '2018-03-28',
    category: 'drinks',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
    city: 'London, UK',
    venue: 'Punch & Judy, Henrietta Street, London, UK',
    hostedBy: 'Tom',
    hostPhotoURL: 'https://randomuser.me/api/portraits/men/22.jpg',
    attendees: [
      {
        id: 'b',
        name: 'Tom',
        photoURL: 'https://randomuser.me/api/portraits/men/22.jpg'
      },
      {
        id: 'a',
        name: 'Bob',
        photoURL: 'https://randomuser.me/api/portraits/men/20.jpg'
      }
    ]
  }
]

class EventDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: events,
      isOpen: false,
      selectedEvent: null,
    }
  }

// Opens and Closes the form
  handleForm = () => {
    this.setState({
      isOpen: !this.state.isOpen,
      selectedEvent: null,
    })
  }

// Closes form
  cancelForm = () => {
    this.setState({
      isOpen: false
    })
  }

// CREATE
  handleCreateEvent = (newEvent) => {
    newEvent.id = cuid();
    newEvent.hostPhotoURL = "assets/user.png"
    const updatedEvents = [...this.state.events, newEvent]
    this.setState({
      events: updatedEvents,
      isOpen: false,
    })
  }

// READ
  handleOpenEvent = (eventToOpen) => () => {
    this.setState({
      selectedEvent: eventToOpen,
      isOpen: true,
    })
  }

// UPDATE
  handleUpdateEvent = (eventToUpdate) => {
    this.setState({
      events: this.state.events.map(event => {
        if (event.id === eventToUpdate.id) {
          return Object.assign({}, eventToUpdate)
        } else {
          return event
        }
      }),
      isOpen: false,
      selectedEvent: null,
    })
  }

// DELETE
  handleDeleteEvent = (eventId) => () => {
    const updatedEvents = this.state.events.filter(event => event.id !== eventId);
    this.setState({
      events: updatedEvents
    })
  }

  render() {
    const {selectedEvent} = this.state;
    return(
      <Grid>
        <Grid.Column width={10}>
          <EventList events={this.state.events} openEvent={this.handleOpenEvent} deleteEvent={this.handleDeleteEvent}/>
        </Grid.Column>
        <Grid.Column width={6}>
          <Button onClick={this.handleForm} positive content="Create Event" />
          {this.state.isOpen && (
              <EventForm
                cancelForm={this.cancelForm}
                selectedEvent={selectedEvent}
                createEvent={this.handleCreateEvent}
                updateEvent={this.handleUpdateEvent}
              />
          )}
        </Grid.Column>
      </Grid>
    )
  }
}

export default EventDashboard;
