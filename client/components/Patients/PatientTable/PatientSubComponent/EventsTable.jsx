
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import EventDateSections from '../../PatientInfo/Timeline/EventDateSections';
import EventModel from '../../../../entities/models/Event';
import { sortEvents } from '../../Shared/helpers';
import styles from './styles.scss';

export default function EventsTable({ events, patient }) {
  if (!events || !events.length) {
    return (
      <div className={styles.eventsList}>
        <div className={styles.disclaimer}>
          <span className={styles.disclaimer_text}>No Events</span>
        </div>
      </div>
    );
  }

  const eventsUpToToday = events.filter(
    ev => moment(ev.get('metaData').createdAt).diff(moment(), 'days') < 1,
  );
  // Only displaying the latest five events
  const sortedEvents = sortEvents(eventsUpToToday).slice(0, 5);
  const dateObj = {};

  sortedEvents.forEach((ev) => {
    const meta = ev.get('metaData');
    const key = moment(meta.timelineDate).format('MMMM Do YYYY');

    if (key in dateObj) {
      dateObj[key].push(ev);
    } else {
      dateObj[key] = [ev];
    }
  });

  // sort date sections by date descending
  const dateSections = Object.keys(dateObj)
    .map(date => moment(date, 'MMMM Do YYYY'))
    .sort((a, b) => b.diff(a))
    .map(date => moment(date).format('MMMM Do YYYY'));

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

EventsTable.propTypes = {
  events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired,
  patient: PropTypes.shape({}).isRequired,
};
