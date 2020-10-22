
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Popover from 'react-popover';
import moment from 'moment-timezone';
import 'react-day-picker/lib/style.css';
import isArray from 'lodash/isArray';
import omit from 'lodash/omit';
import RDayPicker, { DateUtils } from 'react-day-picker';
import Input from '../Input';
import IconButton from '../IconButton';
import { dayPickerTheme } from './defaultTheme';
import { StyleExtender } from '../../Utils/Themer';
import styles from './styles.scss';

const getUTCDate = (value) => {
  const { years, months, date, hours } = moment(value).toObject();
  return new Date(years, months, date, hours);
};

const convertValueToDate = (value) => {
  if (isArray(value)) {
    return value.map(v => getUTCDate(v));
  }
  return getUTCDate(value);
};

class DayPicker extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.handleDayClick = this.handleDayClick.bind(this);
    this.togglePopOver = this.togglePopOver.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleDayClick(day, { disabled }) {
    const { multiple, value, onChange, timezone } = this.props;

    const dates = moment(day).format('YYYY-MM-DD');

    day = timezone
      ? moment
        .tz(dates, timezone)
        .add(12, 'hours')
        .toISOString()
      : moment(day)
        .subtract(12, 'hours')
        .toISOString();
    if (disabled) {
      return;
    }

    if (!multiple) {
      this.props.onChange(day);
      this.setState({ isOpen: false });
    } else {
      const selectedIndex = value.findIndex((v) => {
        const date = moment(new Date(v)).toDate();
        return DateUtils.isSameDay(new Date(date), new Date(day));
      });

      if (selectedIndex > -1) {
        onChange(value.filter((v, i) => i !== selectedIndex));
      } else {
        onChange([...value, day]);
      }
    }
  }

  togglePopOver() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  handleInputChange(e) {
    const { value } = e.target;
    const momentDay = moment(value, 'L', true);

    if (momentDay.isValid() && this.props.handleThisInput) {
      this.props.onChange(value);
    } else {
      this.props.onChange(value);
    }
  }

  handleClose(e) {
    const { key } = e;
    if (key === 'Tab' || key === 'Enter' || key === 'Escape') {
      this.setState({ isOpen: false });
    }
  }

  render() {
    const { target, TargetComponent, tipSize, iconClassName, value, noTarget, theme } = this.props;
    // If value is defined, format to 10/8/2017 style
    const displayValue = value ? moment(value).format('l') : value;

    const newPickerProps = omit(this.props, [
      'iconClassName',
      'timezone',
      'handleThisInput',
      'noTarget',
      'TargetComponent',
      'disabledDays',
    ]);

    let dayPickerTargetComponent = (
      <Input
        {...newPickerProps}
        value={displayValue}
        onChange={e => e.preventDefault()}
        onKeyDown={e => this.handleClose(e)}
        onFocus={this.togglePopOver}
        data-test-id={this.props['data-test-id']}
      />
    );

    if (target) {
      // const iconProps = pick(this.props, ['icon']);
      if (target === 'icon') {
        dayPickerTargetComponent = (
          <IconButton
            // {...iconProps}
            icon="calendar"
            type="button"
            className={iconClassName}
            onClick={this.togglePopOver}
            data-test-id={this.props['data-test-id']}
          />
        );
      } else if (target === 'custom') {
        dayPickerTargetComponent = <TargetComponent onClick={this.togglePopOver} />;
      }
    }
    const body = (
      <div className={styles.outerContainer} key="body">
        <RDayPicker
          onDayClick={this.handleDayClick}
          selectedDays={convertValueToDate(value)}
          handleInputChange={this.handleInputChange}
          initialMonth={value ? new Date(convertValueToDate(value)) : new Date()}
          classNames={StyleExtender(dayPickerTheme, theme)}
          {...this.props}
        />
      </div>
    );

    const popOverWrapper = (
      <Popover
        preferPlace="below"
        className={styles.zIndex}
        onOuterAction={this.togglePopOver}
        isOpen={this.state.isOpen}
        tipSize={tipSize}
        body={[body]}
      >
        {target === 'custom' ? <div>{dayPickerTargetComponent}</div> : dayPickerTargetComponent}
      </Popover>
    );

    return noTarget ? body : popOverWrapper;
  }
}

DayPicker.propTypes = {
  target: PropTypes.string,
  onChange: PropTypes.func,
  iconClassName: PropTypes.string,
  timezone: PropTypes.string,
  multiple: PropTypes.bool,
  TargetComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  'data-test-id': PropTypes.string,
  tipSize: PropTypes.number,
  noTarget: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]),
  handleThisInput: PropTypes.func,
  theme: PropTypes.objectOf(PropTypes.string),
};

DayPicker.defaultProps = {
  onChange: e => e,
  target: null,
  iconClassName: '',
  timezone: '',
  multiple: false,
  TargetComponent: null,
  'data-test-id': '',
  tipSize: 12,
  noTarget: false,
  handleThisInput: e => e,
  value: '',
  theme: {},
};

export default DayPicker;
