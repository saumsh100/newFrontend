import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateEntityRequest } from '../../../../../thunks/fetchEntities';
import { DropdownSelect, Icon, Input, Toggle } from '../../../../library';
import { convertPrimaryTypesToKey } from '../../../Shared/util/primaryTypes';
import IconCircle from '../../../Shared/IconCircle';
import TinyDeleteButton from '../../../Shared/TinyDeleteButton';
import TouchPointItem, { TouchPointLabel } from '../../../Shared/TouchPointItem';
import Account from '../../../../../entities/models/Account';
import Reminders from '../../../../../entities/models/Reminder';
import EnabledFeature from '../../../../library/EnabledFeature';
import {
  intervalToNumType,
  numTypeToInterval,
  ordinalSuffix,
} from '../../../../../util/isomorphic';
import styles from './styles.scss';
import { wordMap } from '../../helpers';

const BUSINESS_DAYS_STRING = 'business days';

const iconsMap = {
  sms: 'comment',
  phone: 'phone',
  email: 'envelope',
  email_sms: 'envelope_comment',
};

const typeOptions = [
  {
    label: 'Hours',
    value: 'hours',
  },
  {
    label: 'Days',
    value: 'days',
  },
  {
    label: 'Business Days',
    value: BUSINESS_DAYS_STRING,
  },
];

const primaryTypesOptions = (showVoiceTouchPoint = false) => [
  {
    label: 'Email',
    value: 'email',
  },
  {
    label: 'SMS',
    value: 'sms',
  },
  {
    label: 'Email & SMS',
    value: 'email_sms',
  },
  ...(showVoiceTouchPoint
    ? [
        {
          label: 'Voice',
          value: 'phone',
        },
      ]
    : []),
];

const getType = (reminder) => {
  const { type } = intervalToNumType(reminder.interval);
  return type === 'days' && reminder.isBusinessDays ? BUSINESS_DAYS_STRING : type;
};

const SmallIconCircle = ({ selected, icon }) => {
  const wrapperClass = selected
    ? styles.smallReminderSelectWrapperCircleSelected
    : styles.smallReminderSelectWrapperCircle;

  return <div className={wrapperClass}>{icon && <Icon icon={icon} type="solid" />}</div>;
};

const AdvancedSettingsButton = (props) => <Icon icon="cogs" type="solid" {...props} />;

class RemindersItem extends Component {
  constructor(props) {
    super(props);

    const { num } = intervalToNumType(props.reminder.interval);
    this.state = { number: num };

    this.editReminder = this.editReminder.bind(this);
    this.deleteReminder = this.deleteReminder.bind(this);
    this.changePrimaryTypes = this.changePrimaryTypes.bind(this);
    this.onChangeNumberInput = this.onChangeNumberInput.bind(this);
    this.changeDaysHours = this.changeDaysHours.bind(this);
  }

  componentDidMount() {
    const { num } = intervalToNumType(this.props.reminder.interval);
    if (this.state.number === num) {
      return;
    }

    this.setState({ number: num });
  }

  onChangeNumberInput(e) {
    const val = e.target.value;

    // \D = all non digits
    let cleanVal = val.replace(/\D/g, '');

    // If zero, default to 1
    if (parseInt(cleanVal, 10) === 0) {
      cleanVal = 1;
    }

    return this.setState({ number: cleanVal || 1 });
  }

  changePrimaryTypes(value) {
    const { reminder, account } = this.props;
    const word = wordMap[value];
    const primaryTypes = value.split('_');

    const alert = {
      success: {
        title: 'Updated Reminder',
        body: `Set the primary communication type to ${word}`,
      },

      error: {
        title: 'Error Updating Reminder',
        body: `Failed to set the reminder's primary communication type to ${word}`,
      },
    };

    this.props.updateEntityRequest({
      url: `/api/accounts/${account.id}/reminders/${reminder.id}`,
      values: { primaryTypes },
      alert,
    });
  }

  changeNumber(number) {
    const { account, reminder } = this.props;
    const { num, type } = intervalToNumType(reminder.interval);
    if (num === number) {
      return;
    }

    const alert = {
      success: {
        title: 'Updated Reminder',
        body: `Set the reminder time to ${number} ${type} away`,
      },

      error: {
        title: 'Error Updating Reminder',
        body: `Failed to set the reminder time to ${number} ${type} away`,
      },
    };

    this.props.updateEntityRequest({
      url: `/api/accounts/${account.id}/reminders/${reminder.id}`,
      values: { interval: numTypeToInterval(number, type) },
      alert,
    });
  }

