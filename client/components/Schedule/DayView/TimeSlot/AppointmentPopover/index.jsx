import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formatPhoneNumber } from '../../../../../util/isomorphic';
import {
  Card,
  Avatar,
  IconButton,
  Icon,
  SContainer,
  SHeader,
  SBody,
  SFooter,
  Button,
  TextArea,
  PointOfContactBadge,
  getTodaysDate,
  getFormattedDate,
} from '../../../../library';
import { appointmentShape } from '../../../../library/PropTypeShapes';
import PatientModel from '../../../../../entities/models/Patient';
import EnabledFeature from '../../../../library/EnabledFeature';
import styles from './styles.scss';

const AppointmentPopover = ({ patient, appointment, timezone, scheduleView, ...props }) => {
  const { startDate, endDate, practitionerData, chairData, note } = appointment;
  const appointmentDate = getFormattedDate(startDate, 'dddd LL', timezone);
  const textAreaTheme = { group: styles.textAreaGroup };
  const patientUrl = `/patients/${patient.id}`;
  const age = patient.birthDate ? getTodaysDate(timezone).diff(patient.birthDate, 'years') : null;

  return (
    <Card className={styles.card} noBorder>
      <SContainer>
        <SHeader className={styles.header}>
          <Avatar user={patient} size="xs" />
          <div className={styles.header_text}>
            <a href={patientUrl} className={styles.dataLink}>
              <span className={styles.header_text}>
                {`${patient.firstName} ${patient.lastName}`}
              </span>
              {age !== null && <span className={styles.header_age}>{`, ${age}`}</span>}
            </a>
          </div>
          <IconButton className={styles.closeIcon} icon="times" onClick={props.closePopover} />
        </SHeader>
        <SBody className={styles.body}>
          <div className={styles.container}>
            <div className={styles.subHeader}>Date</div>
            <div className={styles.data}>{appointmentDate}</div>
          </div>

          <div className={styles.container}>
            <div className={styles.subHeader}>Time</div>
            <div className={styles.data}>
              {getFormattedDate(startDate, 'h:mm a', timezone)} -{' '}
              {getFormattedDate(endDate, 'h:mm a', timezone)}
            </div>
          </div>

          <div className={styles.container}>
            <div className={styles.subHeader}>
              {scheduleView === 'chair' ? 'Practitioner' : 'Chair'}
            </div>
            <div className={styles.data}>
              {scheduleView === 'chair' ? practitionerData.prettyName : chairData}
            </div>
          </div>

          {patient.mobilePhoneNumber || patient.email ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Patient Info</div>
              <div className={styles.data}>
                {patient.cellPhoneNumber && <Icon icon="phone" size={0.9} />}
                <div className={styles.data_text}>
                  {patient.cellPhoneNumber && formatPhoneNumber(patient.cellPhoneNumber)}
                  {patient.cellPhoneNumber && (
                    <PointOfContactBadge patientId={patient.id} channel="phone" />
                  )}
                </div>
              </div>

              <div className={styles.data}>
                {patient.email ? <Icon icon="envelope" size={0.9} /> : null}
                <div className={styles.data_text}>
                  {patient.email}
                  {patient.email && <PointOfContactBadge patientId={patient.id} channel="email" />}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.container}>
              <div className={styles.subHeader}>Patient Info</div>
              <div className={styles.data}>n/a</div>
            </div>
          )}

          {note && (
            <div className={styles.container}>
              <div className={styles.subHeader}>Note</div>
              <div className={styles.data}>
                <div className={styles.data_note}>
                  <TextArea disabled="disabled" theme={textAreaTheme}>
                    {note}
                  </TextArea>
                </div>
              </div>
            </div>
          )}
        </SBody>

        <SFooter className={styles.footer}>
          <Button dense compact onClick={props.handleGoToChat} border="blue" icon="comment-alt">
            <span>Text</span>
          </Button>
          <EnabledFeature
            predicate={({ flags }) => flags.get('show-edit-appointment')}
            render={() => (
              <span>
                <Button
                  color="blue"
                  onClick={props.editAppointment}
                  dense
                  compact
                  className={styles.editButton}
                  data-test-id="button_editAppointment"
                >
                  Edit
                </Button>
              </span>
            )}
          />
        </SFooter>
      </SContainer>
    </Card>
  );
};

AppointmentPopover.propTypes = {
  patient: PropTypes.instanceOf(PatientModel),
  appointment: PropTypes.shape(appointmentShape).isRequired,
  closePopover: PropTypes.func.isRequired,
  editAppointment: PropTypes.func.isRequired,
  scheduleView: PropTypes.string,
  handleGoToChat: PropTypes.func.isRequired,
  timezone: PropTypes.func.isRequired,
};

AppointmentPopover.defaultProps = { scheduleView: 'chair', patient: {} };

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(AppointmentPopover);
