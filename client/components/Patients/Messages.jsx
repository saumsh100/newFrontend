
import PropTypes from 'prop-types';
import React from 'react';
import ChatContainer from '../../containers/ChatContainer';

function Messages({ patient, patients }) {
  return (
    <div>
      Messages
      {/* <ChatContainer patient={patient} patients={patients} /> */}
    </div>
  );
}

Messages.propTypes = {
  patient: PropTypes.object,
  patients: PropTypes.object,
};

export default Messages;

// <Chat patient={patient}
// 	patients={patients}
// 	patientList={patientList}
// 	textMessages={textMessages}
// />
