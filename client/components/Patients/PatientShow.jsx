
import PropTypes from 'prop-types';
import React from 'react';
import ChatContainer from '../../containers/ChatContainer';

function PatientShow({ patient, patients }) {
  if (patient === null) return <div>Loading...</div>;
  return (
    <div>
      <ChatContainer patient={patient} patients={patients} />
    </div>
  );
}

PatientShow.propTypes = {
  patient: PropTypes.object,
  patients: PropTypes.object,
};

export default PatientShow;
