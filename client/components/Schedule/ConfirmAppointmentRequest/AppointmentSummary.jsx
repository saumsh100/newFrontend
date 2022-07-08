import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import { stringify } from 'query-string';
import { push } from 'connected-react-router';
import { Map } from 'immutable';
import { selectAppointmentShape } from '../../library/PropTypeShapes';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import { checkPatientUser } from '../../../thunks/schedule';
import {
  Button,
  Avatar,
  SHeader,
  getFormattedTime,
  getUTCDate,
  getTodaysDate,
  Icon,
} from '../../library';
import styles from './reskin-styles.scss';
import Item from './Item';
import MoreSummary from './MoreSummary';

const AppointmentSummary = (props) => {
  const [showMore, setShowMore] = useState(false);

  const confirmAppointment = (request, patientUser) => {
    const modifiedRequest = request.set('isConfirmed', true);
    const requestData = {
      requestId: request.get('id'),
      createdAt: request.get('createdAt'),
      startDate: request.get('startDate'),
      endDate: request.get('endDate'),
      serviceId: request.get('serviceId'),
      note: request.note,
      isSyncedWithPms: false,
      customBufferTime: 0,
      request: true,
      requestModel: modifiedRequest,
      practitionerId: request.get('practitionerId'),
      requestingPatientUserId: request.get('requestingPatientUserId'),
    };
    props.reinitializeState();
    props.checkPatientUser(patientUser, requestData);
  };

  const openRequest = (id) => {
    const browserHistory = createBrowserHistory();
    const location = browserHistory.location.pathname;

    props.reinitializeState();
    props.setLocation({
      ...location,
      search: stringify({ selectedRequest: id || undefined }),
    });
  };

  const { patientUsers, selectedAppointment, timezone, services, practitioners, requests } = props;
  const { requestModel } = selectedAppointment;
  if (!requestModel) return null;
  const request = requests.get(requestModel.get('id'));
  const patientUser = patientUsers.get(request.get('patientUserId'));
  const fullName = patientUser.get('firstName').concat(' ', patientUser.get('lastName'));
  const birthDate = patientUser.get('birthDate');
  const age = birthDate ? `, ${getTodaysDate(timezone).diff(birthDate, 'years')}` : '';
  const service = services.get(request.get('serviceId'));
  const serviceName = service ? service.name : '';
  const practitionerId = request.get('practitionerId');
  const practitioner = practitionerId ? practitioners.get(practitionerId) : null;

  const startDate = request.get('startDate');
  const endDate = request.get('endDate');
  const appointmentDate = getUTCDate(startDate, timezone).format('LL');
  const firstShow = props.lastSummaryRequest !== selectedAppointment?.requestId;
  return (
    <div className={styles.container}>
      <div className={styles.note}>
        {firstShow
          ? `Have you created this appointment and patient in your PMS? If not, please add the
        appointment and patient.`
          : `We did not find the appointment. Please ensure you have correctly entered the following 
        appointment details into your PMS and try again.`}
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.summaryTitle}>Appointment Summary</div>
        <div className={styles.summaryData}>
          <div className={styles.userCard}>
            <SHeader className={styles.header}>
              <Avatar user={patientUser} size="xs" />
              <div className={styles.header_text}>
                {fullName}
                {age}
              </div>
            </SHeader>
          </div>
          <div className={styles.appointment_itemContainer}>
            <Item title="Date" index="DATE" value={appointmentDate} />
            <Item
              title="Time"
              index="TIME"
              value={getFormattedTime(startDate, endDate, timezone)}
            />
            {(firstShow || showMore) && (
              <Item title="Appointment Type" index="APPOINTMENT TYPE" value={serviceName} />
            )}
            {(firstShow || showMore) && (
              <Item
                title="Practitioner"
                index="PRACTITIONER"
                value={practitioner?.getPrettyName() || 'No Preference'}
              />
            )}
          </div>
        </div>

        {(firstShow || showMore) && <MoreSummary {...props} />}

        {!firstShow && (
          <Button
            border="blue"
            role="presentation"
            className={styles.textBtn}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? (
              <>
                Show less
                <Icon icon="caret-up" className={styles.show_caretDown} />
              </>
            ) : (
              <>
                Show more
                <Icon icon="caret-down" className={styles.show_caretDown} />
              </>
            )}
          </Button>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <Button border="blue" onClick={() => openRequest(request.get('id'))}>
          No, I&apos;ll do this later
        </Button>

        <Button
          color="blue"
          className={styles.buttonContainer_yes}
          onClick={() => confirmAppointment(request, patientUser)}
        >
          {firstShow ? 'Yes, I have created the appt' : 'Try Again'}
        </Button>
      </div>
    </div>
  );
};

AppointmentSummary.propTypes = {
  requests: PropTypes.instanceOf(Map).isRequired,
  services: PropTypes.instanceOf(Map).isRequired,
  patientUsers: PropTypes.instanceOf(Map).isRequired,
  practitioners: PropTypes.instanceOf(Map).isRequired,
  redirect: PropTypes.shape({ pathname: PropTypes.string }),
  selectedAppointment: PropTypes.shape(selectAppointmentShape),
  timezone: PropTypes.string.isRequired,
  checkPatientUser: PropTypes.func.isRequired,
  reinitializeState: PropTypes.func.isRequired,
  setLocation: PropTypes.func.isRequired,
  lastSummaryRequest: PropTypes.string.isRequired,
};

AppointmentSummary.defaultProps = {
  redirect: null,
  selectedAppointment: null,
};

function mapStateToProps({ auth }) {
  return {
    timezone: auth.get('timezone'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateEntityRequest,
      setLocation: push,
      checkPatientUser,
    },
    dispatch,
  );
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(AppointmentSummary);
