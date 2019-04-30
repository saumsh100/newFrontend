
import React, { Component } from 'react';
import moment from 'moment-timezone';
import { dateFormatter } from '@carecru/isomorphic';
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

const valueToDate = value => value && moment(value).toDate();

class DayRangeWithHelpers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      fromDate: props.fromDate,
      toDate: props.toDate,
      activeElement: null,
      typeName: defaultTypeName,
    };

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
    const input = key === 'fromDate' ? this.fromInput : this.toInput;
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
    return this.setValidDate(moment(e.target.value, 'll', true), field);
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

    this.setState({ typeName: defaultTypeName }, () => this.setValidDate(changedValue, field));
  }

  /**
   * Fires parent's onChange if it exists and if both dates are set,
   * otherwise just hide the picker.
   */
  confirmRangeChanges() {
    if (this.props.onChange && this.state.fromDate && this.state.toDate) {
      this.props.onChange({
        fromDate: this.state.fromDate.toISOString(),
        toDate: this.state.toDate.toISOString(),
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
    if (this.state.activeElement) {
      const key = this.state.activeElement === 'fromInput' ? 'fromDate' : 'toDate';
      this[this.state.activeElement].value = dateFormatter(day, null, 'll');
      return this.setDateValues(key, day);
    }

    const key = !this.state.fromDate || day < this.state.fromDate ? 'fromDate' : 'toDate';
    return this.setDateValues(key, day);
  }

  /**
   * Checks if the clicked DOM element is not part of the DayRangePicker and if picker is visible,
   * with both being true we confirm the changes and close the picker.
   *
   * @param target
   */
  handleOutsideClick({ target }) {
    if (this.containerEl && !this.containerEl.contains(target) && this.state.isOpen) {
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
    if (!this.state.isOpen || target === this.fromInput || target === this.toInput) {
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
    this.setState({ activeElement: input.name }, () => {
      input.focus();
    });
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
        <div
          ref={(div) => {
            this.containerEl = div;
          }}
        >
          {label && <p className={ui.fieldLabel}>{label}</p>}
          <div className={styles.wrapper}>
            <div
              className={classnames(styles.dayRangeInputWrapper, {
                [styles.active]: this.state.isOpen,
              })}
              role="button"
              tabIndex={0}
              onKeyDown={({ keyCode }) =>
                keyCode === 13 && this.setState(prevState => ({ isOpen: !prevState.isOpen }))
              }
              onClick={this.handleClickWrapper}
            >
              {this.state.fromDate ? (
                <div className={styles.labelWrapper}>
                  <strong>{this.state.typeName}</strong>
                  <div className={styles.dateWrapper}>
                    <span>{dateFormatter(this.state.fromDate, null, 'll')}</span>
                    <DayRangeInput
                      placeholder={placeholderStart}
                      name="fromInput"
                      isActive={this.state.activeElement === 'fromInput'}
                      defaultValue={dateFormatter(this.state.fromDate, null, 'll')}
                      onBlur={e => this.handleInputBlur(e, 'fromDate')}
                      onChange={e => this.handleInputChange(e, 'fromDate')}
                      onClick={() =>
                        this.handleClickInputElement(this.fromInput, this.state.fromDate)
                      }
                      onFocus={this.showDayRange}
                      refCallback={(div) => {
                        this.fromInput = div;
                      }}
                    />
                  </div>
                  -
                  <div className={styles.dateWrapper}>
                    <span>{this.state.toDate && dateFormatter(this.state.toDate, null, 'll')}</span>
                    <DayRangeInput
                      placeholder={placeholderEnd}
                      name="toInput"
                      isActive={this.state.activeElement === 'toInput'}
                      defaultValue={dateFormatter(this.state.toDate, null, 'll')}
                      onBlur={e => this.handleInputBlur(e, 'toDate')}
                      onChange={e => this.handleInputChange(e, 'toDate')}
                      onClick={() => this.handleClickInputElement(this.toInput, this.state.toDate)}
                      onFocus={this.showDayRange}
                      refCallback={(div) => {
                        this.toInput = div;
                      }}
                    />
                  </div>
                  <Calendar />
                </div>
              ) : (
                <span className={styles.placeholder}>{placeholder}</span>
              )}
            </div>
            <div
              className={classnames(styles.dayRangeWrapper, { [styles.active]: this.state.isOpen })}
            >
              <div className={styles.main}>
                <div className={styles.helpersWrapper}>
                  {helpers.map(({ fromDate, toDate, typeName }) => (
                    <GhostButton
                      key={typeName}
                      onClick={() => {
                        this.setDateValues('fromDate', fromDate, typeName);
                        this.setDateValues('toDate', toDate, typeName);
                      }}
                    >
                      {typeName}
                    </GhostButton>
                  ))}
                </div>
                <DayPicker
                  onDayClick={this.handleDayClick}
                  showOutsideDays={showOutsideDays}
                  classNames={dayPickerClasses}
                  selectedDays={[
                    {
                      from: valueToDate(this.state.fromDate),
                      to: valueToDate(this.state.toDate),
                    },
                  ]}
                  modifiers={{
                    [dayPicker.start]: valueToDate(this.state.fromDate),
                    [dayPicker.end]: valueToDate(this.state.toDate),
                  }}
                  initialMonth={valueToDate(this.state.fromDate) || new Date()}
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
  fromDate: PropTypes.string,
  helpers: PropTypes.arrayOf(
    PropTypes.shape({
      typeName: PropTypes.string,
      toDate: PropTypes.instanceOf(Date),
      fromDate: PropTypes.instanceOf(Date),
    }),
  ),
  label: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  placeholderEnd: PropTypes.string,
  placeholderStart: PropTypes.string,
  showOutsideDays: PropTypes.bool,
  toDate: PropTypes.string,
};

DayRangeWithHelpers.defaultProps = {
  fromDate: null,
  helpers: defaultHelpers,
  label: '',
  onChange: undefined,
  placeholder: 'Select a range',
  placeholderEnd: 'End Date',
  placeholderStart: 'Start Date',
  showOutsideDays: true,
  toDate: null,
};

export default DayRangeWithHelpers;
