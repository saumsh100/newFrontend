import React, { PropTypes } from 'react';
import { Event } from '../../../library';
import styles from './styles.scss';

export default function EventsTable(props) {
  const {
    events,
    patientId,
  } = props;


  if (!events || !events.length) {
    return (
      <div className={styles.eventsList}>
        <div className={styles.disclaimer}>
          <span className={styles.disclaimer_text}>Currently, there are no events for this patient.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.eventsList}>
      {events.map((event) => {
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
