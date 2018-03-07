
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ordinalSuffix, intervalToNumType, numTypeToInterval } from '../../../../../../server/util/time';
import {
  updateEntityRequest,
} from '../../../../../thunks/fetchEntities';
import {
  Icon,
  Grid,
  Row,
  Col,
  Toggle,
  Input,
  DropdownSelect,
} from '../../../../library';
import { convertPrimaryTypesToKey } from '../../../Shared/util/primaryTypes';
import IconCircle from '../../../Shared/IconCircle';
import TinyDeleteButton from '../../../Shared/TinyDeleteButton';
import TouchPointItem, { TouchPointLabel } from '../../../Shared/TouchPointItem';
import styles from './styles.scss';

const iconsMap = {
  sms: 'comment',
  phone: 'phone',
  email: 'envelope',
  email_sms: 'envelope_comment',
};

const wordMap = {
  sms: 'SMS',
  phone: 'Voice',
  email: 'Email',
  email_sms: 'Email & SMS',
};

const typeOptions = [
  { label: 'Hours', value: 'hours' },
  { label: 'Days', value: 'days' },
];

const primaryTypesOptions = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  // { label: 'Voice', value: 'phone' },
  { label: 'Email & SMS', value: 'email_sms' }
];

function SmallIconCircle(props) {
  const { selected, icon } = props;
  // delete props.selected;
  // delete props.icon;

  const wrapperClass = selected ?
    styles.smallReminderSelectWrapperCircleSelected :
    styles.smallReminderSelectWrapperCircle;

  return (
    <div className={wrapperClass}>
      {icon ? <Icon icon={icon} type="solid" /> : null}
    </div>
  );
}

function AdvancedSettingsButton(props) {
  return <Icon icon="cogs" type="solid" {...props} />;
}

class RemindersItem extends Component {
  constructor(props) {
    super(props);

    const { num } = intervalToNumType(props.reminder.interval);
    this.state = {
      number: num,
    };

    this.editReminder = this.editReminder.bind(this);
    this.deleteReminder = this.deleteReminder.bind(this);
    this.changePrimaryTypes = this.changePrimaryTypes.bind(this);
    this.onChangeNumberInput = this.onChangeNumberInput.bind(this);
    this.changeDaysHours = this.changeDaysHours.bind(this);
  }

  componentDidMount() {
    // Need function to abstract
    const { num } = intervalToNumType(this.props.reminder.interval);
    if (this.state.number === num) {
      return;
    }

    this.setState({
      number: num,
    });
  }

  componentWillUpdate(nextProps) {
    // Need function to abstract
    const oldNumType = intervalToNumType(this.props.reminder.interval);
    const newNumType = intervalToNumType(nextProps.reminder.interval);
    if (oldNumType.num === newNumType.num) {
      return;
    }

    this.setState({
      number: newNumType.num,
    });
  }

  editReminder(e) {
    const isActive = e.target.checked;
    const { reminder, account } = this.props;
    const word = isActive ? 'active' : 'inactive';

    const alert = {
      success: {
        title: 'Updated Reminder',
        body: `Set the reminder to ${word}`,
      },

      error: {
        title: 'Error Updating Reminder',
        body: `Failed to set the reminder to ${word}`,
      },
    };

    this.props.updateEntityRequest({
      url: `/api/accounts/${account.id}/reminders/${reminder.id}`,
      values: { isActive },
      alert,
    });
  }

  deleteReminder(e) {
    // So that it doesn't bubble up and try to select this reminder
    e.stopPropagation();
    e.preventDefault();
    const { reminder, account, isSelected, selectReminder } = this.props;
    const { num, type } = intervalToNumType(reminder.interval);
    const sure = confirm(`Are you sure you want to delete the ${num} ${type} reminder?`);
    if (!sure) {
      return;
    }

    if (isSelected) {
      selectReminder(null);
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
      values: { isDeleted: true },
      alert,
    });
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
    const { num, type } = intervalToNumType(reminder.interval);
    if (newType === type) {
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

    this.props.updateEntityRequest({
      url: `/api/accounts/${account.id}/reminders/${reminder.id}`,
      values: { interval: numTypeToInterval(num, newType) },
      alert,
    });
  }

  onChangeNumberInput(e) {
    const val = e.target.value;

    // \D = all non digits
    let cleanVal = val.replace(/\D/g, '');

    // If zero, default to 1
    if (parseInt(cleanVal) === 0) {
      cleanVal = 1;
    }

    return this.setState({ number: cleanVal || 1 });
  }

  render() {
    const {
      reminder,
      index,
      isSelected,
      onSelectReminder,
      onSelectAdvancedSettings,
      isSuperAdmin,
    } = this.props;

    const {
      interval,
      primaryTypes,
      isActive,
    } = reminder;

    const primaryTypesKey = convertPrimaryTypesToKey(primaryTypes);

    const icon = iconsMap[primaryTypesKey];
    const { type } = intervalToNumType(interval);
    const { number } = this.state;

    const dropdownSelectClass = isSelected ? styles.dropdownSelectSelected : styles.dropdownSelect;

    return (
      <TouchPointItem
        selected={isSelected}
        className={styles.reminderListItem}
        onClick={() => onSelectReminder(reminder.id)}
        toggleComponent={(
          <Toggle
            color="green"
            checked={isActive}
            onChange={this.editReminder}
          />
        )}

        labelComponent={(
          <TouchPointLabel title={`${ordinalSuffix(index + 1)} Reminder`} />
        )}

        mainComponent={(
          <div>
            <div className={styles.reminderIconContainer}>
              <IconCircle
                icon={icon}
                selected={isSelected}
              />
            </div>
            <div className={isSelected ? styles.secondaryLinesBoxSelected : styles.secondaryLinesBox}>
              <div className={styles.smallIconContainer}>
                <SmallIconCircle
                  icon="bell"
                  selected={isSelected}
                />
              </div>
              <div className={styles.dropdownsWrapper}>
                <div className={styles.topRow}>
                  <DropdownSelect
                    onChange={this.changePrimaryTypes}
                    className={dropdownSelectClass}
                    value={primaryTypesKey}
                    options={primaryTypesOptions}
                  />
                </div>
                <div className={styles.bottomRow}>
                  <Grid>
                    <Row>
                      <Col xs={3}>
                        {/* Using min, step and type=number did not work here properly so have to code around it */}
                        <Input
                          classStyles={dropdownSelectClass}
                          value={number}
                          onChange={this.onChangeNumberInput}
                          onBlur={(e) => this.changeNumber(e.target.value)}
                        />
                      </Col>
                      <Col xs={9} className={styles.rightDropdown}>
                        <DropdownSelect
                          onChange={this.changeDaysHours}
                          className={dropdownSelectClass}
                          value={type}
                          options={typeOptions}
                        />
                      </Col>
                    </Row>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        )}

        rightComponent={(
          <div className={styles.hoverWrapper}>
            {isSuperAdmin ?
              <AdvancedSettingsButton
                className={styles.advancedSettingsButton}
                onClick={() => onSelectAdvancedSettings(reminder.id)}
              />
            : null}
            <TinyDeleteButton
              className={styles.deleteButton}
              onClick={this.deleteReminder}
            />
          </div>
        )}
      />
    );
  }
}

RemindersItem.propTypes = {
  onSelectReminder: PropTypes.func.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(RemindersItem);
