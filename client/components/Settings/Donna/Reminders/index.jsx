
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { ordinalSuffix, convertIntervalToMs } from '@carecru/isomorphic';
import {
  updateEntityRequest,
  fetchEntities,
  createEntityRequest,
} from '../../../../thunks/fetchEntities';
import { sendReminderPreviewCall } from '../../../../thunks/settings';
import { Button, RemoteSubmitButton, DialogBox, Icon, DropdownMenu } from '../../../library';
import { accountShape } from '../../../library/PropTypeShapes';
import CommunicationSettingsCard from '../../Shared/CommunicationSettingsCard';
import RemindersItem from './RemindersItem';
import CreateRemindersForm from './CreateRemindersForm';
import AdvancedSettingsForm from './AdvancedSettingsForm';
import ReminderPreview from './ReminderPreview';
import IconCircle from '../../Shared/IconCircle';
import TouchPointItem, { TouchPointLabel } from '../../Shared/TouchPointItem';
import EnabledFeature from '../../../library/EnabledFeature';
import CreatePhoneCall from './CreatePhoneCall';
import styles from './styles.scss';

class Reminders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdding: false,
      isTesting: false,
      selectedReminderId: null,
      selectedAdvancedReminderId: null,
    };

    this.newReminder = this.newReminder.bind(this);
    this.openModal = this.openModal.bind(this);
    this.selectReminder = this.selectReminder.bind(this);
    this.selectAdvancedSettings = this.selectAdvancedSettings.bind(this);
    this.toggleAction = this.toggleAction.bind(this);
    this.closeAdvancedSettings = this.closeAdvancedSettings.bind(this);
    this.saveAdvancedSettingsReminder = this.saveAdvancedSettingsReminder.bind(this);
  }

  componentDidMount() {
    this.props.fetchEntities({ url: `/api/accounts/${this.props.activeAccount.id}/reminders` });
  }

  toggleAction(action) {
    this.setState(prevState => ({ [action]: !prevState[action] }));
  }

  openModal() {
    const newState = {
      active: false,
      activeNew: true,
    };

    this.setState(newState);
  }

  newReminder(values) {
    const { primaryType, number, type } = values;

    const entityData = {
      interval: `${number} ${type}`,
      primaryTypes: primaryType.split('_'),
    };

    const alert = {
      success: { body: 'Reminder Created' },

      error: {
        title: 'Clinic Reminders Error',
        body: 'Failed to create.',
      },
    };

    this.props
      .createEntityRequest({
        url: `/api/accounts/${this.props.activeAccount.id}/reminders`,
        entityData,
        alert,
      })
      .then(() => {
        this.setState({ isAdding: false });

        this.props.reset('newReminder');
      });
  }

  saveAdvancedSettingsReminder(values) {
    const { reminders, activeAccount } = this.props;
    const { selectedAdvancedReminderId } = this.state;

    const reminder = reminders.get(selectedAdvancedReminderId);
    if (!reminder) {
      console.error('Reminder does not exist in Redux state');
      return;
    }

    const newValues = Object.assign({}, values);
    const {
      isCustomConfirm,
      customConfirmString,
      omitChairIdsString,
      omitPractitionerIdsString,
      isDaily,
      startTime,
    } = newValues;

    if (isCustomConfirm && customConfirmString) {
      newValues.customConfirmData = JSON.parse(customConfirmString);
    } else {
      newValues.customConfirmData = null;
    }

    if (!isDaily) {
      newValues.dailyRunTime = null;
    }

    if (!startTime) {
      newValues.startTime = null;
    }

    newValues.omitChairIds = omitChairIdsString ? omitChairIdsString.split(',') : [];
    newValues.omitPractitionerIds = omitPractitionerIdsString
      ? omitPractitionerIdsString.split(',')
      : [];

    const alert = {
      success: {
        title: 'Updated Reminder Settings',
        body: "Successfully updated the reminder's advanced settings",
      },

      error: {
        title: 'Error Updating Reminder Settings',
        body: 'Failed to update the advanced settings for reminder',
      },
    };

    this.props
      .updateEntityRequest({
        url: `/api/accounts/${activeAccount.id}/reminders/${reminder.id}`,
        values: newValues,
        alert,
      })
      .then(this.closeAdvancedSettings);
  }

  selectReminder(reminderId) {
    if (reminderId === this.state.selectedReminderId) {
      return;
    }

    this.setState({ selectedReminderId: reminderId });
  }

  selectAdvancedSettings(reminderId) {
    this.setState({ selectedAdvancedReminderId: reminderId });
  }

  closeAdvancedSettings() {
    this.setState({ selectedAdvancedReminderId: null });
  }

  render() {
    const { activeAccount, reminders } = this.props;
    const { selectedReminderId, selectedAdvancedReminderId } = this.state;
    if (!activeAccount || !activeAccount.id) {
      return null;
    }

    const advancedSettingsActions = [
      {
        label: 'Cancel',
        onClick: this.closeAdvancedSettings,
        component: Button,
        props: { border: 'blue' },
      },
      {
        label: 'Save',
        onClick: this.saveAdvancedSettingsReminder,
        component: RemoteSubmitButton,
        props: {
          color: 'blue',
          form: `advancedSettingsReminders_${selectedAdvancedReminderId}`,
        },
      },
    ];

    const actionsNew = [
      {
        label: 'Cancel',
        onClick: this.reinitializeState,
        component: Button,
        props: { border: 'blue' },
      },
      {
        label: 'Save',
        onClick: this.newReminder,
        component: RemoteSubmitButton,
        props: {
          color: 'blue',
          form: 'newReminder',
        },
      },
    ];

    const selectedReminder = this.props.reminders.get(selectedReminderId);

    const previewComponent = selectedReminder && (
      <ReminderPreview
        reminder={selectedReminder}
        account={activeAccount}
        openCallTestModal={() => this.toggleAction('isTesting')}
      />
    );

    // Used to display the cogs button to open Advanced Settings
    const advancedReminder = reminders.get(selectedAdvancedReminderId);
    const advancedIndex = reminders.toArray().findIndex(r => r.id === selectedAdvancedReminderId);
    return (
      <CommunicationSettingsCard
        title="Reminders Settings"
        rightActions={
          <div>
            <Button
              color="blue"
              onClick={() => this.toggleAction('isAdding')}
              className={styles.outlineButton}
              data-test-id="button_createNewReminder"
            >
              Add
            </Button>
            <EnabledFeature
              predicate={({ flags }) => flags.get('voice-touchpoint-settings')}
              render={() => (
                <DropdownMenu
                  labelComponent={props => (
                    <Button {...props} compact className={styles.labelButton}>
                      Send a Test
                      <Icon icon="sort-down" size={1} className={styles.labelIcon} type="solid" />
                    </Button>
                  )}
                  className={styles.optionMenu}
                >
                  <Button
                    className={styles.listItem}
                    onClick={() => this.toggleAction('isTesting')}
                  >
                    Voice
                  </Button>
                  <Button className={styles.listItem} disabled>
                    SMS <span>Coming Soon</span>
                  </Button>
                  <Button className={styles.listItem} disabled>
                    Email <span>Coming Soon</span>
                  </Button>
                </DropdownMenu>
              )}
            />
          </div>
        }
        leftColumn={
          <div>
            {reminders.toArray().map((reminder, i) => (
              <RemindersItem
                key={reminder.id}
                reminder={reminder}
                account={activeAccount}
                index={i}
                onSelectReminder={this.selectReminder}
                onSelectAdvancedSettings={this.selectAdvancedSettings}
                isSelected={reminder.id === selectedReminderId}
              />
            ))}
            <TouchPointItem
              noLines
              className={styles.bottomItem}
              mainComponent={
                <div className={styles.bottomBox}>
                  <div className={styles.bottomIconContainer}>
                    <IconCircle icon="calendar" color="blue" />
                  </div>
                  <div className={styles.bottomLabel}>
                    <TouchPointLabel title="Appointment" />
                  </div>
                </div>
              }
            />
          </div>
        }
        rightColumn={previewComponent}
      >
        <DialogBox
          type="small"
          actions={advancedSettingsActions}
          title={`${ordinalSuffix(advancedIndex + 1)} Reminder Settings`}
          active={advancedReminder && !!this.state.selectedAdvancedReminderId}
          onEscKeyDown={this.closeAdvancedSettings}
          onOverlayClick={this.closeAdvancedSettings}
        >
          {advancedReminder ? (
            <AdvancedSettingsForm
              reminder={advancedReminder}
              onSubmit={this.saveAdvancedSettingsReminder}
            />
          ) : null}
        </DialogBox>
        <DialogBox
          actions={actionsNew}
          title="Add Reminder"
          type="small"
          active={this.state.isAdding}
          onEscKeyDown={() => this.toggleAction('isAdding')}
          onOverlayClick={() => this.toggleAction('isAdding')}
        >
          <CreateRemindersForm formName="newReminder" sendEdit={this.newReminder} />
        </DialogBox>
        {this.state.isTesting && (
          <CreatePhoneCall
            active={this.state.isTesting}
            toggleAction={() => this.toggleAction('isTesting')}
            reminders={reminders.map(a => a.get('interval')).toArray()}
            account={this.props.activeAccount}
            selectedTouchpoint={reminders.getIn([selectedReminderId, 'interval'])}
            sendReminderPreviewCall={this.props.sendReminderPreviewCall}
          />
        )}
      </CommunicationSettingsCard>
    );
  }
}

Reminders.propTypes = {
  activeAccount: PropTypes.shape(accountShape).isRequired,
  reminders: PropTypes.shape({ get: PropTypes.func.isRequired }).isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  sendReminderPreviewCall: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const reminders = entities
    .getIn(['reminders', 'models'])
    .filter(r => !r.isDeleted && !!r.interval)
    .sortBy(r => -convertIntervalToMs(r.interval));
  return {
    activeAccount,
    reminders,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchEntities,
      createEntityRequest,
      updateEntityRequest,
      sendReminderPreviewCall,
      reset,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reminders);
