
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { d2s, h2s } from '../../../../../../server/util/time';
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
import styles from '../styles.scss';

const iconsMap = {
  sms: 'comment',
  phone: 'phone',
  email: 'envelope',
};

const wordMap = {
  sms: 'SMS',
  phone: 'Voice',
  email: 'Email',
};

function ordinalSuffix(i) {
  const j = i % 10;
  const k = i % 100;

  if (j == 1 && k != 11) {
    return i + "st";
  }

  if (j == 2 && k != 12) {
    return i + "nd";
  }

  if (j == 3 && k != 13) {
    return i + "rd";
  }

  return i + "th";
}

function secondsToNumType(seconds) {
  const daySeconds = d2s(1);
  const hourSeconds = h2s(1);
  const numDays = seconds / daySeconds;
  const numHours = seconds / hourSeconds;
  const isDay = seconds % daySeconds === 0 && numDays > 2;
  const type = isDay ? 'days' : 'hours';
  const num = isDay ? parseInt(numDays) : parseInt(numHours);
  return { type, num };
}

function numTypeToSeconds(num, type) {
  if (type !== 'hours' && type !== 'days') {
    throw new Error('not a valid type to convert to seconds');
  }

  const daySeconds = d2s(1);
  const hourSeconds = h2s(1);
  const secondsMultiplier = type === 'hours' ? hourSeconds : daySeconds;
  return num * secondsMultiplier;
}

function IconCircle(props) {
  const { selected, icon } = props;
  // delete props.selected;
  // delete props.icon;

  const wrapperClass = selected ?
    styles.reminderSelectWrapperCircleSelected :
    styles.reminderSelectWrapperCircle;

  return (
    <div className={wrapperClass}>
      <div className={styles.reminderWrapperCircle}>
        <div className={styles.reminderIconCircle}>
          {icon ? <Icon icon={icon} /> : null}
        </div>
      </div>
    </div>
  );
}

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
    this.changePrimaryType = this.changePrimaryType.bind(this);
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

  changePrimaryType(value) {
    const { reminder, account } = this.props;
    const word = wordMap[value];

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
      values: { primaryType: value },
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
      onSelect,
    } = this.props;

    // TODO: reminder.lengthSeconds needs to be converted to days/hours

    const {
      lengthSeconds,
      primaryType,
      isActive,
    } = reminder;

    const icon = iconsMap[primaryType];
    const { type } = secondsToNumType(lengthSeconds);
    const { number } = this.state;

    const dropdownSelectClass = selected ? styles.dropdownSelectSelected : styles.dropdownSelect;

    return (
      <div
        className={styles.listItem}
        onClick={onSelect}
      >
        <Grid>
          <Row>
            <Col xs={1} className={styles.toggleCol}>
              <Toggle
                color="green"
                checked={isActive}
                onChange={this.editReminder}
              />
            </Col>
            <Col xs={4} className={styles.labelCol}>
              <div className={styles.reminderLabel}>
                {`${ordinalSuffix(index + 1)} Reminder`}
              </div>
            </Col>
            <Col xs={7}>
              <div className={selected ? styles.linesBoxSelected : styles.linesBox}>
                <IconCircle
                  icon={icon}
                  selected={selected}
                />
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
                        onChange={this.changePrimaryType}
                        className={dropdownSelectClass}
                        value={primaryType}
                        options={[
                          { label: 'Email', value: 'email' },
                          { label: 'SMS', value: 'sms' },
                          { label: 'Voice', value: 'phone' },
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
                                { label: 'Hours Before Appt', value: 'hours' },
                                { label: 'Days Before Appt', value: 'days' },
                              ]}
                            />
                          </Col>
                        </Row>
                      </Grid>
                    </div>
                  </div>
                </div>
                <div className={styles.downIconWrapper}>
                  <Icon icon="caret-down" size={2} />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

RemindersItem.propTypes = {
  primaryType: PropTypes.string,
  length: PropTypes.number,
  edit: PropTypes.func,
  deleteFunc: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(RemindersItem);
