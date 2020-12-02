
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';
import Popover from 'react-popover';
import 'react-day-picker/lib/style.css';
import DayPicker, { DateUtils } from 'react-day-picker';
import Input from '../Input';
import Icon from '../Icon';
import Button from '../Button';
import { StyleExtender } from '../../Utils/Themer';
import { rangePickerTheme } from './defaultTheme';
import styles from './styles.scss';

function isSelectingFirstDay(startDate, endDate, day) {
  const isBeforeFirstDay = startDate && DateUtils.isDayBefore(day, startDate);
  const isRangeSelected = startDate && endDate;
  return !startDate || isBeforeFirstDay || isRangeSelected;
}

function isSameAsInitialDates(initFrom, initTo, startDate, endDate) {
  return (
    moment(initFrom).toISOString() === moment(startDate).toISOString() &&
    moment(initTo).toISOString() === moment(endDate).toISOString()
  );
}

class DayPickerRange extends Component {
  constructor(props) {
    super(props);

    this.fromInput = createRef();
    this.toInput = createRef();

    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.closePopOver = this.closePopOver.bind(this);
    this.openPopOver = this.openPopOver.bind(this);
    this.handleFromInput = this.handleFromInput.bind(this);
    this.handleToInput = this.handleToInput.bind(this);
    this.applyDateRange = this.applyDateRange.bind(this);
    this.state = this.getInitialState();
  }

  getInitialState() {
    const { from, to, maxDays } = this.props;

    return {
      from: moment(from).isValid() ? from : '',
      to: moment(to).isValid() ? to : '',
      enteredTo: moment(to).isValid() ? to : '',
      isOpen: false,
      maxDays,
      toInputFocused: false,
      fromInputFocused: false,
    };
  }

  closePopOver() {
    this.setState({ isOpen: false });
  }

  openPopOver() {
    if (this.fromInput.current === document.activeElement) {
      this.setState({
        fromInputFocused: true,
        toInputFocused: false,
      });
    }

    if (this.toInput.current === document.activeElement) {
      this.setState({
        fromInputFocused: false,
        toInputFocused: true,
      });
    }

    if (!this.state.isOpen) {
      this.setState({ isOpen: true });
    }
  }

  /**
   * handleDayClick sets the start-date or end-date based on
   * what input is in focus.
   * @param day
   */
  handleDayClick(pickedDay) {
    if (this.props.handleDayClick) {
      return this.props.handleDayClick(pickedDay);
    }
    const { from, to, toInputFocused, fromInputFocused } = this.state;
    const { disabledDays } = this.props;

    if (
      (disabledDays.before && DateUtils.isDayBefore(pickedDay, disabledDays.before)) ||
      (disabledDays.after && DateUtils.isDayAfter(pickedDay, disabledDays.after))
    ) {
      return null;
    }

    // If both dates are not set, set the start-date, then focus end-date input
    if (!from && !to) {
      this.setState(
        {
          from: pickedDay,
          to: '',
          enteredTo: '',
          toInputFocused: true,
        },
        () => {
          this.toInput.current.focus();
          this.props.onChange({
            from,
            to: '',
          });
        },
      );
    }

    if (from && to && (pickedDay === from || pickedDay === to)) {
      return this.handleResetClick();
    }

    if (fromInputFocused || !from || DateUtils.isDayBefore(pickedDay, from)) {
      this.props.onChange({
        from: pickedDay,
        to: this.state.to,
      });
      return this.handleFromInput(pickedDay);
    } else if (toInputFocused || !to || DateUtils.isDayAfter(pickedDay, from)) {
      this.props.onChange({
        from: this.state.from,
        to: pickedDay,
      });
      return this.handleToInput(pickedDay);
    }
    return null;
  }

  /**
   * handleFromInput sets the start-date value when this input is focused
   * and a user has clicked on a day.
   * @param day
   */
  handleFromInput(pickedDay) {
    const { from, to } = this.state;

    let toDate = '';
    // If both dates are set and the user clicks on a date before the start-date
    if (to && DateUtils.isDayBefore(pickedDay, to)) {
      toDate = to;
    }

    if (
      !from ||
      (from &&
        to &&
        (DateUtils.isDayBefore(pickedDay, from) || DateUtils.isDayAfter(pickedDay, to)))
    ) {
      this.setState(
        {
          from: pickedDay,
          to: '',
          enteredTo: '',
          fromInputFocused: false,
          toInputFocused: true,
        },
        () =>
          this.props.onChange({
            from: pickedDay,
            to: '',
          }),
      );
    }

    // If both dates are set and the user clicks on a date between these dates
    if (
      from &&
      to &&
      (DateUtils.isDayAfter(pickedDay, from) && DateUtils.isDayBefore(pickedDay, to))
    ) {
      this.setState(
        {
          from: pickedDay,
          enteredTo: toDate,
          fromInputFocused: false,
          toInputFocused: false,
        },
        () => {
          this.toInput.current.focus();
          !this.props.popover && this.applyDateRange();
        },
      );
    }
  }

  /**
   * handleToInput sets the end-date value when this input is focused
   * and a user has clicked on a day.
   * @param day
   */
  handleToInput(day) {
    const { from, maxDays } = this.state;

    if (!from) {
      return '';
    }

    let fromDate = from;
    if (maxDays && moment(from).diff(moment(day), 'days') * -1 > maxDays) {
      fromDate = moment(day)
        .subtract(maxDays, 'days')
        .toDate();
    }

    return this.setState(
      {
        to: day,
        enteredTo: day,
        from: fromDate,
        toInputFocused: false,
      },
      () => {
        !this.props.popover && this.applyDateRange();
      },
    );
  }

