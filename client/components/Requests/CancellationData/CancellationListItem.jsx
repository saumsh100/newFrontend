import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  ListItem,
  getFormattedTime,
  getTodaysDate,
  StandardButton as Button,
  Tooltip,
  Icon,
  IconButton,
  getFormattedDate,
  List,
  MenuItem,
} from '../../library';
import MonthDay from '../MonthDay';
import styles from './styles.scss';
import { httpClient } from '../../../util/httpClient';
import { truncateStr } from '../../../util/isomorphic';
import { cancellationListItem } from './thunks';

export default function CancellationListItem(props) {
  const {
    timezone,
    startDate,
    endDate,
    unit,
    patient,
    Practitioner,
    cancellationListId,
    setCancellationList,
    setLoading,
    accountId,
    createdAt,
    totalSuggestedPatients,
    suggestedWaitSpotIds, // It will be used in sent message flow
    totalContactedPatients,
    contactedPatients,
    patientsContactedByUser,
    patientsContactedAt,
  } = props;

  const waitlist = !!totalContactedPatients;

  const age = patient?.birthDate
    ? `, ${getTodaysDate(timezone).diff(patient.birthDate, 'years')}`
    : '';

  const fullName = patient?.firstName.concat(' ', patient?.lastName);
  const patientFullname = truncateStr(fullName, 7);
  const practitionerFullName = Practitioner?.firstName.concat(' ', Practitioner?.lastName);
  const appointmentMonth = getFormattedDate(startDate, 'MMM', timezone);
  const appointmentDate = getFormattedDate(startDate, 'DD', timezone);
  const cancellationDate = getFormattedDate(createdAt, 'MMM DD, h:mm A', timezone);
  const time = getFormattedTime(startDate, endDate, timezone);

  const removeItem = () => {
    setLoading(true);
    httpClient()
      .delete(`/api/cancellationsNotFilled/${cancellationListId}`)
      .then(() => {
        cancellationListItem(accountId).then(({ data }) => {
          setCancellationList(data);
          setLoading(false);
        });
      });
  };
  return (
    <ListItem className={styles.cancellationListItem}>
      <MonthDay month={appointmentMonth} day={appointmentDate} cancellationDay />
      <div className={styles.cancellationData}>
        <div className={styles.cancellationData__time}>
          {time}
          <span className={styles.unitValue}>({unit} units)</span>
          <IconButton
            icon="times"
            onClick={removeItem}
            className={styles.cancellationData__trashIcon}
          />{' '}
        </div>
        <div className={styles.cancellationText}>
          <div className={styles.cancellationText__container}>
            <span className={styles.cancellationText__createdAt}> Appt cancelled: </span>
            <span className={styles.cancellationText__requestedBy}>
              {patientFullname} {age}
              <Tooltip
                trigger={['hover']}
                overlay={
                  <div className={styles.tooltipWrapper}>
                    <div className={styles.tooltipBodyRow}>Cancelled on{' '}
                      <span className={styles.cancellationDateToolTip}>{cancellationDate}</span></div>
                  </div>
                }
                placement="top"
              >
                <span>
                  <Icon className={styles.circleIcon} icon="question-circle" size={0.9} />
                </span>
              </Tooltip>
            </span>
          </div>
          <span className={styles.cancellationText__createdAt}> Practitioner </span>
          <span className={styles.cancellationText__requestedBy}>{practitionerFullName}</span>
        </div>

        {waitlist ? (
          <>
            <div className={styles.cancellationText__patientWaitlist}>
              <Icon type="solid" icon="check-circle" className={styles.checkCircle} />
              <Tooltip
                trigger={['click']}
                overlayClassName="light-menu"
                overlay={
                  <List className={styles.waitlistPatientList} data-test-id="smartFiltersList">
                    {contactedPatients.map(({ firstName, lastName, birthDate }, index) => {
                      const name = String(`${firstName} ${lastName}`).trim();
                      const patientsAge = birthDate
                        ? `, ${getTodaysDate(timezone).diff(birthDate, 'years')}`
                        : '';
                      return (
                        <MenuItem data-test-id={`option_${index}`} key={`smartFilter_${name}`}>
                          {name} {patientsAge}
                        </MenuItem>
                      );
                    })}
                  </List>
                }
                placement="top"
              >
                <span className={styles.waitlistSentMessage}>
                  Message sent to {totalContactedPatients} Waitlisted patient
                </span>
              </Tooltip>
            </div>
            <div className={styles.sendByMessage}>
              <span className={styles.bar} />
              <span className={styles.MessageSendBy}>
                By:{' '}
                <b>
                  {String(`${patientsContactedByUser.firstName} ${patientsContactedByUser.lastName}`).trim()}-{' '}
                  {moment(patientsContactedAt).format('MMM DD,hh:mm A')}
                </b>
              </span>
            </div>
          </>
        ) : (
          <div className={styles.cancellationText__patientWaitlist}>
            <span className={styles.badgeContent}>{totalSuggestedPatients}</span>
            <span className={styles.waitlistText}>Patients Available on waitlist</span>
          </div>
        )}
        {waitlist ? (
          <div type="submit" variant="primary" className={styles.FillAgain}>
            Fill Again
            <Icon type="solid" icon="arrows-rotate" className={styles.rotateIcon} />
          </div>
        ) : (
          <Button type="submit" variant="primary" className={styles.CancellationButton}>
            Fill Cancellation
          </Button>
        )}
      </div>
    </ListItem>
  );
}
CancellationListItem.propTypes = {
  timezone: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  patient: PropTypes.string.isRequired,
  birthDate: PropTypes.string.isRequired,
  Practitioner: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  accountId: PropTypes.string.isRequired,
  cancellationListId: PropTypes.string.isRequired,
  setCancellationList: PropTypes.func.isRequired,
  totalSuggestedPatients: PropTypes.number.isRequired,
  suggestedWaitSpotIds: PropTypes.array.isRequired,
  totalContactedPatients: PropTypes.number.isRequired,
  contactedPatients: PropTypes.array.isRequired,
  patientsContactedByUser: PropTypes.object.isRequired,
  patientsContactedAt: PropTypes.string.isRequired,
};
