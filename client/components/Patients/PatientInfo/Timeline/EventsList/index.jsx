
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { List } from 'immutable';
import Event from '../../../../../entities/models/Event';
import EventDateSections from '../EventDateSections';
import { sortEvents } from '../../../Shared/helpers';
import styles from '../styles.scss';

export default function EventsList({ events, filters, patient }) {
  if (events && events.length === 0) {
    return (
      <div className={styles.disclaimer}>
        <div className={styles.disclaimer_text}>No Events</div>
      </div>
    );
  }
  const filteredEvents = events.filter(event => filters.indexOf(event.get('type')) > -1);

  const sortedEvents = sortEvents(filteredEvents);

  const dateObj = {};

  sortedEvents
    .filter(ev => moment(ev.get('metaData').createdAt).diff(moment(), 'days') < 1)
    .forEach((ev) => {
      const meta = ev.get('metaData');
      const key = moment(meta.timelineDate).format('MMMM Do YYYY');

      if (key in dateObj) {
        dateObj[key].push(ev);
      } else {
        dateObj[key] = [ev];
      }
    });

  const dateSections = Object.keys(dateObj);

  return (
    <div className={styles.eventsList}>
      {dateSections.length > 0 &&
        dateSections.map(date => (
          <EventDateSections
            key={`eventSection_${date}`}
            dateHeader={date}
            events={dateObj[date]}
            patient={patient}
          />
        ))}
    </div>
  );
}

EventsList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.instanceOf(Event)),
  filters: PropTypes.instanceOf(List),
  patient: PropTypes.shape({}).isRequired,
};

EventsList.defaultProps = {
  filters: List,
  events: [],
};