  handleDayMouseEnter(day) {
    const { from, to } = this.state;
    const { disabledDays } = this.props;

    if (
      (disabledDays.before && DateUtils.isDayBefore(day, disabledDays.before)) ||
      (disabledDays.after && DateUtils.isDayAfter(day, disabledDays.after))
    ) {
      return '';
    }

    if (!isSelectingFirstDay(from, to, day)) {
      return this.setState({ enteredTo: day });
    }

    return '';
  }

  handleResetClick() {
    this.setState(
      {
        enteredTo: '',
        from: '',
        to: '',
        toInputFocused: false,
        fromInputFocused: true,
      },
      () =>
        this.props.onChange({
          from: '',
          to: '',
        }),
    );
  }

  applyDateRange() {
    const { from, to } = this.state;
    const initDates = this.getInitialState();
    const isSameDate = isSameAsInitialDates(initDates.from, initDates.to, from, to);

    if (moment(from).isValid() && moment(to).isValid() && !isSameDate) {
      this.props.onChange({
        from,
        to,
      });
      this.closePopOver();
    }
  }

  render() {
    const { from, to, enteredTo } = this.state;
    const {
      monthsToShow,
      popover,
      disabledDays,
      readOnly,
      fieldsWrapper,
      theme,
      timezone,
    } = this.props;

    const modifiers = {
      [styles.start]: from,
      [styles.end]: enteredTo,
      ...this.props.modifiers,
    };
    const selectedDays = [
      from,
      {
        from,
        to: enteredTo,
      },
    ];

    const body = (
      <div className={theme.wrapperRange || styles.wrapperRange}>
        <DayPicker
          className="Range"
          disabledDays={disabledDays}
          numberOfMonths={monthsToShow}
          selectedDays={selectedDays}
          modifiers={modifiers}
          onDayClick={this.handleDayClick}
          onDayMouseEnter={this.handleDayMouseEnter}
          initialMonth={from || new Date()}
          classNames={StyleExtender(theme, rangePickerTheme)}
          timezone={timezone}
        />
        {popover && (
          <div className={styles.buttonContainer}>
            <Button onClick={this.applyDateRange} color="blue">
              Set Range
            </Button>
          </div>
        )}
      </div>
    );

    const format = 'MMM DD YYYY';

    const fromFormatted = from && moment(from).isValid() && (moment(from).format(format) || '');
    const toFormatted = to && moment(to).isValid() && (moment(to).format(format) || '');

    const fieldsWrapperImplementation = fieldsWrapper({
      from: {
        fromReadOnly: readOnly,
        fromValue: fromFormatted,
        fromRef: this.fromInput,
        fromOnClick: this.openPopOver,
      },
      to: {
        toReadOnly: readOnly,
        toValue: toFormatted,
        toRef: this.toInput,
        toOnClick: this.openPopOver,
      },
    });

    return popover ? (
      <Popover
        preferPlace="below"
        onOuterAction={this.closePopOver}
        isOpen={this.state.isOpen}
        tipSize={0.2}
        body={[body]}
        className={classnames(styles.popOverBody, this.props.popOverStyles)}
      >
        {fieldsWrapperImplementation}
      </Popover>
    ) : (
      <div className={theme.outWrapper}>
        {fieldsWrapperImplementation}
        {body}
      </div>
    );
  }
}

/**
 * Displays both the date inputs and the right arrow icon
 */
const inputsAndNavigation = ({
  from: { fromReadOnly, fromValue, fromRef, fromOnClick },
  to: { toReadOnly, toValue, toRef, toOnClick },
}) => (
  <div className={styles.rangeInputContainer}>
    <Input
      readOnly={fromReadOnly}
      refCallBack={fromRef}
      value={fromValue}
      onClick={fromOnClick}
      theme={{ group: styles.inputGroup }}
    />
    <Icon icon="arrow-right" className={styles.arrowTo} />
    <Input
      readOnly={toReadOnly}
      refCallBack={toRef}
      value={toValue}
      onClick={toOnClick}
      theme={{ group: styles.inputGroup }}
    />
  </div>
);

inputsAndNavigation.propTypes = {
  from: PropTypes.shape({
    fromReadOnly: PropTypes.bool,
    fromValue: PropTypes.string,
    fromRef: PropTypes.func,
    fromOnClick: PropTypes.func,
  }).isRequired,
  to: PropTypes.shape({
    toReadOnly: PropTypes.bool,
    toValue: PropTypes.string,
    toRef: PropTypes.func,
    toOnClick: PropTypes.func,
  }).isRequired,
};

const dateShape = [PropTypes.instanceOf(Date), PropTypes.string];
DayPickerRange.propTypes = {
  disabledDays: PropTypes.objectOf(PropTypes.oneOfType(dateShape)),
  fieldsWrapper: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  from: PropTypes.oneOfType(dateShape),
  handleDayClick: PropTypes.func,
  maxDays: PropTypes.number,
  modifiers: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
  monthsToShow: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  popover: PropTypes.bool,
  popOverStyles: PropTypes.objectOf(PropTypes.string),
  readOnly: PropTypes.bool,
  to: PropTypes.oneOfType(dateShape),
  theme: PropTypes.objectOf(PropTypes.string),
  timezone: PropTypes.string.isRequired,
};

DayPickerRange.defaultProps = {
  disabledDays: {},
  fieldsWrapper: inputsAndNavigation,
  from: '',
  handleDayClick: null,
  maxDays: 0,
  monthsToShow: 1,
  popover: false,
  popOverStyles: {},
  readOnly: true,
  to: '',
  modifiers: '',
  theme: {},
};

export default DayPickerRange;
