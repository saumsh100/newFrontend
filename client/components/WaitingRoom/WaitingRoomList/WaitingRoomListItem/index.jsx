
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Button, Checkbox, ListItem, PatientPopover, Tooltip } from '../../../library';
import styles from './styles.scss';

function WaitingRoomListItem(props) {
  const { waitingRoomPatient, onNotify, onClean, onComplete } = props;
  const {
    patient,
    enteredAt,
    sentWaitingRoomNotifications,
    familyMembers,
    familyMembersCount,
    appointment,
    cleanedAt,
  } = waitingRoomPatient;
  const { practitioner, startDate, endDate } = appointment;

  const tooltipBody = (
    <div className={styles.tooltipBody}>
      {familyMembers.map(fm => (
        <div key={fm.id}>
          {fm.patient.firstName} {fm.patient.lastName}
        </div>
      ))}
    </div>
  );

  return (
    <ListItem className={styles.waitingRoomListItem}>
      <div className={styles.leftSection}>
        <div className={styles.checkinTime}>Checked in at {moment(enteredAt).format('h:mm a')}</div>
        <div className={styles.subLeftSection}>
          <div className={styles.completionCircleWrapper}>
            <Checkbox
              checked={false}
              onChange={() => onComplete({ isCompleted: true })}
              className={styles.completedCheckbox}
            />
          </div>
          <div>
            <div className={styles.patientNameWrapper}>
              <PatientPopover patient={patient}>
                <span className={styles.patientName}>
                  {patient.firstName} {patient.lastName}
                </span>
              </PatientPopover>
              {familyMembersCount ? (
                <Tooltip overlay={tooltipBody} placement="bottom">
                  <span className={styles.familyMembersCount}>+{familyMembersCount}</span>
                </Tooltip>
              ) : null}
            </div>
            <div className={styles.practitionerName}>
              {practitioner.type === 'Dentist' ? 'Dr. ' : null}
              {practitioner.firstName} {practitioner.lastName}
            </div>
            <div className={styles.appointmentTimes}>
              {moment(startDate).format('h:mm a')} - {moment(endDate).format('h:mm a')}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.rightSection}>
        <Checkbox
          label="Cleaned"
          checked={!!cleanedAt}
          onChange={() => onClean({ isCleaned: !cleanedAt })}
          className={styles.cleanedCheckbox}
        />
        <Button size="sm" border="blue" onClick={onNotify} className={styles.notifyButton}>
          {sentWaitingRoomNotifications.length ? 'Re-Notify' : 'Notify'}
        </Button>
      </div>
    </ListItem>
  );
}

WaitingRoomListItem.propTypes = {
  waitingRoomPatient: PropTypes.shape({}).isRequired,
  onNotify: PropTypes.func.isRequired,
  onClean: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default WaitingRoomListItem;
