
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setDateToTimezone } from '@carecru/isomorphic';
import { IconCard } from '../../library';
import { FilterAppointments } from '../Shared/filters';
import styles from './styles.scss';
import { isFeatureEnabledSelector } from '../../../reducers/featureFlags';

function StatsContainer({
  appointmentsCount,
  insightCount,
  requestsCount,
  unConfirmedPatientsCount,
  waitingRoomQueueLength,
  canSeeVirtualWaitingRoom,
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
    <div className={styles.container}>
      <div className={styles.statCardsContainer}>
        <div className={styles.statCards}>
          {cardsToRender.map(options => (
            <div key={options.key} className={styles.stat}>
              <IconCard {...options} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

StatsContainer.propTypes = {
  appointmentsCount: PropTypes.number,
  insightCount: PropTypes.number,
  requestsCount: PropTypes.number,
  unConfirmedPatientsCount: PropTypes.number,
  waitingRoomQueueLength: PropTypes.func.isRequired,
  canSeeVirtualWaitingRoom: PropTypes.bool.isRequired,
};

StatsContainer.defaultProps = {
  appointmentsCount: 0,
  insightCount: 0,
  requestsCount: 0,
  unConfirmedPatientsCount: 0,
};

function mapStateToProps({ dashboard, entities, waitingRoom, featureFlags }, { dashboardDate }) {
  const appointments = FilterAppointments(
    entities.getIn(['appointments', 'models']),
    entities.getIn(['practitioners', 'models']),
    setDateToTimezone(dashboardDate),
  );

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
      .filter(req => !req.get('isCancelled') && !req.get('isConfirmed')).size,
    unConfirmedPatientsCount: appointments.filter(app => !app.isPatientConfirmed).size,
    waitingRoomQueueLength: waitingRoomQueue ? waitingRoomQueue.length : 0,
    canSeeVirtualWaitingRoom,
  };
}

export default connect(
  mapStateToProps,
  null,
)(StatsContainer);
