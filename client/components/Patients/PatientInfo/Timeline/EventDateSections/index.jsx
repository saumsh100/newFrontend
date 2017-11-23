import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';
import { Event } from '../../../../library';
import styles from '../styles.scss';

export default function EventDateSections (props) {
  const {
    events,
    dateHeader,
  } = props;

  let showHeader = dateHeader;
  let dateHeaderClass = styles.dateHeader;

  if (moment().format('MMMM Do YYYY') === dateHeader) {
    showHeader = 'Today';
    dateHeaderClass = classnames(dateHeaderClass, styles.today)
  }

  return (
    <div className={styles.eventSection}>
      <div className={dateHeaderClass}> {showHeader} </div>
      {events.map((event) => {
        return (
          <Event
            key={`eventSection_${event.id}`}
            data={event.get('metaData')}
            type={event.get('type').toLowerCase()}
          />
        );
      })}
    </div>
  );
}

EventDateSections.propTypes = {
  events: PropTypes.arrayOf(Object),
  dateHeader: PropTypes.string,
};
