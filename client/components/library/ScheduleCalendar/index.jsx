
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import RDayPicker, { LocaleUtils } from 'react-day-picker';
import classNames from 'classnames';
import { capitalize } from '../../../util/isomorphic';
import { weeklyScheduleShape } from '../PropTypeShapes';
import Navbar from './Navbar';
import renderDay from './renderDay';
import EditSchedule from './EditSchedule';
import ScheduleDrawer from './ScheduleDrawer';
import calendar from './calendar.scss';
import Loader from '../../Loader';
import styles from './schedule.scss';
import { parseDateWithFormat, getFormattedDate } from '../util/datetime';

/**
 * Select the short name based on the index
 *
 * @param i {Boolean}
 * @returns {string}
 */
const formatWeekdayShort = i => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i];

/**
 * Get the original date (1970-01-31T12:00:00.000Z) and sets the updateTime,
 * so a 3pm in a +3hr tz will be converted to 12pm, this way we keep the UTC value
 * and we avoid issues with sunlight day savings.
 *
 * @param {string} originalDate
 * @param {string} timezone
 * @param {boolean} [isClosed] defaults to false
 * @return {string | null}
 */
const setTimeToOriginalDate = (updatedTime, timezone, isClosed = false) => {
  if (isClosed) return '1970-01-01T12:00:00.000Z';

  const format = ['YYYY-MM-DDTHH:mm:ss.SSS[Z]', 'YYYY-MM-DDTLT]'];
  const newDateTime = parseDateWithFormat(
    `1970-01-01T${updatedTime}`,
    format,
    timezone,
  ).toISOString();
  return newDateTime;
};

class ScheduleCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerExpanded: true,
      isModalVisible: false,
      editTitle: '',
      editSchedule: {},
    };

    this.daypicker = createRef();
    this.getSelectedSchedule = this.getSelectedSchedule.bind(this);
    this.handleModalVisibility = this.handleModalVisibility.bind(this);
    this.handleEditSchedule = this.handleEditSchedule.bind(this);
    this.handleToggleOverrideHours = this.handleToggleOverrideHours.bind(this);
    this.handleUpdateSchedule = this.handleUpdateSchedule.bind(this);
  }

  /**
   * Get selected schedule, meaning that if a day is selected it will get the dailySchedule,
   * otherwise it will get the whole weeklySchedule.
   *
   * @param selectedDay {Date}
   * @returns {Serializer|dailySchedule|{}|string}
   */
  getSelectedSchedule(selectedDay) {
    return selectedDay
      ? this.props.baseSchedule.schedule[selectedDay.toISOString().split('T')[0]]
      : this.props.baseSchedule.weeklySchedule;
  }

  /**
   * Logic that changes the actual month of the calendar
   *
   * @param iterator
   */
  changeMonth(iterator) {
    const month = this.daypicker.current.state.currentMonth;
    month.setMonth(month.getMonth() + iterator);
    this.daypicker.current.showMonth(month);
    this.props.onChangeMonth(month);
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
   * Manages which schedule should be edit, if there is a selectedDay use the provided,
   * otherwise select the weekDay's schedule on the weeklySchedule.
   * @param weekDay
   */
  handleEditSchedule(weekDay) {
    const { selectedDay, timezone } = this.props;
    const weekDayForselectedDay = selectedDay && getFormattedDate(selectedDay, 'dddd', timezone).toLowerCase();
    const isTheSameDay = weekDayForselectedDay
      && weekDayForselectedDay === weekDay
      && this.getSelectedSchedule(selectedDay).isDailySchedule;

    this.setState(
      {
        editSchedule: isTheSameDay
          ? this.getSelectedSchedule(selectedDay)
          : this.props.baseSchedule.weeklySchedule[weekDay],
        editTitle: isTheSameDay
          ? `Holiday Hours (${getFormattedDate(selectedDay, 'MMM. D, YYYY', timezone)})`
          : `Default Weekly Schedule (${capitalize(weekDay)})`,
      },
      () => this.handleModalVisibility(),
    );
  }

  handleToggleOverrideHours(checked) {
    return checked
      ? this.props.handleRemoveOverrideHours({
        scheduleId: this.getSelectedSchedule(this.props.selectedDay).id,
        date: this.props.selectedDay,
      })
      : this.props.handleCreateCustomSchedule({ date: this.props.selectedDay });
  }

  handleUpdateSchedule(schedule) {
    const { timezone, selectedDay } = this.props;
    const { isClosed, endTime, startTime } = schedule;
    return this.props.handleUpdateSchedule(
      {
        ...schedule,
        startTime: setTimeToOriginalDate(startTime, timezone, isClosed),
        endTime: setTimeToOriginalDate(endTime, timezone, isClosed),
        date: selectedDay,
        breaks:
          isClosed || schedule.breaks.length === 0
            ? []
            : schedule.breaks.map(b => ({
              ...b,
              endTime: setTimeToOriginalDate(b.endTime, timezone),
              startTime: setTimeToOriginalDate(b.startTime, timezone),
            })),
      },
      () => this.handleModalVisibility(false),
    );
  }

  render() {
    const { editSchedule, isDrawerExpanded, isModalVisible } = this.state;
    const { timezone, selectedDay, month } = this.props;
    return (
      <div className={styles.calendarWrapper}>
        <Navbar
          toggleDrawer={() =>
            this.setState(prevState => ({ isDrawerExpanded: !prevState.isDrawerExpanded }))
          }
          isDrawerExpanded={isDrawerExpanded}
          month={month}
          onNextClick={() => this.changeMonth(1)}
          onPreviousClick={() => this.changeMonth(-1)}
          timezone={timezone}
        />
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <div className={classNames(styles.loading, { [styles.active]: this.props.isLoading })}>
              <Loader isLoaded={!this.props.isLoading} />
            </div>
            <RDayPicker
              localeUtils={{
                ...LocaleUtils,
                formatWeekdayShort,
              }}
              ref={this.daypicker}
              navbarElement={() => null}
              captionElement={() => null}
              month={month}
              modifiers={{
                [calendar.closedDay]: this.props.closedDays,
                [calendar.dailySchedule]: this.props.dailyScheduleDays,
              }}
              selectedDays={selectedDay}
              onDayClick={day => this.props.handleDayClick(day)}
              className={styles.sidebar_calendar}
              renderDay={day => this.props.renderDay(day, this.handleEditSchedule)}
              classNames={{
                ...calendar,
                disabled: calendar.closedDay,
                selected: calendar.selectedDay,
                today: calendar.day,
                navButtonInteractionDisabled: calendar.navButtonInteractionDisabled,
              }}
            />
            {isDrawerExpanded && (
              <ScheduleDrawer
                toggleCustomSchedule={this.handleToggleOverrideHours}
                selectedDay={selectedDay}
                isOverride={this.props.isOverride}
                shouldDisplayWeeklyHours={this.props.shouldDisplayWeeklyHours}
                handleEditSchedule={this.handleEditSchedule}
                schedule={this.props.weeklySchedule}
                timezone={timezone}
              />
            )}
          </div>
        </div>
        <div className={styles.legends}>
          <div className={styles.legend}>
            <span className={styles.defaultLegend} />
            Default Hours
          </div>
          <div className={styles.legend}>
            <span className={styles.overrideLegend} />
            Holiday Hours
          </div>
          <div className={styles.legend}>
            <span className={styles.closedLegend} />
            Closed
          </div>
        </div>
        <EditSchedule
          editChairs={this.props.editChairs}
          selectedDay={selectedDay}
          isModalVisible={isModalVisible}
          schedule={editSchedule}
          title={this.state.editTitle}
          handleUpdateSchedule={this.handleUpdateSchedule}
          hideModal={() => this.handleModalVisibility(false)}
        />
      </div>
    );
  }
}

ScheduleCalendar.propTypes = {
  baseSchedule: PropTypes.shape({
    schedule: PropTypes.shape({}),
    isCustomSchedule: PropTypes.bool,
    dailySchedule: PropTypes.arrayOf(PropTypes.object),
    weeklySchedule: PropTypes.shape(weeklyScheduleShape),
  }).isRequired,
  weeklySchedule: PropTypes.shape(weeklyScheduleShape).isRequired,
  closedDays: PropTypes.arrayOf(PropTypes.object),
  dailyScheduleDays: PropTypes.arrayOf(PropTypes.object),
  handleCreateCustomSchedule: PropTypes.func.isRequired,
  handleDayClick: PropTypes.func.isRequired,
  handleRemoveOverrideHours: PropTypes.func.isRequired,
  handleUpdateSchedule: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isOverride: PropTypes.bool.isRequired,
  month: PropTypes.instanceOf(Date),
  onChangeMonth: PropTypes.func,
  selectedDay: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  timezone: PropTypes.string.isRequired,
  renderDay: PropTypes.func,
  shouldDisplayWeeklyHours: PropTypes.bool,
  editChairs: PropTypes.bool,
};

ScheduleCalendar.defaultProps = {
  renderDay,
  closedDays: [],
  dailyScheduleDays: [],
  month: new Date(),
  onChangeMonth: () => {},
  selectedDay: null,
  editChairs: false,
  shouldDisplayWeeklyHours: true,
};

export default ScheduleCalendar;
