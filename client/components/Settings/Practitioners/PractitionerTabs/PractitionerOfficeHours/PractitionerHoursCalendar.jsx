
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  dateFormatter,
  getEndOfTheMonth,
  getStartOfTheMonth,
  setDateToTimezone,
  timeWithZone,
} from '@carecru/isomorphic';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showAlertTimeout } from '../../../../../thunks/alerts';
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
import { Toggle } from '../../../../library';
import chairShape from '../../../../library/PropTypeShapes/chairShape';
import styles from '../../../../library/ScheduleCalendar/day.scss';
import EnabledFeature from '../../../../library/EnabledFeature';

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
      practitionerId: this.props.practitioner.get('id'),
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

  /**
   * Update a dailySchedule, if isClosed is true, set the startTime and endTime to the same value.
   *
   * @param isClosed
   * @param id
   * @param date
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
          ? `Updated holiday hours for ${this.props.practitioner.getPrettyName()} on ${dateFormatter(
            date,
            this.props.timezone,
            'dddd, MMMM Do',
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
        this.setState({
          selectedDailySchedule: this.state.selectedDay
            ? Object.values(this.getFeaturedDay(this.state.selectedDay))[0]
            : null,
        });
        const body = date
          ? `Created holiday hours for ${this.props.practitioner.getPrettyName()} on ${dateFormatter(
            date,
            this.props.timezone,
            'dddd, MMMM Do',
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
        this.setState({
          selectedDailySchedule: this.state.selectedDay
            ? Object.values(this.getFeaturedDay(this.state.selectedDay))[0]
            : null,
        });
        const body = date
          ? `Deleted holiday hours for ${this.props.practitioner.getPrettyName()} on ${dateFormatter(
            date,
            this.props.timezone,
            'dddd, MMMM Do',
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

  render() {
    const { timezone, chairs } = this.props;

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
        <EnabledFeature
          predicate={() => true}
          render={({ flags }) => {
            const isAllow = this.state.baseSchedule.isCustomSchedule
              ? flags.get('connector-delete-practitioner-weeklySchedule')
              : flags.get('connector-create-practitioner-weeklySchedule');
            return (
              <div className={styles.customScheduleWrapper}>
                <span>Set Custom</span>
                <Toggle
                  disabled={!isAllow}
                  checked={this.state.baseSchedule.isCustomSchedule}
                  onChange={(e) => {
                    if (e.target.checked) {
                      return this.handleCreateCustomSchedule();
                    }
                    return this.handleRemoveOverrideHours();
                  }}
                />
              </div>
            );
          }}
        />
        <ScheduleCalendar
          baseSchedule={this.state.baseSchedule}
          chairs={chairs}
          closedDays={this.getModifier('isClosed')}
          dailyScheduleDays={this.getModifier('isDailySchedule')}
          editChairs
          handleCreateCustomSchedule={this.handleCreateCustomSchedule}
          handleDayClick={this.handleDayClick}
          handleRemoveOverrideHours={this.handleRemoveOverrideHours}
          handleUpdateSchedule={this.handleUpdateSchedule}
          isLoading={this.state.isLoading}
          isOverride={this.isOverride()}
          month={this.state.month}
          onChangeMonth={this.onChangeMonth}
          renderDay={renderDay}
          selectedDay={this.state.selectedDay}
          shouldDisplayWeeklyHours={this.shouldDisplayWeeklyHours()}
          timezone={timezone}
          weeklySchedule={this.scheduleMap()}
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

const mapActionsToProps = dispatch => bindActionCreators({ showAlertTimeout }, dispatch);

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(PractitionerHoursCalendar);