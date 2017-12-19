
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { updateEntityRequest, fetchEntities, createEntityRequest, deleteEntityRequest } from '../../../../thunks/fetchEntities';
import {
  Button,
  RemoteSubmitButton,
  DialogBox,
} from '../../../library';
import { convertIntervalToMs } from '../../../../../server/util/time';
import CommunicationSettingsCard from '../../Shared/CommunicationSettingsCard';
import RemindersItem from './RemindersItem';
import CreateRemindersForm from './CreateRemindersForm';
import ReminderPreview from './ReminderPreview';
import IconCircle from '../../Shared/IconCircle';
import TouchPointItem, { TouchPointLabel } from '../../Shared/TouchPointItem';
import styles from './styles.scss';

class Reminders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdding: false,
      selectedReminderId: null,
    };

    this.newReminder = this.newReminder.bind(this);
    this.openModal = this.openModal.bind(this);
    this.selectReminder = this.selectReminder.bind(this);
    this.toggleAdding = this.toggleAdding.bind(this);
  }

  componentWillMount() {
    this.props.fetchEntities({
      url: `/api/accounts/${this.props.activeAccount.id}/reminders`,
    });
  }

  toggleAdding() {
    this.setState({ isAdding: !this.state.isAdding });
  }

  openModal() {
    const newState = {
      active: false,
      activeNew: true,
    };

    this.setState(newState);
  }

  newReminder(values) {
    const {
      primaryType,
      number,
      type,
    } = values;

    const lengthSeconds = numTypeToSeconds(number, type);
    const entityData = {
      lengthSeconds,
      primaryType,
    };

    const alert = {
      success: {
        body: 'Reminder Created',
      },

      error: {
        title: 'Clinic Reminders Error',
        body: 'Failed to create.',
      },
    };

    this.props.createEntityRequest({ url: `/api/accounts/${this.props.activeAccount.id}/reminders`, entityData, alert })
      .then(() => {
        this.setState({
          isAdding: false,
        });

        this.props.reset('newReminder');
      });
  }

  selectReminder(reminderId) {
    if (reminderId === this.state.selectedReminderId) {
      return;
    }

    this.setState({ selectedReminderId: reminderId });
  }

  render() {
    if (!this.props.activeAccount || !this.props.activeAccount.id) {
      return null;
    }

    const actionsNew = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button, props: { color: 'darkgrey' } },
      { label: 'Save', onClick: this.newReminder, component: RemoteSubmitButton, props: { form: 'newReminder' } },
    ];

    const { activeAccount } = this.props;
    const { selectedReminderId } = this.state;
    const selectedReminder = this.props.reminders.get(selectedReminderId);

    let previewComponent = null;
    if (selectedReminder) {
      previewComponent = (
        <ReminderPreview
          reminder={selectedReminder}
          account={activeAccount}
        />
      );
    }

    return (
      <CommunicationSettingsCard
        title="Reminders Settings"
        rightActions={(
          <Button
            onClick={this.toggleAdding}
            data-test-id="createNewReminder"
            color="blue"
          >
            Add
          </Button>
        )}

        leftColumn={(
          <div>
            {this.props.reminders.toArray().map((reminder, i) => {
              return (
                <RemindersItem
                  key={reminder.id}
                  reminder={reminder}
                  account={this.props.activeAccount}
                  index={i}
                  selectReminder={this.selectReminder}
                  selected={reminder.id === selectedReminderId}
                />
              );
            })}
            <TouchPointItem
              noLines
              className={styles.bottomItem}
              mainComponent={(
                <div className={styles.bottomBox}>
                  <div className={styles.bottomIconContainer}>
                    <IconCircle
                      icon="calendar"
                      color="blue"
                    />
                  </div>
                  <div className={styles.bottomLabel}>
                    <TouchPointLabel title="Appointment" />
                  </div>
                </div>
              )}
            />
          </div>
        )}

        rightColumn={previewComponent}
      >
        <DialogBox
          actions={actionsNew}
          title="Add Reminder"
          type="small"
          active={this.state.isAdding}
          onEscKeyDown={this.toggleAdding}
          onOverlayClick={this.toggleAdding}
        >
          <CreateRemindersForm
            formName="newReminder"
            sendEdit={this.newReminder}
          />
        </DialogBox>
      </CommunicationSettingsCard>
    );
  }
}

Reminders.propTypes = {
  activeAccount: PropTypes.object,
  reminders: PropTypes.object,
  role: PropTypes.string,
  updateEntityRequest: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
  fetchEntities: PropTypes.func,
  createEntityRequest: PropTypes.func,
  reset: PropTypes.func,
};

function mapStateToProps({ entities, auth }) {
  const role = auth.get('role');
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const reminders = entities.getIn(['reminders', 'models'])
    .filter(r => !r.isDeleted)
    .sortBy(r => { console.log(r.interval); return -convertIntervalToMs(r.interval) });

  return {
    activeAccount,
    reminders,
    role,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    createEntityRequest,
    deleteEntityRequest,
    updateEntityRequest,
    reset,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Reminders);
