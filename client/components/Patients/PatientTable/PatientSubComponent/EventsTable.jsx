import React, { PropTypes } from 'react';
import moment from 'moment';
import { Event, Loading } from '../../../library';
import styles from './styles.scss';

export default function EventsTable(props) {
  const {
    events,
    patientId,
    wasFetched,
  } = props;

  if (!wasFetched) {
    return <Loading />;
  }

  if (!events || !events.length) {
    return (
      <div className={styles.eventsList}>
        <div className={styles.disclaimer}>
          <span className={styles.disclaimer_text}>No Events</span>
        </div>
      </div>
    );
  }

  const sortedEvents = events.sort((a, b) => {
    if (moment(b.metaData.createdAt).isBefore(moment(a.metaData.createdAt))) return -1;
    if (moment(b.metaData.createdAt).isAfter(moment(a.metaData.createdAt))) return 1;
    return 0;
  });

  return (
    <div className={styles.eventsList}>
      {sortedEvents.map((event) => {
        return (
          <Event
            data={event.get('metaData')}
            type={event.get('type').toLowerCase()}
          />
        );
      })}
    </div>
  );
}
