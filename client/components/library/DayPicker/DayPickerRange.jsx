
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';
import Popover from 'react-popover';
import 'react-day-picker/lib/style.css';
import DayPicker, { DateUtils } from 'react-day-picker';
import Input from '../Input';
import Icon from '../Icon';
import Button from '../Button';
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

class DayPickerRange extends React.Component {
  constructor(props) {
    super(props);
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
      from: moment(from).isValid() ? from : null,
      to: moment(to).isValid() ? to : null,
      enteredTo: moment(to).isValid() ? to : null,
      isOpen: false,
      maxDays: maxDays || 0,
      toInputFocused: false,
      fromInputFocused: false,
    };
  }

  closePopOver() {
    this.setState({ isOpen: false });
  }

  openPopOver() {
    if (this.fromInput === document.activeElement) {
      this.setState({
        fromInputFocused: true,
        toInputFocused: false,
      });
    }

    if (this.toInput === document.activeElement) {
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
  handleDayClick(day) {
    const { from, to, toInputFocused, fromInputFocused } = this.state;

    if (from && to && (day === from || day === to)) {
      this.handleResetClick();
      return;
    }

    if (fromInputFocused || DateUtils.isDayBefore(day, from) || !from) {
      this.handleFromInput(day);
    } else if (toInputFocused || DateUtils.isDayAfter(day, from) || !to) {
      this.handleToInput(day);
    }

    // If both dates are not set, set the start-date, then focus end-date input
    if (!from && !to) {
      this.setState({
        from: day,
        to: null,
        enteredTo: null,
        toInputFocused: true,
      });
      this.toInput.focus();
    }
  }

  /**
   * handleFromInput sets the start-date value when this input is focused
   * and a user has clicked on a day.
   * @param day
   */
  handleFromInput(day) {
    const { from, to } = this.state;

    // If both dates are set and the user clicks on a date before the start-date
    if (from && to && DateUtils.isDayBefore(day, from)) {
      this.setState({
        from: day,
        to: null,
        enteredTo: null,
        fromInputFocused: false,
        toInputFocused: true,
      });
    }

    // If both dates are set and the user clicks on a date between these dates
    if (from && to && (DateUtils.isDayAfter(day, from) && DateUtils.isDayBefore(day, to))) {
      this.setState({
        from: day,
        to,
        enteredTo: to,
        fromInputFocused: false,
        toInputFocused: false,
      });
    }
    // If both dates are set and the user clicks on a date after the end-date
    if (from && to && DateUtils.isDayAfter(day, to)) {
      this.setState({
        from: day,
        to: null,
        enteredTo: null,
        fromInputFocused: false,
        toInputFocused: true,
      });
    }

    // If there is no initial start-date
    if (!from) {
      this.setState({
        from: day,
        to: null,
        enteredTo: null,
        fromInputFocused: false,
        toInputFocused: true,
      });
    }
    this.toInput.focus();
  }

  /**
   * handleToInput sets the end-date value when this input is focused
   * and a user has clicked on a day.
   * @param day
   */
  handleToInput(day) {
    const { from, to, maxDays } = this.state;

    // When both dates are set and user clicks on any day after the start-date.
    if (
      from &&
      to &&
      (DateUtils.isDayAfter(day, to) ||
        (DateUtils.isDayBefore(day, to) && !DateUtils.isDayBefore(day, from)))
    ) {
      this.setState({
        from,
        to: day,
        enteredTo: day,
        toInputFocused: false,
      });
    }

    // When start-date is set and user clicks on any day after the start-date.
    if (from && !to && DateUtils.isDayAfter(day, from)) {
      // Checking if maxDays is set and adjusting the start-date
      // if the end-date is larger than maxDays

      if (maxDays && moment(from).diff(moment(day), 'days') * -1 > maxDays) {
        const d = new Date(day);
        d.setDate(d.getDate() - maxDays);

        this.setState({
          from: d,
          to: day,
          enteredTo: day,
        });
      } else {
        this.setState({
          from,
          to: day,
          enteredTo: day,
        });
      }
    }
  }

  handleDayMouseEnter(day) {
    const { from, to } = this.state;
    if (!isSelectingFirstDay(from, to, day)) {
      this.setState({
        enteredTo: day,
      });
    }
  }

  handleResetClick() {
    this.setState({
      enteredTo: null,
      from: null,
      to: null,
      toInputFocused: false,
      fromInputFocused: true,
    });
  }

  applyDateRange() {
    const { from, to } = this.state;
    const initDates = this.getInitialState();
    const isSameDate = isSameAsInitialDates(initDates.from, initDates.to, from, to);

    if (moment(from).isValid() && moment(to).isValid() && !isSameDate) {
      this.props.onChange({ from, to });
      this.closePopOver();
    }
  }

  render() {
    const { from, to, enteredTo } = this.state;

    const modifiers = { start: from, end: enteredTo };
    const selectedDays = [from, { from, to: enteredTo }];
    // const disabledDays = { before: from, after: to };

    const body = (
      <div className={styles.wrapperRange}>
        <DayPicker
          className="Range"
          numberOfMonths={2}
          selectedDays={selectedDays}
          modifiers={modifiers}
          onDayClick={this.handleDayClick}
          onDayMouseEnter={this.handleDayMouseEnter}
          initialMonth={from || new Date()}
        />
        <div className={styles.buttonContainer}>
          <Button onClick={this.applyDateRange} color="blue">
            Set Range
          </Button>
        </div>
      </div>
    );

    const format = 'MMM DD YYYY';

    const fromFormatted = from && moment(from).isValid() && (moment(from).format(format) || null);
    const toFormatted = to && moment(to).isValid() && (moment(to).format(format) || null);

    const inputStyle = {
      group: styles.inputGroup,
    };

    return (
      <div>
        <Popover
          preferPlace="below"
          onOuterAction={this.closePopOver}
          isOpen={this.state.isOpen}
          tipSize={0.2}
          body={[body]}
          className={classnames(styles.popOverBody, this.props.popOverStyles)}
        >
          <div className={styles.rangeInputContainer}>
            <Input
              refCallBack={el => (this.fromInput = el)}
              value={fromFormatted}
              onClick={this.openPopOver}
              theme={inputStyle}
            />
            <Icon icon="arrow-right" />
            <Input
              refCallBack={el => (this.toInput = el)}
              value={toFormatted}
              onClick={this.openPopOver}
              theme={inputStyle}
            />
          </div>
        </Popover>
      </div>
    );
  }
}

DayPickerRange.propTypes = {
  from: PropTypes.string,
  to: PropTypes.string,
  onChange: PropTypes.func,
  popOverStyles: PropTypes.objectOf(String),
  maxDays: PropTypes.number,
};

export default DayPickerRange;
