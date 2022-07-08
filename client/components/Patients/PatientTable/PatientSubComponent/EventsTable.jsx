import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import EventDateSections from '../../PatientInfo/Timeline/EventDateSections';
import EventModel from '../../../../entities/models/Event';
import { patientShape } from '../../../library/PropTypeShapes';
import { sortEvents } from '../../Shared/helpers';
import styles from './styles.scss';
import { getTodaysDate, getUTCDate, parseDateWithFormat } from '../../../library';

function EventsTable({ events, patient, timezone }) {
  if (!events || !events.length) {
    return (
      <div className={styles.eventsList}>
        <div className={styles.disclaimer}>
          <span className={styles.disclaimer_text}>No Events</span>
        </div>
      </div>
    );
  }

  const eventsUpToToday = events.filter(
    (ev) =>
      getUTCDate(ev.get('metaData', timezone).createdAt).diff(getTodaysDate(timezone), 'days') < 1,
  );
  // Only displaying the latest five events
  const sortedEvents = sortEvents(eventsUpToToday).slice(0, 5);
  const dateObj = {};

  sortedEvents.forEach((ev) => {
    const meta = ev.get('metaData');
    const key = getUTCDate(meta.timelineDate, timezone).format('MMMM Do YYYY');

    if (key in dateObj) {
      dateObj[key].push(ev);
    } else {
      dateObj[key] = [ev];
    }
  });

  // sort date sections by date descending
  const dateSections = Object.keys(dateObj)
    .map((date) => parseDateWithFormat(date, 'MMMM Do YYYY', timezone))
    .sort((a, b) => b.diff(a))
    .map((date) => date.format('MMMM Do YYYY'));

  return (
    <div className={styles.eventsList}>
      {dateSections.length > 0 &&
        dateSections.map((date, index) => (
          <div className={styles.eventSectionContainer}>
            <div
              className={classnames(styles.eventVerticalLineTop, {
                [styles.eventVerticalLineTop_invisible]: index === 0,
              })}
            />
            <EventDateSections
              key={`eventSection_${date}`}
              dateHeader={date}
              events={dateObj[date]}
              patient={patient}
            />
            <div
              className={classnames(styles.eventVerticalLineBottom, {
                [styles.eventVerticalLineBottom_invisible]: index + 1 === dateSections.length,
              })}
            />
          </div>
        ))}
    </div>
  );
}

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(EventsTable);

EventsTable.propTypes = {
  events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired,
  patient: PropTypes.shape(patientShape).isRequired,
  timezone: PropTypes.string.isRequired,
};
