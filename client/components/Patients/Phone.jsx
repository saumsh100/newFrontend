
import React, { PropTypes } from 'react';
import ChatContainer from '../../containers/ChatContainer';

function Phone({ patient, patients }) {
  return (
    <div>
      Phone
      {/*<ChatContainer patient={patient} patients={patients} />*/}
    </div>
  );
}

Phone.propTypes = {
  patient: PropTypes.object,
  patients: PropTypes.object,
};

export default Phone;
