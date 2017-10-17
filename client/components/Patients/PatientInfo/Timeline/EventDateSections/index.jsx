import React, { PropTypes } from 'react';
import { Event } from '../../../../library';
import styles from '../styles.scss';

export default function EventDateSections (props) {
  const {
    events,
    dateHeader,
  } = props;

  return (
    <div>
      <div className={styles.dateHeader}> {dateHeader} </div>
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
