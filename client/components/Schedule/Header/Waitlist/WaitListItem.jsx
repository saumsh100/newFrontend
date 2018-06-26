
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import moment from 'moment';
import { Avatar, Icon, PatientPopover, IconButton, Checkbox, Collapsible } from '../../../library';
import { FormatPhoneNumber } from '../../../library/util/Formatters';
import { isHub } from '../../../../util/hub';
import styles from './styles.scss';

export default function WaitListItem({
  waitSpot,
  patient,
  removeWaitSpot,
  isPatientUser,
  removeBorder,
  selected,
  onSelect: onSelectCallback,
}) {
  const onSelect = (event) => {
    event.stopPropagation();
    onSelectCallback();
  };

  const renderPatientHeading = () => {
    if (isHub()) {
      return (
        <div className={styles.name}>
          {patient.firstName} {patient.lastName}
        </div>
      );
    }

    return (
      <PatientPopover
        patient={isPatientUser ? Object.assign(patient, { endDate: waitSpot.endDate }) : patient}
        isPatientUser={isPatientUser}
        placement="left"
      >
        <div className={styles.name}>
          {patient.firstName} {patient.lastName}
        </div>
      </PatientPopover>
    );
  };

  const renderContent = () => {
    if (!patient) {
      return null;
    }

    const { preferences, daysOfTheWeek } = waitSpot;

    const prefKeys = Object.keys(omit(preferences, ['weekdays', 'weekends']));

    const dayWeekKeys = Object.keys(daysOfTheWeek);
    const checkIfAnyTrue = dayWeekKeys.every(k => !daysOfTheWeek[k]);

    const patientPhone = isPatientUser ? 'phoneNumber' : 'mobilePhoneNumber';

    let nextAppt = null;

    if (isPatientUser) {
      nextAppt = moment(waitSpot.endDate).format('MMM Do YYYY');
    } else if (!isPatientUser && moment(patient.nextApptDate).isValid()) {
      nextAppt = moment(patient.nextApptDate).format('MMM Do YYYY');
    }

    const wrapperStyle = classNames({
      [styles.wrapper]: !isHub(),
      [styles.listItemWrapperHub]: isHub(),
      [styles.removeBorder]: removeBorder,
    });

    const checkboxStyle = classNames(styles.checkBox, {
      [styles.checked]: selected,
    });

    const patientInfoSectionHub = isHub() && (
      <div className={styles.heading}>
        <Avatar user={patient} size="xs" />
        {renderPatientHeading()}
      </div>
    );

    const filteredPreferencesList = prefKeys.filter(pref => preferences[pref]).join(', ');
    const filteredDaysList = dayWeekKeys.filter(day => daysOfTheWeek[day]).join(', ');

    return (
      <div className={styles.waitListItem} data-test-id="list_waitListItem">
        {isHub() && (
          <Checkbox customContainer={checkboxStyle} onChange={onSelect} checked={selected} />
        )}

        <div className={wrapperStyle}>
          {patientInfoSectionHub}

          {!isHub() && (
            <div className={styles.avatar}>
              <Avatar user={patient} size="sm" />
            </div>
          )}

          <div className={styles.patientPrefInfo}>
            {!isHub() && renderPatientHeading()}

            <div className={styles.info}>
              <span className={styles.subHeader}> Next Appt: </span>
              <span className={styles.dataText}>{nextAppt || 'n/a'}</span>
            </div>

            <div className={styles.info}>
              <span className={styles.subHeader}>Preferences: </span>
              <span className={styles.dataText}>{filteredPreferencesList}</span>
            </div>

            {!checkIfAnyTrue && (
              <div className={styles.info}>
                <span className={styles.subHeader}>Preferred Days: </span>
                <span className={styles.dataText}>{filteredDaysList}</span>
              </div>
            )}

            <div className={styles.info}>
              <span className={styles.subHeader}> Requested on: </span>
              <span className={classNames([styles.dataText, styles.createdAt])}>
                {moment(waitSpot.createdAt).format('MMM DD, YYYY h:mm A')}
              </span>
            </div>
          </div>

          {!isHub() && (
            <div className={styles.patientGeneralInfo}>
              {patient[patientPhone] && (
                <div className={styles.infoContainer}>
                  <Icon icon="phone" className={styles.icon} />
                  <span className={styles.infoData}>
                    {FormatPhoneNumber(patient[patientPhone])}
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
              <span className={styles.infoData}>{FormatPhoneNumber(patient[patientPhone])}</span>
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
              ? moment(patient.nextApptDate).format('MMM Do, YYYY h:mm A')
              : 'n/a'}
            {isPatientUser &&
              patient.endDate &&
              moment(patient.endDate).format('MMM Do, YYYY h:mm A')}
          </span>
        </div>
        <div className={styles.info}>
          <span className={styles.subHeader}>Last appointment: </span>
          <span className={styles.dataText}>
            {patient.lastApptDate
              ? moment(patient.lastApptDate).format('MMM Do, YYYY h:mm A')
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

  if (isHub()) {
    return (
      <Collapsible hasIcon={false} title={renderContent()}>
        {renderPatientProfile()}
      </Collapsible>
    );
  }

  return renderContent();
}

WaitListItem.defaultProps = {
  patient: null,
  isPatientUser: false,
  removeBorder: false,
  selected: false,
};

WaitListItem.propTypes = {
  removeWaitSpot: PropTypes.func.isRequired,
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
