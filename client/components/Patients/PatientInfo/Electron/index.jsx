
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PatientInfo from '../';

function PatientInfoPage({ patientId }) {
  if (!patientId) {
    return null;
  }

  const params = {
    match: {
      params: {
        patientId,
      },
    },
  };

  return <PatientInfo {...params} />;
}

PatientInfoPage.propTypes = {
  patientId: PropTypes.string,
};

const mapStateToProps = ({ entities, chat }, { patientId }) => {
  if (patientId) {
    return {
      patientId,
    };
  }

  const selectedChat = chat.get('selectedChatId');
  const finalChat = selectedChat || chat.get('newChat');

  const selectedPatientId =
    finalChat && finalChat.patientId
      ? finalChat.patientId
      : entities.getIn(['chats', 'models', finalChat, 'patientId']);

  return {
    patientId: selectedPatientId,
  };
};

export default connect(mapStateToProps)(PatientInfoPage);
