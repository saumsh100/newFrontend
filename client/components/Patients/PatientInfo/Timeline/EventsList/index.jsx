
import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { connect } from 'react-redux';
import PatientTimelineEvent from '../../../../../entities/models/PatientTimelineEvent';
import EventDateSections from '../EventDateSections';
import { sortEvents } from '../../../Shared/helpers';
import styles from '../styles.scss';
import { getTodaysDate, getUTCDate, parseDateWithFormat } from '../../../../library';

function EventsList({ events, filters, patient, timezone }) {
  if (events && events.length === 0) {
    return (
      <div className={styles.disclaimer}>
        <div className={styles.disclaimer_text}>No Events</div>
      </div>
    );
  }
  const filteredEvents = events.filter(event => filters.indexOf(event.get('type')) > -1);

  const sortedEvents = sortEvents(filteredEvents);

  const dateObj = {};

  sortedEvents
    .filter(
      ev =>
        getUTCDate(ev.get('metaData').createdAt, timezone).diff(getTodaysDate(timezone), 'days') <
        1,
    )
    .forEach((ev) => {
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
    .map(date => parseDateWithFormat(date, 'MMMM Do YYYY', timezone))
    .sort((a, b) => b.diff(a))
    .map(date => date.format('MMMM Do YYYY'));

  return (
    <div className={styles.eventsList}>
      {dateSections.length > 0 &&
        dateSections.map(date => (
          <EventDateSections
            key={`eventSection_${date}`}
            dateHeader={date}
            events={dateObj[date]}
            patient={patient}
            timezone={timezone}
          />
        ))}
    </div>
  );
}

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(
  mapStateToProps,
  null,
)(EventsList);

EventsList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.instanceOf(PatientTimelineEvent)),
  filters: PropTypes.instanceOf(List),
  patient: PropTypes.shape({}).isRequired,
  timezone: PropTypes.string.isRequired,
};

EventsList.defaultProps = {
  filters: List,
  events: [],
};
