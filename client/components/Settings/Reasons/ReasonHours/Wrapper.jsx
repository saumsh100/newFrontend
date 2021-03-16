
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { capitalize } from '../../../../util/isomorphic';
import Service from '../../../../entities/models/Service';
import UpdateReasonWeeklyHours from '../../../GraphQL/ReasonHours/updateReasonWeeklyHours';
import EditReasonWeeklyHours from './EditReasonWeeklyHours';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
import ReasonHours from '.';
import { generateTimeBreaks, parseDate, parseDateWithFormat } from '../../../library/util/datetime';

/**
 * Valid time format when handling with time values.
 *
 * @type {string}
 */
const allowedFormat = 'HH:mm:ss.SSS[Z]';

/**
 * Return a date time instance for a time value.
 *
 * @param time
 * @param timezone
 * @return DateTimeObj
 */
const timeToDateTimeObj = (time, timezone) => parseDateWithFormat(time, allowedFormat, timezone);

/**
 * Validate if startTime is before endTime.
 *
 * @param startTime
 * @param endTime
 * @param timezone
 * @return {boolean}
 */
const validate = ({ startTime, endTime }, timezone) =>
  timeToDateTimeObj(startTime, timezone).isAfter(timeToDateTimeObj(endTime, timezone));

/**
 * Using the provided data check if the day 'isClosed' (using the flag),
 * if it's 'During Set Times' (using the availabilities array)
 * or if it's All day (using the breaks array).
 *
 * @return {string}
 */
const getSelectedValue = (data) => {
  const isClosed = data.isClosed && 'isClosed';
  const hasAvailabilities = data.availabilities.length > 0 && 'availabilities';
  return isClosed || hasAvailabilities || 'breaks';
};

/**
 * With the provided startDate, adds the amount of minutes to the object instance,
 * and format it using the provided timeFormat.
 *
 * @param timezone
 * @param minutesBetween
 * @param startDate
 * @return {{startTime: *, endTime: *}}
 */
const genericTimeRange = (
  timezone,
  minutesBetween = 120,
  startDate = new Date(1970, 1, 0, 10, 0),
) => {
  const startTime = parseDate(startDate, timezone);
  return {
    startTime: startTime.format(allowedFormat),
    endTime: startTime.add(minutesBetween, 'minutes').format(allowedFormat),
  };
};

/**
 * Initial data structure for a ReasonWeeklyHours
 *
 * @type {{breaks: Array, isClosed: boolean, availabilities: Array, id: string}}
 */
const defaultData = {
  id: '',
  availabilities: [],
  breaks: [],
  isClosed: false,
};

class ReasonWeeklyHoursWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      initialData: defaultData,
      data: defaultData,
      weekDay: '',
      active: '',
      timeOpts: generateTimeBreaks({
        timezone: this.props.timezone,
      }),
    };

    this.onEditClick = this.onEditClick.bind(this);
    this.addTimeItem = this.addTimeItem.bind(this);
    this.removeBreak = this.removeBreak.bind(this);
    this.removeAvailability = this.removeAvailability.bind(this);
    this.updateAvailabilities = this.updateAvailabilities.bind(this);
    this.updateBreakTime = this.updateBreakTime.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleModalVisibility = this.handleModalVisibility.bind(this);
    this.handleUpdateReason = this.handleUpdateReason.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  /**
   * When clicking to edit a weekDay, set the initialData (based on the provided data),
   * the weekDay and the active dropdown item. After that set the modal as visible.
   *
   * @param data
   * @param weekDay
   */
  onEditClick(data, weekDay) {
    this.setState(
      {
        data,
        initialData: data,
        weekDay,
        active: getSelectedValue(data),
      },
      () => {
        this.handleModalVisibility();
      },
    );
  }

  /**
   * Change the visibility of the Modal.
   *
   * @param isModalVisible {Boolean}
   */
  handleModalVisibility(isModalVisible = true) {
    this.setState({ isModalVisible });
  }

  /**
   * Calls the update daily reason graphQL function using the provided data,
   * after the update is done it hides the modal.
   *
   * @param callback
   * @return {Promise<void>}
   */
  async handleUpdateReason(callback) {
    try {
      const data = this.state.data[this.state.active];
      const variables = {
        ...defaultData,
        id: this.state.initialData.id,
        [this.state.active]: Array.isArray(data)
          ? data.map(({ startTime, endTime }) => ({
            startTime,
            endTime,
          }))
          : data,
      };

      await callback({ variables });
      this.handleModalVisibility(false);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Updates the dropdown value based on the provided value.
   *
   * @param value
   */
  handleDropdownChange(value) {
    this.setState(prevState => ({
      active: value,
      data: {
        ...prevState.initialData,
        isClosed: value === 'isClosed',
      },
    }));
  }

  /**
   * Set the state to its initial value and hide the modal.
   */
  hideModal() {
    this.setState(
      prevState => ({ data: prevState.initialData }),
      () => this.handleModalVisibility(false),
    );
  }

  /**
   * Check if there's any error with the actual data.
   *
   * @return {boolean}
   */
  hasAnyError() {
    if (this.state.active !== 'breaks') {
      return false;
    }
    return (
      this.state.data.breaks.map(b => validate(b, this.props.timezone)).filter(d => d).length > 0
    );
  }

  /**
   * Generic add function, it adds either a break or an availability item to its array.
   *
   * @param key
   */
  addTimeItem(key) {
    const data = key === 'breaks'
      ? genericTimeRange(this.props.timezone)
      : genericTimeRange(this.props.timezone, this.props.reason.get('duration'));
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        [key]: [...prevState.data[key], data],
      },
    }));
  }

  /**
   * Update the break item based on the index, with the provided values.
   * @param index
   * @param values
   */
  updateBreakTime(index, values) {
    const [key] = Object.keys(values);
    this.updateTimeItem('breaks', index, {
      [key]: values[key],
    });
  }

  /**
   * Update the availabiliy item based on the index, with the provided values.
   * @param index
   * @param value
   */
  updateAvailabilities(index, value) {
    const startTime = timeToDateTimeObj(value.startTime, this.props.timezone);
    this.updateTimeItem('availabilities', index, {
      startTime: startTime.format(allowedFormat),
      endTime: startTime.add(this.props.reason.get('duration'), 'minutes').format(allowedFormat),
    });
  }

  /**
   * Generic update function, it adds either a break or an availability item to its array.
   *
   * @param key
   * @param index
   * @param data
   */
  updateTimeItem(key, index, data) {
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        [key]: prevState.data[key].map((item, i) => ({
          ...item,
          ...(i === index ? data : null),
        })),
      },
    }));
  }

  /**
   * Based on the key, remove the provided index from the state.
   *
   * @param index
   * @param key
   */
  removeTimeItem(index, key) {
    const dataToUpdate = [...this.state.data[key]];
    dataToUpdate.splice(index, 1);
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        [key]: dataToUpdate,
      },
    }));
  }

  /**
   * Remove the break item based on the index.
   *
   * @param index
   */
  removeBreak(index) {
    this.removeTimeItem(index, 'breaks');
  }

  /**
   * Remove an availability item based on the index.
   *
   * @param index
   */
  removeAvailability(index) {
    this.removeTimeItem(index, 'availabilities');
  }

  render() {
    const { timezone } = this.props;
    const removeOffSet = time => time.replace('+00', '.000Z');
    const breaksData = {
      ...this.state.data,
      availabilities: this.state.data.availabilities.map(({ startTime, endTime, ...rest }) => ({
        ...rest,
        startTime: removeOffSet(startTime),
        endTime: removeOffSet(endTime),
      })),
      breaks: this.state.data.breaks.map(({ startTime, endTime, ...rest }) => ({
        ...rest,
        startTime: timeToDateTimeObj(removeOffSet(startTime), timezone),
        endTime: timeToDateTimeObj(removeOffSet(endTime), timezone),
      })),
    };
    return (
      <div>
        <ReasonHours
          reason={this.props.reason}
          onEditClick={this.onEditClick}
          allowedTimeFormat={allowedFormat}
        />
        <UpdateReasonWeeklyHours>
          {commit => (
            <EditReasonWeeklyHours
              data={breaksData}
              active={this.state.active}
              timeToIsoString={time => timeToDateTimeObj(time, timezone).toISOString()}
              timeOptions={this.state.timeOpts}
              handleOverrideDropdownChange={this.handleDropdownChange}
              timezone={timezone}
              validate={dateRange => validate(dateRange, timezone)}
              addTimeItem={this.addTimeItem}
              removeAvailability={this.removeAvailability}
              removeBreak={this.removeBreak}
              updateAvailabilities={this.updateAvailabilities}
              updateBreakTime={this.updateBreakTime}
              footer={
                <ModalFooter
                  hideModal={this.hideModal}
                  disableUpdate={this.hasAnyError()}
                  updateReason={() => this.handleUpdateReason(commit)}
                />
              }
              header={
                <ModalHeader
                  title={`${this.props.reason.get('name')} - ${capitalize(this.state.weekDay)}`}
                  label={`Donna’s availability settings for ${capitalize(this.state.weekDay)}`}
                />
              }
              isModalVisible={this.state.isModalVisible}
              hideModal={this.hideModal}
            />
          )}
        </UpdateReasonWeeklyHours>
      </div>
    );
  }
}

ReasonWeeklyHoursWrapper.propTypes = {
  reason: PropTypes.instanceOf(Service).isRequired,
  timezone: PropTypes.string.isRequired,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps)(ReasonWeeklyHoursWrapper);
