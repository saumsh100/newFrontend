
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Event from '../EventComponents';
import PatientTimelineEvent from '../../../../../entities/models/PatientTimelineEvent';
import styles from '../styles.scss';
import { getTodaysDate } from '../../../../library';

export default function EventDateSections(props) {
  const { events, dateHeader, patient, timezone } = props;

  let showHeader = dateHeader;
  let dateHeaderClass = styles.dateHeader;

  if (getTodaysDate(timezone).format('MMMM Do YYYY') === dateHeader) {
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
  events: PropTypes.arrayOf(PropTypes.instanceOf(PatientTimelineEvent)).isRequired,
  dateHeader: PropTypes.string.isRequired,
  patient: PropTypes.shape({}).isRequired,
  timezone: PropTypes.string.isRequired,
};
