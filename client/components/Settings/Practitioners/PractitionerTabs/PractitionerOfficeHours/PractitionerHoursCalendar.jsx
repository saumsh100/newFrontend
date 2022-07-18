import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showAlertTimeout } from '../../../../../thunks/alerts';
import { getEndOfTheMonth, getStartOfTheMonth } from '../../../../library/util/datetime/helpers';
import ScheduleCalendar from '../../../../library/ScheduleCalendar';
import { practitionerShape } from '../../../../library/PropTypeShapes';
import {
  createDailyHours,
  createPractitionerWeeklyHours,
  deleteDailyHours,
  deletePractitionerWeeklyHours,
  getFinalDailyHours,
  updateFinalDailyHours,
} from './thunks';
import { getFormattedDate, parseDate } from '../../../../library';
import chairShape from '../../../../library/PropTypeShapes/chairShape';
import calendarDay from '../../../../library/ScheduleCalendar/calendarDay';

class PractitionerHoursCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDay: null,
      baseSchedule: {
        schedule: {},
        isCustomSchedule: false,
        dailySchedule: [],
        weeklySchedule: {},
      },
      selectedDailySchedule: null,
      isLoading: true,
      month: new Date(),
    };

    this.getSchedule = this.getSchedule.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleUpdateSchedule = this.handleUpdateSchedule.bind(this);
    this.handleCreateCustomSchedule = this.handleCreateCustomSchedule.bind(this);
    this.handleRemoveOverrideHours = this.handleRemoveOverrideHours.bind(this);
    this.onChangeMonth = this.onChangeMonth.bind(this);
    this.scheduleMap = this.scheduleMap.bind(this);
    this.getFeaturedDay = this.getFeaturedDay.bind(this);
  }

  /**
   * Fetch the initial schedule for this month.
   */
  componentDidMount() {
    this.getSchedule();
  }

  /**
   * It either select a day or unselect the same day.
   *
   * @param date {Date}
   * @param callback
   */
  handleDayClick(date, callback) {
    const { selectedDay: selectDayState } = this.state;
    const selectedDay = selectDayState && selectDayState.getTime() === date.getTime() ? null : date;
    this.setState(
      {
        selectedDay,
        selectedDailySchedule: selectedDay
          ? Object.values(this.getFeaturedDay(selectedDay))[0]
          : null,
      },
      callback,
    );
  }

  /**
   * Event that handles the doubleClick on a calendar Day;
   * @param day
   * @param handleEditSchedule
   * @return {function(): void}
   */
  handleDoubleClick(day, handleEditSchedule) {
    return () =>
      this.handleDayClick(day, () =>
        handleEditSchedule(getFormattedDate(day, 'dddd', this.props.timezone).toLowerCase()),);
  }

  /**
   * Update a dailySchedule, if isClosed is true, set the startTime and endTime to the same value.
   *
   * @param isClosed
   * @param id
   * @param date
   * @param isDailySchedule
   * @param schedule
   * @param callback {function}
   * @returns {Promise<any | never>}
   */
  handleUpdateSchedule({ id, date, isDailySchedule, ...schedule }, callback) {
    const baseBody = pick(schedule, ['startTime', 'endTime', 'breaks', 'chairIds']);
    return updateFinalDailyHours(id, {
      ...baseBody,
      endTime: baseBody.endTime,
      startTime: baseBody.startTime,
      breaks: baseBody.breaks,
    })
      .then(() => {
        this.getSchedule(this.state.month);
        const body =
          date && isDailySchedule
            ? `Updated holiday hours for ${this.props.practitioner.getPrettyName()} on ${getFormattedDate(
                date,
                'dddd, MMMM Do',
                this.props.timezone,
              )}`
            : `Updated default schedule for ${this.props.practitioner.getPrettyName()}`;
        this.props.showAlertTimeout({
          alert: { body },
          type: 'success',
        });
      })
      .then(callback);
  }

  /**
   * This function handles the creation or deletion of schedule,
   * being either daily or weekly schedules.
   *
   * If date is null, the logic represents a weekly logic, otherwise is a daily logic.
   * Assuming the structure described above we have the id for the (weekly/daily)Schedule.
   *
   * The checked param represents the action that was take.
   * If it is true, means that the user clicked to add an override
   * otherwise the intention is to remove an existing one.
   *
   * @param schedule {Object}
   * @param date {Date|null}
   */
  async handleCreateCustomSchedule({ date = null } = {}) {
    try {
      date
        ? await createDailyHours(
            this.props.practitioner.get('id'),
            date.toISOString().split('T')[0],
          )
        : await createPractitionerWeeklyHours(this.props.practitioner);
      this.getSchedule().then(() => {
        this.setState((prevState) => ({
          selectedDailySchedule: prevState.selectedDay
            ? Object.values(this.getFeaturedDay(prevState.selectedDay))[0]
            : null,
        }));
        const body = date
          ? `Created holiday hours for ${this.props.practitioner.getPrettyName()} on ${getFormattedDate(
              date,
              'dddd, MMMM Do',
              this.props.timezone,
            )}`
          : `Created default schedule for ${this.props.practitioner.getPrettyName()}`;

        this.props.showAlertTimeout({
          alert: { body },
          type: 'success',
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  async handleRemoveOverrideHours({ date = null, scheduleId } = {}) {
    try {
      date
        ? await deleteDailyHours(scheduleId)
        : await deletePractitionerWeeklyHours(this.props.practitioner);
      this.getSchedule().then(() => {
        this.setState((prevState) => ({
          selectedDailySchedule: prevState.selectedDay
            ? Object.values(this.getFeaturedDay(prevState.selectedDay))[0]
            : null,
        }));
        const body = date
          ? `Deleted holiday hours for ${this.props.practitioner.getPrettyName()} on ${getFormattedDate(
              date,
              'dddd, MMMM Do',
              this.props.timezone,
            )}`
          : `Deleted default schedule for ${this.props.practitioner.getPrettyName()}`;
        this.props.showAlertTimeout({
          alert: { body },
          type: 'success',
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  onChangeMonth(month) {
    this.setState(
      {
        month,
        selectedDay: null,
        isLoading: true,
        selectedDailySchedule: null,
      },
      () => this.getSchedule(month),
    );
  }

  getModifier(modifier) {
    return Object.keys(pickBy(this.state.baseSchedule.schedule, modifier)).map((storedDate) => {
      const { years, months, date } = parseDate(storedDate, this.props.timezone).toObject();
      return new Date(years, months, date);
    });
  }

  /**
   * Fetch the schedule to the provided month.
   *
   * @returns {*}
   */
  getSchedule(month = this.state.month) {
    return getFinalDailyHours({
      practitionerId: this.props.practitioner.get('id'),
      startDate: getStartOfTheMonth(month),
      endDate: getEndOfTheMonth(month),
    }).then(({ data }) =>
      this.setState({ baseSchedule: data }, () =>
        setTimeout(() => this.setState({ isLoading: false }), 1000),),);
  }

  getFeaturedDay(date = this.state.selectedDay) {
    const weekDay = getFormattedDate(date, 'dddd', this.props.timezone).toLowerCase();
    return {
      [weekDay]: {
        ...this.state.baseSchedule.schedule[date.toISOString().split('T')[0]],
        isFeatured: true,
      },
    };
  }

  /**
   * Normalize the schedule that will be provided to ScheduleDrawer component
   *
   */
  scheduleMap() {
    const normalizedSchedule =
      this.state.selectedDay && this.state.selectedDailySchedule.isDailySchedule
        ? this.getFeaturedDay()
        : {
            ...this.state.baseSchedule.weeklySchedule,
            ...(this.state.selectedDay ? this.getFeaturedDay() : null),
          };
    const parsedWeeklySchedule = pick(normalizedSchedule, [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ]);
    return Object.entries(parsedWeeklySchedule).reduce(
      (acc, [day, sc]) => ({
        ...acc,
        [day]: {
          breaks: sc.breaks || [],
          chairIds: sc.chairIds || [],
          endTime: sc.endTime || null,
          isClosed: sc.isClosed || false,
          isFeatured: sc.isFeatured || false,
          isDailySchedule: sc.isDailySchedule || false,
          startTime: sc.startTime || null,
        },
      }),
      {},
    );
  }

  /**
   * Checks if the context is override, meaning that if there is a selected date
   * check if it "isDailySchedule", otherwise check if the weeklySchedule "isCustomSchedule"
   *
   * @return {boolean}
   */
  isOverride() {
    const { selectedDay } = this.state;
    if (!selectedDay) return this.state.baseSchedule.isCustomSchedule || false;

    return this.state.selectedDailySchedule.isDailySchedule || false;
  }

  /**
   * Define if we should display the weeklyHours on the sidebar.
   *
   * If a day is not selected display the existent weeklyHours
   * (it won't display anything for practitioners without custom weeklyHours)
   *
   * Also display the WeeklyHours if the selected day "isDailySchedule"
   * or if the practitioner has a custom weeklyHours.
   *
   * @return {boolean}
   */
  shouldDisplayWeeklyHours() {
    if (!this.state.selectedDay) return true;

    return (
      this.state.selectedDailySchedule.isDailySchedule || this.state.baseSchedule.isCustomSchedule
    );
  }

  clearOverride = () => {
    this.setState({ selectedDailySchedule: { isDailySchedule: false }, selectedDay: null });
  };

  render() {
    const { timezone, chairs } = this.props;

    return (
      <div>
        <ScheduleCalendar
          editChairs
          baseSchedule={this.state.baseSchedule}
          chairs={chairs}
          closedDays={this.getModifier('isClosed')}
          dailyScheduleDays={this.getModifier('isDailySchedule')}
          handleCreateCustomSchedule={this.handleCreateCustomSchedule}
          handleDayClick={this.handleDayClick}
          handleRemoveOverrideHours={this.handleRemoveOverrideHours}
          handleUpdateSchedule={this.handleUpdateSchedule}
          isLoading={this.state.isLoading}
          isOverride={this.isOverride()}
          month={this.state.month}
          onChangeMonth={this.onChangeMonth}
          renderDay={(day, handleEditSchedule) =>
            calendarDay(
              day,
              this.handleDoubleClick(day, handleEditSchedule),
              Object.values(this.getFeaturedDay(day))[0],
              timezone,
            )
          }
          selectedDay={this.state.selectedDay}
          shouldDisplayWeeklyHours={this.shouldDisplayWeeklyHours()}
          timezone={timezone}
          weeklySchedule={this.scheduleMap()}
          clearOverride={this.clearOverride}
        />
      </div>
    );
  }
}

PractitionerHoursCalendar.defaultProps = { chairs: {} };
PractitionerHoursCalendar.propTypes = {
  timezone: PropTypes.string.isRequired,
  practitioner: PropTypes.shape(practitionerShape).isRequired,
  chairs: PropTypes.shape(chairShape),
  showAlertTimeout: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth, entities }) => {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  return { timezone: activeAccount.get('timezone') };
};

const mapActionsToProps = (dispatch) => bindActionCreators({ showAlertTimeout }, dispatch);

export default connect(mapStateToProps, mapActionsToProps)(PractitionerHoursCalendar);
