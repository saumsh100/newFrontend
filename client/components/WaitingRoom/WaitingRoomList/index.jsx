import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, DialogBox, List, RemoteSubmitButton } from '../../library';
import NotifyPatientForm from '../NotifyPatientForm';
import WaitingRoomListItem from './WaitingRoomListItem';
import { fetchWaitingRoomNotificationTemplate as fetchWaitingRoomNotificationTemplateAction } from '../../../thunks/waitingRoom';

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
    fetchWaitingRoomNotificationTemplate,
    accountId,
    activeAccount,
  } = props;
  const [selectedWaitingRoomPatient, setSelectedWaitingRoomPatient] = useState(null);
  const toggleNotifying = () => setSelectedWaitingRoomPatient(null);

  const formName = `notifyPatientForm_${
    selectedWaitingRoomPatient && selectedWaitingRoomPatient.id
  }`;

  const isReNotifying =
    selectedWaitingRoomPatient &&
    selectedWaitingRoomPatient.sentWaitingRoomNotifications.length > 0;

  return (
    <List>
      {waitingRoomPatients.map((waitingRoomPatient) => (
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
        type="notify"
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
            activeAccount={activeAccount}
            formName={formName}
            defaultTemplate={defaultTemplate}
            // On Refresh, we close the modal and re-open after the template call,
            // to allow redux form to repopulate.
            onRefresh={() => {
              const selectedWaitingRoomPatientCache = selectedWaitingRoomPatient;
              setSelectedWaitingRoomPatient(null);

              const reOpenPatientModal = () => {
                setSelectedWaitingRoomPatient(selectedWaitingRoomPatientCache);
              };

              fetchWaitingRoomNotificationTemplate({
                accountId,
                successCallback: reOpenPatientModal,
                errorCallback: reOpenPatientModal,
              });
            }}
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
  fetchWaitingRoomNotificationTemplate: PropTypes.func.isRequired,
  accountId: PropTypes.func.isRequired,
  activeAccount: PropTypes.shape({
    id: PropTypes.string,
    phoneNumber: PropTypes.string,
    name: PropTypes.string,
    toJS: PropTypes.func,
  }).isRequired,
};

function mapStateToProps({ auth, waitingRoom, entities }) {
  return {
    accountId: auth.get('accountId'),
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
    defaultTemplate: waitingRoom.get('defaultTemplate'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchWaitingRoomNotificationTemplate: fetchWaitingRoomNotificationTemplateAction,
    },
    dispatch,
  );
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(WaitingRoomList);
