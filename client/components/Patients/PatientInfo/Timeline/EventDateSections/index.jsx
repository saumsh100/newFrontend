
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';
import Event from '../EventComponents';
import EventModel from '../../../../../entities/models/Event';
import styles from '../styles.scss';

export default function EventDateSections(props) {
  const { events, dateHeader, patient } = props;

  let showHeader = dateHeader;
  let dateHeaderClass = styles.dateHeader;

  if (moment().format('MMMM Do YYYY') === dateHeader) {
    showHeader = 'Today';
    dateHeaderClass = classnames(dateHeaderClass, styles.today);
  }

  return (
    <div className={styles.eventSection}>
      <div className={styles.verticalLine}>&nbsp;</div>
      <div className={dateHeaderClass}> {showHeader} </div>
      {events.map(event => (
        <Event
          key={`eventSection_${event.id}`}
          data={event.get('metaData')}
          type={event.get('type')}
          bgColor="secondary"
          patient={patient}
        />
      ))}
    </div>
  );
}

EventDateSections.propTypes = {
  events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired,
  dateHeader: PropTypes.string.isRequired,
  patient: PropTypes.shape({}).isRequired,
};
