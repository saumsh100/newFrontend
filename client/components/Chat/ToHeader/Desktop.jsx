import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { Avatar } from '../../library';
import PatientSearch from '../../PatientSearch';
import PatientName from './PatientName';
import styles from './styles.scss';
import ToggleChatButton from './ToggleChatButton';

const DesktopHeader = ({
  selectedPatient,
  toggleChat,
  onSearch,
  toInputTheme,
  isChatOpen,
  toInputProps,
  isFetchingProspect,
}) => {
  if (isFetchingProspect) {
    return (
      <div className={styles.patientInfoWrapper}>
        <Skeleton circle width={30} height={30} />
        <div className={styles.patientInfoName}>
          <Skeleton width={200} />
        </div>
      </div>
    );
  }

  if (selectedPatient && selectedPatient.cellPhoneNumber === null && selectedPatient.id === null) {
    return (
      <PatientSearch
        placeholder="To: Type the name of the person"
        onSelect={onSearch}
        inputProps={toInputProps}
        theme={toInputTheme}
      />
    );
  }

  if (selectedPatient && !isFetchingProspect) {
    return (
      <div className={styles.patientInfoWrapper}>
        <Avatar size="sm" user={selectedPatient} />
        <div className={styles.patientInfoName}>
          <PatientName selectedPatient={selectedPatient} />
        </div>
        <ToggleChatButton toggleChat={toggleChat} isChatOpen={isChatOpen} />
      </div>
    );
  }

  return (
    <PatientSearch
      placeholder="To: Type the name of the person"
      onSelect={onSearch}
      inputProps={toInputProps}
      theme={toInputTheme}
      noBorder
    />
  );
};

DesktopHeader.defaultProps = {
  toInputTheme: {},
  toInputProps: {},
  selectedPatient: undefined,
};

DesktopHeader.propTypes = {
  selectedPatient: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    isUnknown: PropTypes.bool,
    cellPhoneNumber: PropTypes.string,
    id: PropTypes.string,
  }),
  toInputProps: PropTypes.objectOf(PropTypes.string),
  toInputTheme: PropTypes.objectOf(PropTypes.string),
  toggleChat: PropTypes.func.isRequired,
  isChatOpen: PropTypes.bool.isRequired,
  onSearch: PropTypes.func.isRequired,
  isFetchingProspect: PropTypes.bool.isRequired,
};

export default DesktopHeader;
