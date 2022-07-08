import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Event from '../EventComponents';
import PatientTimelineEvent from '../../../../../entities/models/PatientTimelineEvent';
import styles from '../styles.scss';
import { getTodaysDate } from '../../../../library';
import { patientShape } from '../../../../library/PropTypeShapes';

export default function EventDateSections(props) {
  const { events, dateHeader, patient, timezone } = props;

  let showHeader = dateHeader;
  let dateHeaderClass = styles.dateHeader;

  if (getTodaysDate(timezone).format('MMMM Do YYYY') === dateHeader) {
    showHeader = 'Today';
    dateHeaderClass = classnames(dateHeaderClass);
  }
  const getEventType = (eventData) => {
    const eventType = eventData.get('type');
    return !eventData.get('metaData').isSent &&
      eventData.get('metaData').primaryType === 'sms' &&
      (eventType === 'reminder' || eventType === 'review' || eventType === 'recall')
      ? 'smsFail'
      : eventType;
  };
  return (
    <div className={styles.eventSection}>
      <div className={dateHeaderClass}> {showHeader} </div>

      {events.map((event, index) => {
        return (
          <div className={styles.eventSectionContainer}>
            <Event
              key={`eventSection_${event.id}`}
              data={event.get('metaData')}
              type={getEventType(event)}
              event={event}
              bgColor="secondary"
              patient={patient}
              order={index}
              length={events.length}
            />
          </div>
        );
      })}
    </div>
  );
}

EventDateSections.propTypes = {
  events: PropTypes.arrayOf(PropTypes.instanceOf(PatientTimelineEvent)).isRequired,
  dateHeader: PropTypes.string.isRequired,
  patient: PropTypes.shape(patientShape).isRequired,
  timezone: PropTypes.string.isRequired,
};
