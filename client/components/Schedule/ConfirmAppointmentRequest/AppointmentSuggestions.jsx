import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import groupBy from 'lodash/groupBy';
import { formatPhoneNumber } from '../../../util/isomorphic';
import { selectAppointmentShape } from '../../library/PropTypeShapes';
import { Icon, Button, Avatar, SHeader, getTodaysDate } from '../../library';
import SameAppointment from './SameAppointment';
import styles from './styles.scss';

const AppointmentSuggestions = (props) => {
  const {
    patients,
    selectedAppointment,
    setSendEmail,
    timezone,
    setShowApptSummary,
    patientUsers,
    requests,
    setSelected,
    selectedApp,
    apptWrite,
    createAppointment,
  } = props;

  const allAppointments = selectedAppointment.nextAppt;
  const appointmentsByPatient = groupBy(allAppointments, 'patientId');
  const { requestModel } = selectedAppointment;
  const request = requests.get(requestModel.get('id'));
  const patientUser = patientUsers.get(request.get('patientUserId'));
  const fullName = patientUser.get('firstName').concat(' ', patientUser.get('lastName'));
  const birthDate = patientUser.get('birthDate');
  const age = birthDate ? `, ${getTodaysDate(timezone).diff(birthDate, 'years')}` : '';
  const patientUserPhone = patientUser.phoneNumber || patientUser.cellPhoneNumber;
  const onClickCreate = () => {
    if (apptWrite) {
      createAppointment();
    } else {
      setShowApptSummary();
    }
  };

  return (
    <div className={styles.container}>
      <span>
        We found one or more appointments that are similar. Please select the appointment you would
        like to link.
      </span>
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

        <div className={styles.itemContainer}>
          {patientUserPhone && (
            <div className={styles.contactItem}>
              <Icon icon="phone" size={0.9} type="solid" className={styles.icon} />
              <div className={styles.data_text}>{formatPhoneNumber(patientUserPhone)}</div>
            </div>
          )}
          {patientUser.email && (
            <div className={styles.contactItem}>
              <Icon icon="envelope" size={0.9} type="solid" className={styles.icon} />
              <div className={styles.data_text}>{patientUser.email}</div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.container}>
        {Object.keys(appointmentsByPatient).map((patientId) => {
          const patient = patients.get(patientId);
          const appointments = appointmentsByPatient[patientId];
          return (
            <div className={styles.containerApp}>
              <div className={styles.sameAppList}>
                {appointments.map((app) => (
                  <SameAppointment
                    key={app.id}
                    patient={patient}
                    appointment={app}
                    setSelected={setSelected}
                    selectedApp={selectedApp}
                    timezone={timezone}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.buttonContainer}>
        <Button border="blue" onClick={onClickCreate}>
          No appointment match, create new
        </Button>
        <Button
          color={selectedApp ? 'blue' : 'grey'}
          style={{ cursor: selectedApp ? 'pointer' : 'not-allowed' }}
          className={styles.buttonContainer_yes}
          onClick={() => {
            if (!selectedApp) return null;

            if (window.confirm('Are you sure this is the correct Appointment?')) {
              setSelected(selectedApp);
              return setSendEmail();
            }
            return null;
          }}
        >
          Link Appointment
        </Button>
      </div>
    </div>
  );
};

AppointmentSuggestions.propTypes = {
  patients: PropTypes.instanceOf(Map).isRequired,
  redirect: PropTypes.shape({ pathname: PropTypes.string }),
  selectedAppointment: PropTypes.shape(selectAppointmentShape),
  setSendEmail: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  setShowApptSummary: PropTypes.func.isRequired,
  requests: PropTypes.instanceOf(Map).isRequired,
  patientUsers: PropTypes.instanceOf(Map).isRequired,
  setSelected: PropTypes.func.isRequired,
  selectedApp: PropTypes.shape(selectAppointmentShape),
  apptWrite: PropTypes.bool.isRequired,
  createAppointment: PropTypes.func.isRequired,
};

AppointmentSuggestions.defaultProps = {
  redirect: null,
  selectedAppointment: null,
  selectedApp: null,
};

export default AppointmentSuggestions;