  changeDaysHours(newType) {
    const { account, reminder } = this.props;
    const { num } = intervalToNumType(reminder.interval);
    const currentType = getType(reminder);
    if (newType === currentType) {
      return;
    }

    const alert = {
      success: {
        title: 'Updated Reminder',
        body: `Set the reminder time to ${num} ${newType} away`,
      },

      error: {
        title: 'Error Updating Reminder',
        body: `Failed to set the reminder time to ${num} ${newType} away`,
      },
    };

    const isBusinessDays = newType === BUSINESS_DAYS_STRING;
    const values = {
      isBusinessDays,
      interval: numTypeToInterval(num, isBusinessDays ? 'days' : newType),
    };

    this.props.updateEntityRequest({
      url: `/api/accounts/${account.id}/reminders/${reminder.id}`,
      values,
      alert,
    });
  }

  deleteReminder(e) {
    // So that it doesn't bubble up and try to select this reminder
    e.stopPropagation();
    e.preventDefault();
    const { reminder, account } = this.props;
    const { num, type } = intervalToNumType(reminder.interval);
    const sure = window.confirm(`Are you sure you want to delete the ${num} ${type} reminder?`);
    if (!sure) {
      return;
    }

    const alert = {
      success: {
        title: 'Deleted Reminder',
        body: `You have deleted the ${num} ${type} reminder`,
      },

      error: {
        title: 'Error Deleting Reminder',
        body: `Failed to delete the ${num} ${type} reminder`,
      },
    };

    this.props.updateEntityRequest({
      url: `/api/accounts/${account.id}/reminders/${reminder.id}`,
      values: {
        isDeleted: true,
        isActive: false,
      },
      alert,
    });
  }

  editReminder(e) {
    const isActive = e.target.checked;
    const { reminder, account } = this.props;
    const word = isActive ? 'active' : 'inactive';

    const alert = {
      success: {
        title: 'Updated Reminder',
        body: `Set the reminder's interval to ${word}`,
      },

      error: {
        title: 'Error Updating Reminder',
        body: `Failed to set the reminder's primary communication type to ${word}`,
      },
    };

    this.props.updateEntityRequest({
      url: `/api/accounts/${account.id}/reminders/${reminder.id}`,
      values: { isActive },
      alert,
    });
  }

  render() {
    const { reminder, index, isSelected, onSelectReminder, onSelectAdvancedSettings } = this.props;

    const { primaryTypes, isActive } = reminder;

    const primaryTypesKey = convertPrimaryTypesToKey(primaryTypes);

    const icon = iconsMap[primaryTypesKey];
    const type = getType(reminder);

    const { number } = this.state;

    const dropdownSelectClass = isSelected ? styles.dropdownSelectSelected : styles.dropdownSelect;

    return (
      <TouchPointItem
        selected={isSelected}
        className={styles.reminderListItem}
        onClick={() => onSelectReminder(reminder.id)}
        toggleComponent={<Toggle color="green" checked={isActive} onChange={this.editReminder} />}
        labelComponent={
          <TouchPointLabel
            title={`${ordinalSuffix(index + 1)} Reminder`}
            data-test-id={`touchPoint_reminder_${index}`}
          />
        }
        mainComponent={
          <div>
            <div className={styles.reminderIconContainer}>
              <IconCircle icon={icon} selected={isSelected} />
            </div>
            <div
              className={isSelected ? styles.secondaryLinesBoxSelected : styles.secondaryLinesBox}
            >
              <div className={styles.smallIconContainer}>
                <SmallIconCircle icon="bell" selected={isSelected} />
              </div>
              <div className={styles.dropdownsWrapper}>
                <div className={styles.topRow}>
                  <EnabledFeature
                    predicate={() => true}
                    render={({ flags }) => (
                      <DropdownSelect
                        onChange={this.changePrimaryTypes}
                        className={dropdownSelectClass}
                        value={primaryTypesKey}
                        options={primaryTypesOptions(flags.get('voice-touchpoint-settings'))}
                      />
                    )}
                  />
                </div>
                <div className={styles.bottomRow}>
                  <div className={styles.bottomRowLeft}>
                    <Input
                      classStyles={dropdownSelectClass}
                      value={number}
                      onChange={this.onChangeNumberInput}
                      onBlur={(e) => this.changeNumber(e.target.value)}
                    />
                  </div>
                  <div className={styles.bottomRowRight}>
                    <DropdownSelect
                      onChange={this.changeDaysHours}
                      className={dropdownSelectClass}
                      value={type}
                      options={typeOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        rightComponent={
          <div className={styles.hoverWrapper}>
            <AdvancedSettingsButton
              className={styles.advancedSettingsButton}
              onClick={() => onSelectAdvancedSettings(reminder.id)}
            />
            <TinyDeleteButton className={styles.deleteButton} onClick={this.deleteReminder} />
          </div>
        }
      />
    );
  }
}

RemindersItem.propTypes = {
  onSelectReminder: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  account: PropTypes.instanceOf(Account).isRequired,
  reminder: PropTypes.instanceOf(Reminders).isRequired,
  isSelected: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onSelectAdvancedSettings: PropTypes.func.isRequired,
};

SmallIconCircle.propTypes = {
  icon: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateEntityRequest }, dispatch);

export default connect(null, mapDispatchToProps)(RemindersItem);
