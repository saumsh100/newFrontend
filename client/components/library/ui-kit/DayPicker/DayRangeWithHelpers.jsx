import React, { Component, createRef } from 'react';
import { v4 as uuid } from 'uuid';
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
import ui from '../../../../styles/ui-kit.scss';
import styles from './styles.scss';
import { getDate, getUTCDate, parseDate } from '../../util/datetime';

const defaultTypeName = 'Custom';

const valueToDate = (value, timezone) => value && parseDate(value, timezone).toDate();
const formatDate = (value, timezone, format = undefined) =>
  getUTCDate(value, timezone).format(format);
const isInvalidRange = (date, isFromInput, state) =>
  (isFromInput ? date > state.end : date < state.start);

class DayRangeWithHelpers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      start: valueToDate(
        (props.defaultValue && props.defaultValue.start) || props.start,
        props.timezone,
      ),
      end: valueToDate((props.defaultValue && props.defaultValue.end) || props.end, props.timezone),
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
        parseDate(start, this.props.timezone).isSame(this.props.start, 'day')
        && parseDate(end, this.props.timezone).isSame(this.props.end, 'day'),
    );
    if (prevProps !== this.props) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ visibleMonth: valueToDate(this.props.start, this.props.timezone) });
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
   * Only update the state if the provided displayValue instance is valid.
   * @param displayValue {DateTimeObj}
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
      input.value = formatDate(value, null, 'll');
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
    const changedValue = getDate(e.target.value, 'll', true);
    if (!changedValue.isValid()) return;

    const isFromInput = field === 'start';
    const formattedDate = formatDate(changedValue.toDate());
    if (isInvalidRange(formattedDate, isFromInput, this.state)) {
      const input = isFromInput ? 'fromInput' : 'toInput';
      this[input].value = formatDate(this.state[field], null, 'll');
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
    const changedValue = getDate(e.target.value);
    if (!changedValue.isValid()) return;

    const isFromInput = field === 'start';
    const formattedDate = formatDate(changedValue.toDate(), this.props.timezone);
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
        start: parseDate(this.state.start, this.props.timezone).toISOString(),
        end: parseDate(this.state.end, this.props.timezone).toISOString(),
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
    day = formatDate(day, this.props.timezone);
    if (!this.state.activeElement) {
      const key = !this.state.start || day < this.state.start ? 'start' : 'end';
      return this.setDateValues(key, day);
    }

    const isFromInput = this.state.activeElement === 'fromInput';
    if (isInvalidRange(day, isFromInput, this.state)) return false;

    const key = isFromInput ? 'start' : 'end';
    this[this.state.activeElement].value = formatDate(day, this.props.timezone, 'll');
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
      this.containerEl.current
      && !this.containerEl.current.contains(target)
      && this.state.isOpen
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
      !this.state.isOpen
      || target === this.fromInput.current
      || target === this.toInput.current
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
    if (!input.value || formatDate(date, this.props.timezone, 'll') !== input.value) {
      input.value = formatDate(date, this.props.timezone, 'll');
    }

    this.setState(
      {
        activeElement: input.name,
        visibleMonth: valueToDate(date, this.props.timezone),
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
                return false;
              }}
              onClick={this.handleClickWrapper}
            >
              {this.state.start ? (
                <div className={styles.labelWrapper}>
                  <strong>{this.state.typeName}</strong>
                  <div className={styles.dateWrapper}>
                    <span>{formatDate(this.state.start, this.props.timezone, 'll')}</span>
                    <DayRangeInput
                      placeholder={placeholderStart}
                      name="fromInput"
                      isActive={this.state.activeElement === 'fromInput'}
                      defaultValue={formatDate(this.state.start, this.props.timezone, 'll')}
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
                    <span>
                      {this.state.end && formatDate(this.state.end, this.props.timezone, 'll')}
                    </span>
                    <DayRangeInput
                      placeholder={placeholderEnd}
                      name="toInput"
                      isActive={this.state.activeElement === 'toInput'}
                      defaultValue={formatDate(this.state.end, this.props.timezone, 'll')}
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
                      from: valueToDate(this.state.start, this.props.timezone),
                      to: valueToDate(this.state.end, this.props.timezone),
                    },
                  ]}
                  modifiers={{
                    [dayPicker.start]: valueToDate(this.state.start, this.props.timezone),
                    [dayPicker.end]: valueToDate(this.state.end, this.props.timezone),
                  }}
                  month={this.state.visibleMonth}
                  timezone={this.props.timezone}
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
  timezone: PropTypes.string,
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
  timezone: null,
};

export default DayRangeWithHelpers;
