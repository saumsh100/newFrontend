
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import pickBy from 'lodash/pickBy';
import pick from 'lodash/pick';
import {
  dateFormatter,
  getEndOfTheMonth,
  getStartOfTheMonth,
  setDateToTimezone,
} from '@carecru/isomorphic';
import ScheduleCalendar from '../../../library/ScheduleCalendar';
import {
  createDailyHours,
  deleteDailyHours,
  getFinalDailyHours,
  updateFinalDailyHours,
} from './thunks';
import { showAlertTimeout } from '../../../../thunks/alerts';
import calendarDay from '../../../library/ScheduleCalendar/calendarDay';

import defaultDays from './defaultWeeklyTemplate';

class OfficeHoursCalendar extends Component {
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
      const { years, months, date } = setDateToTimezone(storedDate, this.props.timezone).toObject();
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
      accountId: this.props.accountId,
      startDate: getStartOfTheMonth(month),
      endDate: getEndOfTheMonth(month),
    }).then(({ data }) => {
      const { weeklySchedule } = data;
      const defaultDaysKeys = Object.keys(defaultDays);
      defaultDaysKeys.forEach((key) => {
        // provide default values to avoid crash
        if (!weeklySchedule[key]) {
          weeklySchedule[key] = defaultDays[key];
        }
      });

      return this.setState({ baseSchedule: { ...data,
        weeklySchedule } }, () =>
        setTimeout(() => this.setState({ isLoading: false }), 1000));
    });
  }

  getFeaturedDay(date = this.state.selectedDay) {
    const weekDay = dateFormatter(date, this.props.timezone, 'dddd').toLowerCase();
    return {
      [weekDay]: {
        ...this.state.baseSchedule.schedule[date.toISOString().split('T')[0]],
        isFeatured: true,
      },
    };
  }

  /**
   * Checks if the context is override, meaning that if there is a selected date
   * check if it "isDailySchedule", otherwise check if the weeklySchedule "isCustomSchedule"
   *
   * @return {boolean}
   */
  isOverride() {
    const { selectedDay } = this.state;
    if (!selectedDay) return false;

    return this.state.selectedDailySchedule.isDailySchedule || false;
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
   * It either select a day or unselect the same day.
   *
   * @param date {Date}
   * @param callback
   */
  handleDayClick(date, callback) {
    const selectedDay =
      this.state.selectedDay && this.state.selectedDay.getTime() === date.getTime() ? null : date;
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
        handleEditSchedule(dateFormatter(day, this.props.timezone, 'dddd').toLowerCase()));
  }

  async handleCreateCustomSchedule({ date } = {}) {
    try {
      await createDailyHours(date.toISOString().split('T')[0]);
      await this.getSchedule();
      this.setState({
        selectedDailySchedule: this.state.selectedDay
          ? Object.values(this.getFeaturedDay(this.state.selectedDay))[0]
          : null,
      });
      this.props.showAlertTimeout({
        alert: {
          body: `Created holiday hours for the practice on ${dateFormatter(
            date,
            this.props.timezone,
            'dddd, MMMM Do',
          )}`,
        },
        type: 'success',
      });
    } catch (e) {
      console.error(e);
    }
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
            ? `Updated holiday hours for the practice on ${dateFormatter(
              date,
              this.props.timezone,
              'dddd, MMMM Do',
            )}`
            : 'Updated default schedule for the practice';
        this.props.showAlertTimeout({
          alert: { body },
          type: 'success',
        });
      })
      .then(callback);
  }

  async handleRemoveOverrideHours({ scheduleId, date } = {}) {
    try {
      await deleteDailyHours(scheduleId);
      await this.getSchedule();
      this.setState({
        selectedDailySchedule: this.state.selectedDay
          ? Object.values(this.getFeaturedDay(this.state.selectedDay))[0]
          : null,
      });
      this.props.showAlertTimeout({
        alert: {
          body: `Deleted holiday hours for the practice on ${dateFormatter(
            date,
            this.props.timezone,
            'dddd, MMMM Do',
          )}`,
        },
        type: 'success',
      });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { timezone } = this.props;

    return (
      <div>
        <ScheduleCalendar
          baseSchedule={this.state.baseSchedule}
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
          practitioner={null}
          renderDay={(day, handleEditSchedule) =>
            calendarDay(
              day,
              this.handleDoubleClick(day, handleEditSchedule),
              Object.values(this.getFeaturedDay(day))[0],
              timezone,
            )
          }
          selectedDay={this.state.selectedDay}
          timezone={timezone}
          weeklySchedule={this.scheduleMap()}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ auth, entities }) => {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  return {
    timezone: activeAccount.get('timezone'),
    accountId: auth.get('accountId'),
    weeklyScheduleId: activeAccount.get('weeklyScheduleId'),
  };
};

const mapActionsToProps = dispatch => bindActionCreators({ showAlertTimeout }, dispatch);

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(OfficeHoursCalendar);

OfficeHoursCalendar.propTypes = {
  accountId: PropTypes.string.isRequired,
  showAlertTimeout: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
};
