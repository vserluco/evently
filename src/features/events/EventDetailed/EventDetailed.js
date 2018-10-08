import React, { Component } from 'react';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withFirestore, firebaseConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import { objectToArray, createDataTree } from '../../../app/common/util/helpers';
import { goingToEvent, cancelGoingToEvent } from '../../user/userActions';
import { addEventComment } from '../eventActions';

const mapStateToProps = (state, ownProps) => {
  let event={};

  if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
    event = state.firestore.ordered.events[0]
  }

  return {
    event,
    auth: state.firebase.auth,
    eventChat: !isEmpty(state.firebase.data.event_chat) && objectToArray(state.firebase.data.event_chat[ownProps.match.params.id])
  }
}

const mapDispatchToProps = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment
}

class EventDetailed extends Component {
  async componentDidMount() {
    const { firestore, match } = this.props;
    // let event = await firestore.get(`events/${match.params.id}`);
    // If we leave this as firestore.get. The user will not experience immediately when he clicks on going to event.
    await firestore.setListener(`events/${match.params.id}`);
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

  render() {
    const { event, auth, goingToEvent, cancelGoingToEvent, addEventComment, eventChat } = this.props;
    const attendees = event && event.attendees && objectToArray(event.attendees);
    const isHost = event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some(a => a.id === auth.uid); //So if user is already an attendee this will turn out true. If not, false.
    const chatTree = !isEmpty(eventChat) && createDataTree(eventChat)

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailedHeader event={event} isHost={isHost} isGoing={isGoing} goingToEvent={goingToEvent} cancelGoingToEvent={cancelGoingToEvent}/>
          <EventDetailedInfo event={event}/>
          <EventDetailedChat addEventComment={addEventComment} eventId={event.id} eventChat={chatTree}/>
        </Grid.Column>
        <Grid.Column width={6}>
            <EventDetailedSidebar attendees={attendees}/>
        </Grid.Column>
      </Grid>
    )
  }
}

export default compose(
  withFirestore,
  connect(mapStateToProps, mapDispatchToProps),
  firebaseConnect((props) => ([`event_chat/${props.match.params.id}`]))
)(EventDetailed);
