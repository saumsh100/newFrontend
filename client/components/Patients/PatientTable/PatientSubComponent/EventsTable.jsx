
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Event, Loading } from '../../../library';
import styles from './styles.scss';

export default function EventsTable(props) {
  const {
    events,
    wasFetched,
  } = props;

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
  }).slice(0, 5);

  return (
    <div className={styles.eventsList}>
      {sortedEvents.map((event) => {
        return (
          <div className={styles.lineEventContainer}>
           <div className={styles.verticalLine}>&nbsp;</div>
            <Event
              data={event.get('metaData')}
              type={event.get('type').toLowerCase()}
            />
          </div>
        );
      })}
    </div>
  );
}

EventsTable.propTypes = {
  events: PropTypes.object.isRequired,
  wasFetched: PropTypes.bool.isRequired,
};
