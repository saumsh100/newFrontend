
import React, { Component, createRef } from 'react';
import moment from 'moment-timezone';
import { v4 as uuid } from 'uuid';
import { dateFormatter, setDateToTimezone } from '@carecru/isomorphic';
import DayPicker from 'react-day-picker';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Calendar from '../Icons/Calendar';
import PopoverConfirm from '../Button/PopoverConfirm';
import GhostButton from '../Button/GhostButton';
import DayRangeInput from './DayRangeInput';
import dayPickerClasses from './dayPickerClasses';
import defaultHelpers from './defaultRangeHelpers';
import dayPicker from './dayPicker.scss';
import ui from '../../../../ui-kit.scss';
import styles from './styles.scss';

const defaultTypeName = 'Custom';

const valueToDate = value => value && setDateToTimezone(value).toDate();

const isInvalidRange = (date, isFromInput, state) =>
  (isFromInput ? date > state.end : date < state.start);

class DayRangeWithHelpers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      start: valueToDate((props.defaultValue && props.defaultValue.start) || props.start),
      end: valueToDate((props.defaultValue && props.defaultValue.end) || props.end),
      activeElement: null,
      typeName: (props.defaultValue && props.defaultValue.label) || defaultTypeName,
      visibleMonth: new Date(),
    };

    this.fromInput = createRef();
    this.toInput = createRef();
    this.containerEl = createRef();
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleClickWrapper = this.handleClickWrapper.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.confirmRangeChanges = this.confirmRangeChanges.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.hideDayRange = this.hideDayRange.bind(this);
    this.showDayRange = this.showDayRange.bind(this);
  }

  /**
   * Add an event listener (on the window element) when the component is mounting.
   */
  componentDidMount() {
    window.addEventListener('click', this.handleOutsideClick);
  }

  componentDidUpdate(prevProps) {
    const defaultOption = this.props.helpers.find(
      ({ start, end }) =>
        setDateToTimezone(start).isSame(this.props.start, 'day') &&
        setDateToTimezone(end).isSame(this.props.end, 'day'),
    );
    if (prevProps !== this.props) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ visibleMonth: valueToDate(this.props.start) });
      this.setDateValues('start', this.props.start, defaultOption && defaultOption.label);
      this.setDateValues('end', this.props.end, defaultOption && defaultOption.label);
    }
  }

  /**
   * Remove an event listener (on the window element) when the component is unmounting.
   */
  componentWillUnmount() {
    window.removeEventListener('click', this.handleOutsideClick);
  }

  /**
   * Only update the state if the provided moment instance is valid.
   * @param displayValue {moment}
   * @param field
   */
  setValidDate(displayValue, field) {
    if (displayValue.isValid()) {
      this.setState({ [field]: displayValue.toDate() });
    }
  }

  /**
   * Sets the provided value on the state and on the input if it's mounted.
   *
   * @param key
   * @param value
   * @param typeName
   */
  setDateValues(key, value, typeName = defaultTypeName) {
    const input = key === 'start' ? this.fromInput.current : this.toInput.current;
    if (input) {
      input.value = dateFormatter(value, null, 'll');
    }
    return this.setState({
      [key]: value,
      activeElement: null,
      typeName,
    });
  }

  /**
   * Handles the Blur event on the input
   *
   * @param e
   * @param field
   */
  handleInputBlur(e, field) {
    const changedValue = moment(e.target.value, 'll', true);
    if (!changedValue.isValid()) return;

    const isFromInput = field === 'start';
    const formattedDate = dateFormatter(changedValue.toDate());
    if (isInvalidRange(formattedDate, isFromInput, this.state)) {
      const input = isFromInput ? 'fromInput' : 'toInput';
      this[input].value = dateFormatter(this.state[field], null, 'll');
      return;
    }

    this.setValidDate(changedValue, field);
  }

  /**
   * Handles the Change event on the input
   *
   * @param e
   * @param field
   */
  handleInputChange(e, field) {
    const changedValue = moment(e.target.value);
    if (!changedValue.isValid()) return;

    const isFromInput = field === 'start';
    const formattedDate = dateFormatter(changedValue.toDate());
    if (isInvalidRange(formattedDate, isFromInput, this.state)) return;

    this.setState({ typeName: defaultTypeName }, () => this.setValidDate(changedValue, field));
  }

  /**
   * Fires parent's onChange if it exists and if both dates are set,
   * otherwise just hide the picker.
   */
  confirmRangeChanges() {
    if (this.props.onChange && this.state.start && this.state.end) {
      this.props.onChange({
        start: setDateToTimezone(this.state.start).toISOString(),
        end: setDateToTimezone(this.state.end).toISOString(),
      });
    }

    this.hideDayRange();
  }

  /**
   * Handle the day selection taking in consideration the active element
   *
   * @param day
   * @return {*}
   */
  handleDayClick(day) {
    day = dateFormatter(day);
    if (!this.state.activeElement) {
      const key = !this.state.start || day < this.state.start ? 'start' : 'end';
      return this.setDateValues(key, day);
    }

    const isFromInput = this.state.activeElement === 'fromInput';
    if (isInvalidRange(day, isFromInput, this.state)) return;

    const key = isFromInput ? 'start' : 'end';
    this[this.state.activeElement].value = dateFormatter(day, null, 'll');
    return this.setDateValues(key, day);
  }

  /**
   * Checks if the clicked DOM element is not part of the DayRangePicker and if picker is visible,
   * with both being true we confirm the changes and close the picker.
   *
   * @param target
   */
  handleOutsideClick({ target }) {
    if (
      this.containerEl.current &&
      !this.containerEl.current.contains(target) &&
      this.state.isOpen
    ) {
      this.confirmRangeChanges();
    }
  }

  /**
   * Closes the DayRangePicker and unset the activeElement
   */
  hideDayRange() {
    return this.setState({
      isOpen: false,
      activeElement: null,
    });
  }

  /**
   * Shows the DayRangePicker
   */
  showDayRange() {
    return this.setState({
      isOpen: true,
    });
  }

  /**
   * Handles clicking the DayRangePicker wrapper,
   * so that we can control the picker visibility.
   *
   * @param target
   * @return {*}
   */
  handleClickWrapper({ target }) {
    if (
      !this.state.isOpen ||
      target === this.fromInput.current ||
      target === this.toInput.current
    ) {
      return this.showDayRange();
    }

    return this.hideDayRange();
  }

  /**
   * Handle the action when clicking the input element,
   * if the Element is mounted we set the value and also focus the input.
   *
   * @param input
   * @param date
   */
  handleClickInputElement(input, date) {
    if (!input.value || dateFormatter(date, null, 'll') !== input.value) {
      input.value = dateFormatter(date, null, 'll');
    }

    this.setState(
      {
        activeElement: input.name,
        visibleMonth: valueToDate(date),
      },
      () => {
        input.focus();
      },
    );
  }

  render() {
    const {
      helpers,
      label,
      placeholder,
      placeholderEnd,
      placeholderStart,
      showOutsideDays,
    } = this.props;

    return (
      <div>
        <div ref={this.containerEl}>
          {label && <p className={ui.fieldLabel}>{label}</p>}
          <div className={styles.wrapper}>
            <div
              className={classnames(styles.dayRangeInputWrapper, {
                [styles.active]: this.state.isOpen,
              })}
              role="button"
              tabIndex={0}
              onKeyDown={({ keyCode }) => {
                if (keyCode === 13) {
                  if (this.state.isOpen) {
                    return this.confirmRangeChanges();
                  }
                  return this.setState({ isOpen: true });
                }
              }}
              onClick={this.handleClickWrapper}
            >
              {this.state.start ? (
                <div className={styles.labelWrapper}>
                  <strong>{this.state.typeName}</strong>
                  <div className={styles.dateWrapper}>
                    <span>{dateFormatter(this.state.start, null, 'll')}</span>
                    <DayRangeInput
                      placeholder={placeholderStart}
                      name="fromInput"
                      isActive={this.state.activeElement === 'fromInput'}
                      defaultValue={dateFormatter(this.state.start, null, 'll')}
                      onBlur={e => this.handleInputBlur(e, 'start')}
                      onChange={e => this.handleInputChange(e, 'start')}
                      onClick={() =>
                        this.handleClickInputElement(this.fromInput.current, this.state.start)
                      }
                      onFocus={this.showDayRange}
                      refCallback={this.fromInput}
                    />
                  </div>
                  -
                  <div className={styles.dateWrapper}>
                    <span>{this.state.end && dateFormatter(this.state.end, null, 'll')}</span>
                    <DayRangeInput
                      placeholder={placeholderEnd}
                      name="toInput"
                      isActive={this.state.activeElement === 'toInput'}
                      defaultValue={dateFormatter(this.state.end, null, 'll')}
                      onBlur={e => this.handleInputBlur(e, 'end')}
                      onChange={e => this.handleInputChange(e, 'end')}
                      onClick={() =>
                        this.handleClickInputElement(this.toInput.current, this.state.end)
                      }
                      onFocus={this.showDayRange}
                      refCallback={this.toInput}
                    />
                  </div>
                  <Calendar />
                </div>
              ) : (
                <span className={styles.placeholder}>{placeholder}</span>
              )}
            </div>
            <div
              className={classnames(styles.dayRangeWrapper, {
                [styles.active]: this.state.isOpen,
              })}
            >
              <div className={styles.main}>
                <div className={styles.helpersWrapper}>
                  {helpers.map(helper => (
                    <GhostButton
                      key={uuid()}
                      onClick={() => {
                        this.setDateValues('start', helper.start, helper.label);
                        this.setDateValues('end', helper.end, helper.label);
                        this.setState({ visibleMonth: helper.start });
                      }}
                    >
                      {helper.label}
                    </GhostButton>
                  ))}
                </div>
                <DayPicker
                  onDayClick={this.handleDayClick}
                  showOutsideDays={showOutsideDays}
                  classNames={dayPickerClasses}
                  selectedDays={[
                    {
                      from: valueToDate(this.state.start),
                      to: valueToDate(this.state.end),
                    },
                  ]}
                  modifiers={{
                    [dayPicker.start]: valueToDate(this.state.start),
                    [dayPicker.end]: valueToDate(this.state.end),
                  }}
                  month={this.state.visibleMonth}
                />
              </div>
              <div className={styles.footer}>
                <PopoverConfirm onClick={this.confirmRangeChanges}>Done</PopoverConfirm>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DayRangeWithHelpers.propTypes = {
  start: PropTypes.string,
  helpers: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      end: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
      start: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    }),
  ),
  defaultValue: PropTypes.shape({
    label: PropTypes.string,
    end: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    start: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  }),
  label: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  placeholderEnd: PropTypes.string,
  placeholderStart: PropTypes.string,
  showOutsideDays: PropTypes.bool,
  end: PropTypes.string,
};

DayRangeWithHelpers.defaultProps = {
  start: null,
  helpers: defaultHelpers,
  defaultValue: null,
  label: '',
  onChange: undefined,
  placeholder: 'Select a range',
  placeholderEnd: 'End Date',
  placeholderStart: 'Start Date',
  showOutsideDays: true,
  end: null,
};

export default DayRangeWithHelpers;
