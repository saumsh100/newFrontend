
import React, { PropTypes } from 'react';
import ChatContainer from '../../containers/ChatContainer';

function Messages({ patient, patients }) {
  return (
    <div>
      Messages
      {/*<ChatContainer patient={patient} patients={patients} />*/}
    </div>
  );
}

Messages.propTypes = {
  patient: PropTypes.object,
  patients: PropTypes.object,
};

export default Messages;
