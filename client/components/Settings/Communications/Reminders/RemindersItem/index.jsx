
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { d2s, h2s, ordinalSuffix, secondsToNumType, numTypeToSeconds } from '../../../../../../server/util/time';
import {
  updateEntityRequest,
  deleteEntityRequest,
  fetchEntities,
} from '../../../../../thunks/fetchEntities';
import {
  Button,
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
  email_sms: 'user',
};

const wordMap = {
  sms: 'SMS',
  phone: 'Voice',
  email: 'Email',
  email_sms: 'Email & SMS',
};

function SmallIconCircle(props) {
  const { selected, icon } = props;
  // delete props.selected;
  // delete props.icon;

  const wrapperClass = selected ?
    styles.smallReminderSelectWrapperCircleSelected :
    styles.smallReminderSelectWrapperCircle;

  return (
    <div className={wrapperClass}>
      {icon ? <Icon icon={icon} /> : null}
    </div>
  );
}

class RemindersItem extends Component {
  constructor(props) {
    super(props);

    const { num } = secondsToNumType(props.reminder.lengthSeconds);
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
    const { num } = secondsToNumType(this.props.reminder.lengthSeconds);
    if (this.state.number === num) {
      return;
    }

    this.setState({
      number: num,
    });
  }

  componentWillUpdate(nextProps) {
    // Need function to abstract
    const oldNumType = secondsToNumType(this.props.reminder.lengthSeconds);
    const newNumType = secondsToNumType(nextProps.reminder.lengthSeconds);
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
    const { reminder, account, selected, selectReminder } = this.props;
    const { num, type } = secondsToNumType(reminder.lengthSeconds);
    const sure = confirm(`Are you sure you want to delete the ${num} ${type} reminder?`);
    if (!sure) {
      return;
    }

    if (selected) {
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
    // Setting lengthSeconds to
    const { account, reminder } = this.props;
    const { num, type } = secondsToNumType(reminder.lengthSeconds);
    const lengthSeconds = numTypeToSeconds(number, type);

    if (lengthSeconds === reminder.lengthSeconds) {
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
      values: { lengthSeconds },
      alert,
    });
  }

  changeDaysHours(newType) {
    // Setting lengthSeconds to
    const { account, reminder } = this.props;
    const { num, type } = secondsToNumType(reminder.lengthSeconds);
    const lengthSeconds = numTypeToSeconds(num, newType);

    if (lengthSeconds === reminder.lengthSeconds) {
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
      values: { lengthSeconds },
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
      selected,
      selectReminder,
    } = this.props;

    // TODO: reminder.lengthSeconds needs to be converted to days/hours

    const {
      lengthSeconds,
      primaryTypes,
      isActive,
    } = reminder;

    const primaryTypesKey = convertPrimaryTypesToKey(primaryTypes);

    const icon = iconsMap[primaryTypesKey];
    const { type } = secondsToNumType(lengthSeconds);
    const { number } = this.state;

    const dropdownSelectClass = selected ? styles.dropdownSelectSelected : styles.dropdownSelect;

    return (
      <TouchPointItem
        selected={selected}
        className={styles.reminderListItem}
        onClick={() => selectReminder(reminder.id)}
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
                selected={selected}
              />
            </div>
            <div className={selected ? styles.secondaryLinesBoxSelected : styles.secondaryLinesBox}>
              <div className={styles.smallIconContainer}>
                <SmallIconCircle
                  icon="bell"
                  selected={selected}
                />
              </div>
              <div className={styles.dropdownsWrapper}>
                <div className={styles.topRow}>
                  <DropdownSelect
                    onChange={this.changePrimaryTypes}
                    className={dropdownSelectClass}
                    value={primaryTypesKey}
                    options={[
                      { label: 'Email', value: 'email' },
                      { label: 'SMS', value: 'sms' },
                      // { label: 'Voice', value: 'phone' },
                      { label: 'Email & SMS', value: 'email_sms' }
                    ]}
                  />
                </div>
                <div className={styles.bottomRow}>
                  <Grid>
                    <Row>
                      <Col xs={3}>
                        <Input
                          classStyles={dropdownSelectClass}
                          value={number}
                          //type="number"
                          //min="1"
                          //step="any"
                          onChange={this.onChangeNumberInput}
                          onBlur={(e) => this.changeNumber(e.target.value)}
                        />
                      </Col>
                      <Col xs={9} className={styles.rightDropdown}>
                        <DropdownSelect
                          onChange={this.changeDaysHours}
                          className={dropdownSelectClass}
                          value={type}
                          options={[
                            { label: 'Hours Before', value: 'hours' },
                            { label: 'Days Before', value: 'days' },
                          ]}
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
          <div className={styles.deleteButtonWrapper} onClick={this.deleteReminder}>
            <TinyDeleteButton />
          </div>
        )}
      />
    );
  }
}

RemindersItem.propTypes = {
  primaryType: PropTypes.string,
  length: PropTypes.number,
  edit: PropTypes.func,
  deleteFunc: PropTypes.func,
  selectReminder: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(RemindersItem);
