
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from '../styles.scss';
import EventDateSections from '../EventDateSections';

export default function EventsList({ events, filters }) {
  if (events && events.length === 0) {
    return (
      <div className={styles.disclaimer}>
        <div className={styles.disclaimer_text}>No Events</div>
      </div>
    );
  }

  const filteredEvents = events.filter((event) => {
    return filters.indexOf(event.get('type').toLowerCase()) > -1;
  });

  const sortedEvents = filteredEvents.sort((a, b) => {
    if (moment(b.metaData.createdAt).isBefore(moment(a.metaData.createdAt))) return -1;
    if (moment(b.metaData.createdAt).isAfter(moment(a.metaData.createdAt))) return 1;
    return 0;
  });

  const dateObj = {};

  sortedEvents.forEach((ev) => {
    const meta = ev.get('metaData');
    const key = moment(meta.createdAt).format('MMMM Do YYYY');

    if (dateObj.hasOwnProperty(key)) {
      dateObj[key].push(ev);
    } else {
      dateObj[key] = [ev];
    }
  });

  const dateSections = Object.keys(dateObj);

  return (
    <div className={styles.eventsList}>
      {dateSections.length ? dateSections.map((date, index) => {
        return (
          <EventDateSections
            key={`eventSection_${index}`}
            dateHeader={date}
            events={dateObj[date]}
          />
        );
      }) : null}
    </div>
  );
}

EventsList.propTypes = {
  events: PropTypes.instanceOf(Array),
  filters: PropTypes.instanceOf(Array),
};
