
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { week, dateFormatter, formatPhoneNumber } from '@carecru/isomorphic';
import { Avatar, Icon, PatientPopover, IconButton, Checkbox, Collapsible } from '../../../library';
import { isHub } from '../../../../util/hub';
import styles from './styles.scss';

const WaitListItem = ({
  waitSpot,
  patient,
  removeWaitSpot,
  isPatientUser,
  removeBorder,
  selected,
  timezone,
  onSelect: onSelectCallback,
}) => {
  const renderPatientHeading = () =>
    (isHub() ? (
      <div className={styles.name}>
        {patient.firstName} {patient.lastName}
      </div>
    ) : (
      <PatientPopover
        patient={
          isPatientUser
            ? {
                ...patient,
                endDate: waitSpot.endDate,
              }
            : patient
        }
        isPatientUser={isPatientUser}
        placement="left"
      >
        <div className={styles.name}>
          {patient.firstName} {patient.lastName}
        </div>
      </PatientPopover>
    ));

  const renderContent = () => {
    if (!patient) return null;
    const { daysOfTheWeek, endDate, availableTimes } = waitSpot;
    const checkIfAnyTrue = Object.keys(daysOfTheWeek).every(k => !daysOfTheWeek[k]);
    const patientPhone = isPatientUser ? 'phoneNumber' : 'cellPhoneNumber';

    const nextAppt =
      (isPatientUser
        ? dateFormatter(endDate, timezone, 'MMM Do YYYY')
        : patient.nextApptDate && dateFormatter(patient.nextApptDate, timezone, 'MMM Do YYYY')) ||
      'n/a';
    const filteredPreferencesList =
      availableTimes &&
      availableTimes
        .map(time => dateFormatter(new Date(time).toISOString(), timezone, 'LT'))
        .join(', ');

    return (
      <div className={styles.waitListItem} data-test-id="list_waitListItem">
        {isHub() && (
          <Checkbox
            customContainer={classNames(styles.checkBox, { [styles.checked]: selected })}
            onChange={(e) => {
              e.stopPropagation();
              onSelectCallback();
            }}
            checked={selected}
          />
        )}
        <div
          className={classNames({
            [styles.wrapper]: !isHub(),
            [styles.listItemWrapperHub]: isHub(),
            [styles.removeBorder]: removeBorder,
          })}
        >
          {isHub() && (
            <div className={styles.heading}>
              <Avatar user={patient} size="xs" />
              {renderPatientHeading()}
            </div>
          )}
          {!isHub() && (
            <div className={styles.avatar}>
              <Avatar user={patient} size="sm" />
            </div>
          )}
          <div className={styles.patientPrefInfo}>
            {!isHub() && renderPatientHeading()}
            <div className={styles.info}>
              <span className={styles.subHeader}> Next Appt: </span>
              <span className={styles.dataText}>{nextAppt}</span>
            </div>
            <div className={styles.info}>
              <span className={styles.subHeader}>Preferences: </span>
              <span className={styles.dataText}>{filteredPreferencesList}</span>
            </div>
            {!checkIfAnyTrue && (
              <div className={styles.info}>
                <span className={styles.subHeader}>Preferred Days: </span>
                <span className={styles.dataText}>
                  {week.all.filter(day => daysOfTheWeek[day]).join(', ')}
                </span>
              </div>
            )}
            <div className={styles.info}>
              <span className={styles.subHeader}> Requested on: </span>
              <span className={classNames([styles.dataText, styles.createdAt])}>
                {dateFormatter(waitSpot.createdAt, timezone, 'MMM DD, YYYY h:mm A')}
              </span>
            </div>
          </div>
          {!isHub() && (
            <div className={styles.patientGeneralInfo}>
              {patient[patientPhone] && (
                <div className={styles.infoContainer}>
                  <Icon icon="phone" className={styles.icon} />
                  <span className={styles.infoData}>
                    {formatPhoneNumber(patient[patientPhone])}
                  </span>
                </div>
              )}
              {patient.email && (
                <div className={styles.infoContainer}>
                  <Icon icon="envelope" className={styles.icon} />
                  <span className={styles.infoData}>{patient.email}</span>
                </div>
              )}
            </div>
          )}
          {!isHub() && (
            <div className={styles.remove}>
              <IconButton icon="times" onClick={removeWaitSpot} />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPatientProfile = () => {
    const patientPhone = isPatientUser ? 'phoneNumber' : 'mobilePhoneNumber';

    return (
      <div className={styles.collapsiblePatientInfo}>
        <div className={styles.info}>
          <span className={styles.subHeader}>Gender: </span>
          <span className={styles.dataText}>{patient.gender}</span>
        </div>
        <div className={styles.info}>
          <span className={styles.subHeader}>Contact Info</span>
          {patient[patientPhone] && (
            <div className={styles.infoContainer}>
              <Icon icon="phone" className={styles.icon} />
              <span className={styles.infoData}>{formatPhoneNumber(patient[patientPhone])}</span>
            </div>
          )}
          {patient.email && (
            <div className={styles.infoContainer}>
              <Icon icon="envelope" className={styles.icon} />
              <span className={styles.infoData}>{patient.email}</span>
            </div>
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.subHeader}>Next appointment: </span>
          <span className={styles.dataText}>
            {patient.nextApptDate
              ? dateFormatter(patient.nextApptDate, timezone, 'MMM Do, YYYY h:mm A')
              : 'n/a'}
            {isPatientUser &&
              patient.endDate &&
              dateFormatter(patient.endDate, timezone, 'MMM Do, YYYY h:mm A')}
          </span>
        </div>
        <div className={styles.info}>
          <span className={styles.subHeader}>Last appointment: </span>
          <span className={styles.dataText}>
            {patient.lastApptDate
              ? dateFormatter(patient.lastApptDate, timezone, 'MMM Do, YYYY h:mm A')
              : 'n/a'}
          </span>
        </div>
        <div className={styles.info}>
          <span className={styles.subHeader}>Address: </span>
          {patient.address && Object.keys(patient.address).length ? (
            <div>
              <div className={styles.dataText}>{patient.address.street}</div>
              <div className={styles.dataText}>{patient.address.city}</div>
              <div className={styles.dataText}>{patient.address.country}</div>
            </div>
          ) : (
            <span className={styles.dataText}>n/a</span>
          )}
        </div>
      </div>
    );
  };

  return isHub() ? (
    <Collapsible hasIcon={false} title={renderContent()}>
      {renderPatientProfile()}
    </Collapsible>
  ) : (
    renderContent()
  );
};

WaitListItem.defaultProps = {
  patient: null,
  isPatientUser: false,
  removeBorder: false,
  selected: false,
};

WaitListItem.propTypes = {
  removeWaitSpot: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  patient: PropTypes.shape({
    address: PropTypes.shape({
      city: PropTypes.string,
      street: PropTypes.string,
      state: PropTypes.string,
      country: PropTypes.string,
    }),
    birthDate: PropTypes.string,
    ccId: PropTypes.string,
    clientId: PropTypes.string,
    email: PropTypes.string,
    endDate: PropTypes.string,
    firstName: PropTypes.string,
    gender: PropTypes.string,
    id: PropTypes.string,
    lastApptDate: PropTypes.string,
    lastName: PropTypes.string,
    mobilePhoneNumber: PropTypes.string,
    nextApptDate: PropTypes.string,
    phoneNumber: PropTypes.string,
  }),
  waitSpot: PropTypes.shape({
    endDate: PropTypes.string,
    createdAt: PropTypes.string,
    preferences: PropTypes.shape({
      evenings: PropTypes.bool,
      mornings: PropTypes.bool,
      afternoons: PropTypes.bool,
    }),
    daysOfTheWeek: PropTypes.shape({
      friday: PropTypes.bool,
      monday: PropTypes.bool,
      sunday: PropTypes.bool,
      tuesday: PropTypes.bool,
      saturday: PropTypes.bool,
      thursday: PropTypes.bool,
      wednesday: PropTypes.bool,
    }),
  }).isRequired,
  isPatientUser: PropTypes.bool,
  removeBorder: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps)(WaitListItem);
