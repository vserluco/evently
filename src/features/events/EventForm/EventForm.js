/*global google*/
import React, { Component } from 'react';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createEvent, updateEvent, cancelToggle } from '../eventActions';
import cuid from 'cuid';
import { reduxForm, Field } from 'redux-form';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';
import { composeValidators, combineValidators, isRequired, hasLengthGreaterThan } from 'revalidate';
import moment from 'moment';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Script from 'react-load-script';
import { withFirestore } from 'react-redux-firebase';


const mapStateToProps = (state, ownProps) => {
  let event = {};

  if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
    event = state.firestore.ordered.events[0]
  }

  return {
    initialValues: event, 
    event: event,
  }
}

const mapDispatchToProps = {
  createEvent,
  updateEvent,
  cancelToggle,
}

const category = [
    {key: 'drinks', text: 'Drinks', value: 'drinks'},
    {key: 'culture', text: 'Culture', value: 'culture'},
    {key: 'film', text: 'Film', value: 'film'},
    {key: 'food', text: 'Food', value: 'food'},
    {key: 'music', text: 'Music', value: 'music'},
    {key: 'travel', text: 'Travel', value: 'travel'},
];

const validate= combineValidators({
  title: isRequired({message: "The event title is required"}),
  category: isRequired({message: "Please provide a category"}),
  description: composeValidators(
    isRequired({message: "Please enter a description"}),
    hasLengthGreaterThan(4)({message: "Description must be longer than 4 characters"})
  )(),
  city: isRequired('city'),
  venue: isRequired('venue'),
  date: isRequired('date'),
})

class EventForm extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {},
    scriptLoaded: false,
  }

  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`/events/${match.params.id}`)
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`/events/${match.params.id}`)
  }

  handleCitySelect = (selectedCity) => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        })
      })
      .then(() => {   //this solves the issue where the PlaceInput field here's onSElect overrides the onSelect of the actal place input. So when we type in a city we can't click. This fixes it .
        this.props.change('city', selectedCity)
      })
  }

  handleVenueSelect = (selectedVenue) => {
    geocodeByAddress(selectedVenue)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          venueLatLng: latlng
        })
      })
      .then(() => {   //this solves the issue where the PlaceInput field here's onSElect overrides the onSelect of the actal place input. So when we type in a city we can't click. This fixes it .
        this.props.change('venue', selectedVenue)
      })
  }

  onFormSubmit = (values) => {
    values.venueLatLng = this.state.venueLatLng;
    if(this.props.initialValues.id) {
      if (Object.keys(values.venueLatLng).length === 0) {
        values.venueLatLng = this.props.event.venueLatLng
      }
      this.props.updateEvent(values);
      this.props.history.goBack();
    } else {
      this.props.createEvent(values)
      this.props.history.push('/events')
    }
  }

  handleScriptLoad = () => {
    this.setState({
      scriptLoaded: true
    })
  }

  render() {
    const { invalid, submitting, pristine, event, cancelToggle } = this.props; // For the button
    return (
      <Grid>
        <Script
           url='https://maps.googleapis.com/maps/api/js?key=AIzaSyCYWAssBGwmlkXP6332klYS_-HLk_QtQlo&libraries=places'
           onLoad={this.handleScriptLoad}
         />
        <Grid.Column width={10}>
          <Segment>
             <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}> {/*this.props.handleSubmit is a redux form method */}

              <Header sub color="teal" content="Event Details"/>
              <Field name="title" type="text" component={TextInput} placeholder="Give your event a name..."/>
              <Field name="description" type="text" component={TextArea} rows={3} placeholder="What is your event about..."/>
              <Field name="category" type="text" component={SelectInput} options={category} multiple={true} placeholder="What is your event type..."/>

              <Header sub color="teal" content="Event Location Details"/>
              <Field name="city" type="text" component={PlaceInput} options={{types: ['(cities)']}} onSelect={this.handleCitySelect} placeholder="Which city is your event held in..."/>
              {this.state.scriptLoaded &&
                  <Field name="venue" type="text" component={PlaceInput} options={{types: ['establishment'], location: new google.maps.LatLng(this.state.cityLatLng), radius: 1000}} onSelect={this.handleVenueSelect} placeholder="Which venue is your event held in..."/>
              }
              <Field name="date" type="text" component={DateInput} dateFormat="YYYY-MM-DD HH:mm" timeFormat="HH:mm" showTimeSelect placeholder="Date and time of event..."/>

              <Button disabled={invalid || submitting || pristine} positive type="submit">
                Submit
              </Button>
              <Button type="button" onClick={this.props.history.goBack}>Cancel</Button>
              {event.id && (
                <Button type="button" color={event.cancelled ? "green" : "red"} floated="right" content={event.cancelled ? "Reactivate Event" : "Cancel Event"} onClick={() => cancelToggle(!event.cancelled, event.id)}/>
              )}
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}

export default withFirestore(connect(mapStateToProps, mapDispatchToProps)(reduxForm({form: "eventForm", enableReinitialize: true, validate})(EventForm)))
