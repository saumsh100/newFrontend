
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
  timeWithZone,
} from '@carecru/isomorphic';
import ScheduleCalendar from '../../../library/ScheduleCalendar';
import {
  createDailyHours,
  deleteDailyHours,
  getFinalDailyHours,
  updateFinalDailyHours,
} from './thunks';
import { showAlertTimeout } from '../../../../thunks/alerts';
import styles from '../../../library/ScheduleCalendar/day.scss';

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
    }).then(({ data }) =>
      this.setState({ baseSchedule: data }, () =>
        setTimeout(() => this.setState({ isLoading: false }), 1000)));
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
   */
  handleDayClick(date) {
    const selectedDay =
      this.state.selectedDay && this.state.selectedDay.getTime() === date.getTime() ? null : date;
    this.setState({
      selectedDay,
      selectedDailySchedule: selectedDay
        ? Object.values(this.getFeaturedDay(selectedDay))[0]
        : null,
    });
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
   * @param schedule
   * @param callback {function}
   * @returns {Promise<any | never>}
   */
  handleUpdateSchedule({ isClosed, id, date, ...schedule }, callback) {
    const baseBody = pick(schedule, ['startTime', 'endTime', 'breaks', 'chairIds']);
    const baseEndTime = setDateToTimezone(baseBody.endTime, this.props.timezone).toObject();
    const baseStartTime = setDateToTimezone(baseBody.startTime, this.props.timezone).toObject();
    return updateFinalDailyHours(id, {
      ...baseBody,
      endTime: isClosed
        ? new Date(1970, 1, 0).toISOString()
        : timeWithZone(baseEndTime.hours, baseEndTime.minutes, this.props.timezone).toISOString(),
      startTime: isClosed
        ? new Date(1970, 1, 0).toISOString()
        : timeWithZone(
          baseStartTime.hours,
          baseStartTime.minutes,
          this.props.timezone,
        ).toISOString(),
    })
      .then(() => {
        this.getSchedule(this.state.month);
        const body = date
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

    const renderDay = (day) => {
      const [{ isClosed, startTime, endTime }] = Object.values(this.getFeaturedDay(day));
      return (
        <div className={styles.cell}>
          <div className={styles.single}>{day.getDate()}</div>
          {!!startTime && !!endTime && (
            <div className={styles.hours}>
              {isClosed ? (
                <span>CLOSED</span>
              ) : (
                <span>
                  {dateFormatter(startTime, timezone, 'LT')}
                  <br />
                  {dateFormatter(endTime, timezone, 'LT')}
                </span>
              )}
            </div>
          )}
        </div>
      );
    };
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
          renderDay={renderDay}
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
