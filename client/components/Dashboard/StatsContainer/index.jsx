import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconCard } from '../../library';
import { FilterAppointments } from '../Shared/filters';
import { isFeatureEnabledSelector } from '../../../reducers/featureFlags';
import styles from '../styles';

function StatsContainer({
  appointmentsCount,
  insightCount,
  requestsCount,
  unConfirmedPatientsCount,
  waitingRoomQueueLength,
  canSeeVirtualWaitingRoom,
  overrideClassName,
  overrideStatClassName,
}) {
  const primaryCardCount = canSeeVirtualWaitingRoom ? waitingRoomQueueLength : requestsCount;
  const waitingRoomTitle =
    waitingRoomQueueLength === 1 ? 'Patient in Waiting Room' : 'Patients in Waiting Room';
  const requestsTitle = requestsCount === 1 ? 'Online Request' : 'Online Requests';
  const primaryCardTitle = canSeeVirtualWaitingRoom ? waitingRoomTitle : requestsTitle;

  const cardsToRender = [
    {
      key: 0,
      count: primaryCardCount,
      title: primaryCardTitle,
      src: '/images/icons/Appt-Requests.png',
      size: 6,
      color: 'blue',
    },
    {
      key: 1,
      count: unConfirmedPatientsCount,
      title: unConfirmedPatientsCount === 1 ? 'Patient Unconfirmed' : 'Patients Unconfirmed',
      src: '/images/icons/Unconfirmed-Patients.png',
      size: 6,
      color: 'red',
    },
    {
      key: 2,
      count: insightCount,
      title: insightCount === 1 ? 'Patient Insight' : 'Patient Insights',
      src: '/images/icons/Patient-Insights.png',
      size: 6,
      color: 'yellow',
    },
    {
      key: 3,
      count: appointmentsCount,
      title: appointmentsCount === 1 ? 'Appointment Today' : 'Appointments Today',
      src: '/images/icons/Appts-Today.png',
      size: 6,
      color: 'grey',
    },
  ];

  return (
    <div className={overrideClassName || styles.statsContainer_container}>
      {cardsToRender.map((options) => (
        <div key={options.key} className={overrideStatClassName || styles.statsContainer_stat}>
          <IconCard {...options} />
        </div>
      ))}
    </div>
  );
}

StatsContainer.propTypes = {
  appointmentsCount: PropTypes.number,
  insightCount: PropTypes.number,
  requestsCount: PropTypes.number,
  unConfirmedPatientsCount: PropTypes.number,
  waitingRoomQueueLength: PropTypes.number.isRequired,
  canSeeVirtualWaitingRoom: PropTypes.bool.isRequired,
  overrideClassName: PropTypes.string,
  overrideStatClassName: PropTypes.string,
};

StatsContainer.defaultProps = {
  appointmentsCount: 0,
  insightCount: 0,
  requestsCount: 0,
  unConfirmedPatientsCount: 0,
  overrideClassName: null,
  overrideStatClassName: null,
};

function mapStateToProps(
  { dashboard, entities, waitingRoom, featureFlags, auth },
  { dashboardDate },
) {
  const practitioners = entities.getIn(['practitioners', 'models']);
  const allAppointments = entities.getIn(['appointments', 'models']);
  const timezone = auth.get('timezone');
  const appointments = FilterAppointments(allAppointments, practitioners, dashboardDate, timezone);

  const canSeeVirtualWaitingRoom = isFeatureEnabledSelector(
    featureFlags.get('flags'),
    'virtual-waiting-room-ui',
  );

  const waitingRoomQueue = waitingRoom.get('waitingRoomQueue');
  return {
    appointmentsCount: appointments.size,
    insightCount: dashboard.get('insightCount'),
    requestsCount: entities
      .getIn(['requests', 'models'])
      .filter((req) => !req.get('isCancelled') && !req.get('isConfirmed')).size,
    unConfirmedPatientsCount: appointments.filter((app) => !app.isPatientConfirmed).size,
    waitingRoomQueueLength: waitingRoomQueue ? waitingRoomQueue.length : 0,
    canSeeVirtualWaitingRoom,
  };
}

export default connect(mapStateToProps, null)(StatsContainer);
