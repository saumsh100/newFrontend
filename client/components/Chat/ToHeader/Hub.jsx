import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Avatar, Button, Icon } from '../../library';
import PatientSearch from '../../PatientSearch';
import PatientName from './PatientName';
import styles from './styles.scss';

const HubHeader = ({
  selectedPatient,
  onSearch,
  onPatientInfoClick,
  toInputTheme,
  toInputProps,
}) => (
  <div className={classNames(styles.wrapper)}>
    {selectedPatient && selectedPatient.id !== null ? (
      <div className={styles.patientInfoWrapper}>
        <Button
          flat
          fluid
          onClick={() => {
            onPatientInfoClick(`${selectedPatient.firstName} ${selectedPatient.lastName}`);
          }}
          className={styles.patientInfoButton}
        >
          <Avatar size="xs" user={selectedPatient} />
          <div className={styles.patientInfoName}>
            <PatientName selectedPatient={selectedPatient} />
          </div>
          <Icon className={styles.infoArrow} icon="angle-right" type="light" />
        </Button>
      </div>
    ) : (
      <PatientSearch
        placeholder="To: Type the name of the person"
        onSelect={onSearch}
        inputProps={toInputProps}
        theme={toInputTheme}
        focusInputOnMount
      />
    )}
  </div>
);

HubHeader.defaultProps = {
  toInputTheme: {},
  toInputProps: {},
  selectedPatient: undefined,
};

HubHeader.propTypes = {
  selectedPatient: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    isUnknown: PropTypes.bool,
    cellPhoneNumber: PropTypes.string,
    id: PropTypes.string,
  }),
  toInputProps: PropTypes.objectOf(PropTypes.string),
  toInputTheme: PropTypes.objectOf(PropTypes.string),
  onSearch: PropTypes.func.isRequired,
  onPatientInfoClick: PropTypes.func.isRequired,
};

export default HubHeader;
