
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import { Avatar } from '../../library';
import ToggleChatButton from './ToggleChatButton';
import PatientSearch from '../../PatientSearch';
import PatientName from './PatientName';

const DesktopHeader = ({
  selectedPatient,
  toggleChat,
  onSearch,
  toInputTheme,
  isChatOpen,
  toInputProps,
}) => (
  <div className={styles.wrapper}>
    {selectedPatient ? (
      <div className={styles.patientInfoWrapper}>
        <Avatar size="sm" user={selectedPatient} />
        <div className={styles.patientInfoName}>
          <PatientName selectedPatient={selectedPatient} />
        </div>
        <ToggleChatButton toggleChat={toggleChat} isChatOpen={isChatOpen} />
      </div>
    ) : (
      <PatientSearch
        placeholder="To: Type the name of the person"
        onSelect={onSearch}
        inputProps={toInputProps}
        theme={toInputTheme}
      />
    )}
  </div>
);

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
  }),
  toInputProps: PropTypes.objectOf(PropTypes.string),
  toInputTheme: PropTypes.objectOf(PropTypes.string),
  toggleChat: PropTypes.func.isRequired,
  isChatOpen: PropTypes.bool.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default DesktopHeader;
