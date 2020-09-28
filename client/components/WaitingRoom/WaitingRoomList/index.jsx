
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, DialogBox, List, RemoteSubmitButton } from '../../library';
import NotifyPatientForm from '../NotifyPatientForm';
import WaitingRoomListItem from './WaitingRoomListItem';

const notifyAlert = ({ waitingRoomPatient: { patient, sentWaitingRoomNotifications } }) => ({
  success: {
    title: `Patient ${sentWaitingRoomNotifications.length ? 'Re-Notified' : 'Notified'}`,
    body:
      `${patient.firstName} was successfully ` +
      `${sentWaitingRoomNotifications.length ? 're-notified' : 'notified'} to come in.`,
  },
  error: {
    title: `Failed to ${sentWaitingRoomNotifications.length ? 'Re-Notify' : 'Notify'} Patient`,
    body:
      `${patient.firstName} could not be sent ` +
      `${sentWaitingRoomNotifications.length ? 'another' : 'a'} notification to come in.`,
  },
});

const cleanAlert = ({ isCleaned, waitingRoomPatient: { patient } }) => ({
  success: {
    title: `Room ${isCleaned ? 'Cleaned' : 'Not Cleaned'}`,
    body: `${patient.firstName}'s room was successfully marked as ${
      isCleaned ? '"cleaned"' : '"not cleaned"'
    }.`,
  },
  error: {
    title: 'Failed to Updated Room',
    body: `${patient.firstName}'s room could not be marked as ${
      isCleaned ? 'cleaned' : 'not cleaned'
    }.`,
  },
});

const completeAlert = ({ waitingRoomPatient: { patient } }) => ({
  success: {
    title: 'Waiting Room Entry Completed',
    body: `Intake for ${patient.firstName} was successfully completed.`,
  },
  error: {
    title: 'Failed to Complete',
    body: `${patient.firstName}'s waiting room entry could not be completed.`,
  },
});

function WaitingRoomList(props) {
  const {
    waitingRoomPatients,
    defaultTemplate,
    onNotify,
    onClean,
    onComplete,
    displayNameOption,
  } = props;
  const [selectedWaitingRoomPatient, setSelectedWaitingRoomPatient] = useState(null);
  const toggleNotifying = () => setSelectedWaitingRoomPatient(null);

  const formName = `notifyPatientForm_${selectedWaitingRoomPatient &&
    selectedWaitingRoomPatient.id}`;

  const isReNotifying =
    selectedWaitingRoomPatient &&
    selectedWaitingRoomPatient.sentWaitingRoomNotifications.length > 0;

  return (
    <List>
      {waitingRoomPatients.map(waitingRoomPatient => (
        <WaitingRoomListItem
          key={waitingRoomPatient.id}
          waitingRoomPatient={waitingRoomPatient}
          onNotify={() => setSelectedWaitingRoomPatient(waitingRoomPatient)}
          onClean={({ isCleaned }) =>
            onClean({
              isCleaned,
              waitingRoomPatient,
              alert: cleanAlert({
                isCleaned,
                waitingRoomPatient,
              }),
            })
          }
          onComplete={({ isCompleted }) =>
            onComplete({
              isCompleted,
              waitingRoomPatient,
              alert: completeAlert({ waitingRoomPatient }),
            })
          }
        />
      ))}
      <DialogBox
        title={`${isReNotifying ? 'Re-Notify' : 'Notify'} Patient You Are Ready`}
        active={!!selectedWaitingRoomPatient}
        onEscKeyDown={toggleNotifying}
        onOverlayClick={toggleNotifying}
        type="small"
        actions={[
          {
            label: 'Cancel',
            onClick: toggleNotifying,
            component: Button,
            props: { border: 'blue' },
          },
          {
            label: `${isReNotifying ? 'Re-Notify' : 'Notify'} Patient`,
            component: RemoteSubmitButton,
            props: {
              color: 'blue',
              form: formName,
              removePristineCheck: true,
            },
          },
        ]}
      >
        {selectedWaitingRoomPatient && (
          <NotifyPatientForm
            formName={formName}
            defaultTemplate={defaultTemplate}
            displayNameOption={displayNameOption}
            waitingRoomPatient={selectedWaitingRoomPatient}
            onSubmit={({ message }) =>
              onNotify({
                message,
                waitingRoomPatient: selectedWaitingRoomPatient,
                alert: notifyAlert({ waitingRoomPatient: selectedWaitingRoomPatient }),
              }).then(toggleNotifying)
            }
          />
        )}
      </DialogBox>
    </List>
  );
}

WaitingRoomList.defaultProps = {
  defaultTemplate: '',
};

WaitingRoomList.propTypes = {
  defaultTemplate: PropTypes.string,
  displayNameOption: PropTypes.oneOf(['firstName', 'prefName']).isRequired,
  waitingRoomPatients: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onNotify: PropTypes.func.isRequired,
  onClean: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default WaitingRoomList;
