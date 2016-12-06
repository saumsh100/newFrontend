
import React, { PropTypes } from 'react';
import ChatContainer from '../../containers/ChatContainer';

function PatientShow({ patient }) {
  if (patient === null) return <div>Loading...</div>;
  return (
    <div>
      <h5>
        {`${patient.firstName} ${patient.lastName}`}
      </h5><br/>
      <ChatContainer patient={patient} />
    </div>
  );
}

PatientShow.propTypes = {
  patient: PropTypes.object,
};

export default PatientShow;
