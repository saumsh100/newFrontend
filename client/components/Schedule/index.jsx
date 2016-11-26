
import React, { Component, PropTypes } from 'react';
import { Card, CardHeader, CardBlock } from 'reactstrap';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import styles from './styles.scss';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);
  
class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = { availabilities: [] };
    
    this.addAvailability = this.addAvailability.bind(this);
    this.removeAvailability = this.removeAvailability.bind(this);
  }
  
  componentDidMount() {
    window.socket.on('receiveAvailabilities', (results) => {
      this.setState({ availabilities: results });
    });
  
    window.socket.on('availabilityAdded', (result) => {
      console.log('availabilityAdded', result);
      const availabilities = this.state.availabilities.concat(result);
      this.setState({ availabilities });
    });
  
    window.socket.on('availabilityRemoved', (result) => {
      const availabilities = this.state.availabilities.filter(avail => avail.id !== result.id);
      this.setState({ availabilities });
    });
  
    window.socket.emit('fetchAvailabilities');
  }
  
  addAvailability({ start, end }) {
    window.socket.emit('addAvailability', {
      start,
      end,
      title: 'Availability',
    });
  }
  
  removeAvailability({ id }) {
    window.socket.emit('removeAvailability', { id });
  }
  
  render() {
    const events = this.state.availabilities.map((avail) => {
      return Object.assign({}, avail, {
        start: new Date(avail.start),
        end: new Date(avail.end),
      });
    });
    
    return (
      <div className={styles.scheduleContainer}>
        <Card className={styles.cardContainer}>
          <CardHeader>Schedule</CardHeader>
          <CardBlock>
            <BigCalendar
              timeslots={1}
              selectable={true}
              onSelectSlot={this.addAvailability}
              onSelectEvent={(event) => {
                if (confirm('Do you want to remove this availability?')) {
                  this.removeAvailability(event);
                }
              }}
              min={new Date(2016, 10, 15, 7, 0, 0, 0)}
              max={new Date(2016, 10, 15, 18, 0, 0, 0)}
              events={events}
            />
          </CardBlock>
        </Card>
      </div>
    );
  }
}

export default Schedule;
