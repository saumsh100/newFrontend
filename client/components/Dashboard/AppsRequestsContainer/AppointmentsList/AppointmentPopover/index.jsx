import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formatPhoneNumber } from '../../../../../util/isomorphic';
import {
  Avatar,
  Button,
  Card,
  Icon,
  SBody,
  SContainer,
  SFooter,
  SHeader,
  TextArea,
  getFormattedDate,
} from '../../../../library';
import Patient from '../../../../../entities/collections/patients';
import Appointment from '../../../../../entities/collections/appointments';
import Practitioner from '../../../../../entities/collections/practitioners';
import Chair from '../../../../../entities/collections/chairs';
import EnabledFeature from '../../../../library/EnabledFeature';
import styles from '../../../styles';

function AppointmentPopover({
  patient,
  appointment,
  age,
  practitioner,
  chair,
  closePopover,
  handleEditAppointment,
  timezone,
}) {
  const { startDate, endDate, note } = appointment;

  const lastName = age ? `${patient.lastName},` : patient.lastName;
  return (
    <Card className={styles.appointmentPoppover_card} noBorder id="appPopOver">
      <SContainer>
        <SHeader className={styles.appointmentPoppover_header}>
          <Avatar user={patient} size="xs" />
          <div className={styles.appointmentPoppover_header_text}>
            {patient.firstName} {lastName} {age}
          </div>
          <div
            className={styles.appointmentPoppover_closeIcon}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.keyCode === 13 && closePopover}
            onClick={closePopover}
          >
            <Icon icon="times" />
          </div>
        </SHeader>
        <SBody className={styles.appointmentPoppover_body}>
          <div className={styles.appointmentPoppover_container}>
            <div className={styles.appointmentPoppover_subHeader}>Date</div>
            <div className={styles.appointmentPoppover_data}>
              {getFormattedDate(startDate, 'dddd LL', timezone)}
            </div>
          </div>

          <div className={styles.appointmentPoppover_container}>
            <div className={styles.appointmentPoppover_subHeader}>Time</div>
            <div className={styles.appointmentPoppover_data}>
              {getFormattedDate(startDate, 'h:mm a', timezone)} -{' '}
              {getFormattedDate(endDate, 'h:mm a', timezone)}
            </div>
          </div>

          {patient.cellPhoneNumber || patient.email ? (
            <div className={styles.appointmentPoppover_container}>
              <div className={styles.appointmentPoppover_subHeader}>Patient Info</div>

              <div className={styles.appointmentPoppover_data}>
                {patient.cellPhoneNumber && <Icon icon="phone" size={0.9} />}
                <div className={styles.appointmentPoppover_data_text}>
                  {patient.cellPhoneNumber && formatPhoneNumber(patient.cellPhoneNumber)}
                </div>
              </div>

              <div className={styles.appointmentPoppover_data}>
                {patient.email && <Icon icon="envelope" size={0.9} />}
                <div className={styles.appointmentPoppover_data_text}>{patient.email}</div>
              </div>
            </div>
          ) : (
            <div className={styles.appointmentPoppover_container}>
              <div className={styles.appointmentPoppover_subHeader}>Patient Info</div>
              <div className={styles.appointmentPoppover_data}>n/a</div>
            </div>
          )}

          <div className={styles.appointmentPoppover_container}>
            <div className={styles.appointmentPoppover_subHeader}>Practitioner</div>
            <div className={styles.appointmentPoppover_data}>
              {practitioner.firstName} {practitioner.lastName}
            </div>
          </div>

          <div className={styles.appointmentPoppover_container}>
            <div className={styles.appointmentPoppover_subHeader}>Chair</div>
            <div className={styles.appointmentPoppover_data}>{chair.name}</div>
          </div>

          {note && (
            <div className={styles.appointmentPoppover_container}>
              <div className={styles.appointmentPoppover_subHeader}>Note</div>
              <div className={styles.appointmentPoppover_data}>
                <div className={styles.appointmentPoppover_data_note}>
                  <TextArea
                    disabled="disabled"
                    theme={{ group: styles.appointmentPoppover_textAreaGroup }}
                  >
                    {note}
                  </TextArea>
                </div>
              </div>
            </div>
          )}
        </SBody>
        <EnabledFeature
          predicate={({ flags }) => flags.get('show-edit-appointment')}
          render={() => (
            <SFooter className={styles.appointmentPoppover_footer}>
              <Button
                onClick={() => {
                  handleEditAppointment(appointment.id);
                }}
                dense
                compact
                className={styles.appointmentPoppover_editButton}
              >
                Edit
              </Button>
            </SFooter>
          )}
        />
      </SContainer>
    </Card>
  );
}

AppointmentPopover.propTypes = {
  patient: PropTypes.instanceOf(Patient).isRequired,
  appointment: PropTypes.instanceOf(Appointment).isRequired,
  age: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  closePopover: PropTypes.func.isRequired,
  practitioner: PropTypes.arrayOf(PropTypes.instanceOf(Practitioner)).isRequired,
  chair: PropTypes.arrayOf(PropTypes.instanceOf(Chair)).isRequired,
  handleEditAppointment: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
};

AppointmentPopover.defaultProps = { age: null };

function mapStateToProps({ auth }) {
  return {
    timezone: auth.get('timezone'),
  };
}

export default connect(mapStateToProps, null)(AppointmentPopover);
