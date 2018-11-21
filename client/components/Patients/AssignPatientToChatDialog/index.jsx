
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, DialogBox } from '../../library';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import PatientShape from '../../library/PropTypeShapes/patient';

function AssignPatientToChatDialog({ patient, active, callback, ...props }) {
  const onSubmit = () => {
    const { id, foundChatId } = patient;

    props
      .updateEntityRequest({
        key: 'chats',
        values: { patientId: id },
        url: `/api/chats/${foundChatId}`,
        merge: true,
      })
      .then(callback);
  };

  const actions = [
    {
      label: 'No',
      onClick: callback,
      component: Button,
      props: { border: 'blue' },
    },
    {
      label: 'Yes',
      onClick: onSubmit,
      component: Button,
      props: { color: 'blue' },
    },
  ];

  return (
    <DialogBox
      actions={actions}
      title="Assign chat to the patient"
      type="medium"
      data-test-id="patientAssignConfirm"
      active={active}
      onEscKeyDown={callback}
      onOverlayClick={callback}
    >
      <p>
        {`We have found a chat conversation with phone number ${patient &&
          patient.mobilePhoneNumber} already existing in our system, do you want to assign it to this patient?`}
      </p>
    </DialogBox>
  );
}

AssignPatientToChatDialog.propTypes = {
  active: PropTypes.bool,
  patient: PropTypes.shape(PatientShape),
  callback: PropTypes.func,
  updateEntityRequest: PropTypes.func.isRequired,
};

AssignPatientToChatDialog.defaultProps = {
  active: false,
  patient: null,
  callback: () => {},
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateEntityRequest }, dispatch);
}

export default connect(
  null,
  mapDispatchToProps,
)(AssignPatientToChatDialog);
