
import React from 'react';
import PropTypes from 'prop-types';
import Event from '../../PatientInfo/Timeline/EventComponents';
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

  // Only displaying the latest five events
  const sortedEvents = sortEvents(events).slice(0, 5);

  return (
    <div className={styles.eventsList}>
      {sortedEvents.map(event => (
        <div className={styles.lineEventContainer} key={`eventsTable_${event.id}`}>
          <div className={styles.verticalLine}>&nbsp;</div>
          <Event data={event.get('metaData')} type={event.get('type')} patient={patient} />
        </div>
      ))}
    </div>
  );
}

EventsTable.propTypes = {
  events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired,
  patient: PropTypes.shape({}).isRequired,
};
