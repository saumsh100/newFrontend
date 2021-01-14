
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Popover from 'react-popover';
import 'react-day-picker/lib/style.css';
import omit from 'lodash/omit';
import RDayPicker, { DateUtils } from 'react-day-picker';
import Input from '../Input';
import IconButton from '../IconButton';
import { dayPickerTheme } from './defaultTheme';
import { StyleExtender } from '../../Utils/Themer';
import styles from './styles.scss';
import {
  getDate,
  getTodaysDate,
  getUTCDate,
  parseDate,
  parseDateWithFormat,
} from '../util/datetime';

const convertValueToDate = (value) => {
  const toDateObject = (d) => {
    const { years, months, date, hours } = getUTCDate(d).toObject();
    return new Date(years, months, date, hours);
  };

  if (Array.isArray(value)) {
    return value.map(v => toDateObject(v));
  }
  return toDateObject(value);
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
    const dates = getDate(day).format('YYYY-MM-DD');

    day = timezone
      ? parseDate(dates, timezone)
        .add(12, 'hours')
        .toISOString()
      : getDate(day)
        .subtract(12, 'hours')
        .toISOString();
    if (disabled) {
      return;
    }

    if (!multiple) {
      onChange(day);
      this.setState({ isOpen: false });
    } else {
      const selectedIndex = value.findIndex((v) => {
        const date = getDate(new Date(v)).toDate();
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
    const momentDay = getDate(value, 'L', true);
    if (momentDay.isValid() && this.props.handleThisInput) {
      this.props.onChange(momentDay.toISOString());
    }
  }

  handleClose(e) {
    const { key } = e;
    if (key === 'Tab' || key === 'Enter' || key === 'Escape') {
      this.setState({ isOpen: false });
    }
  }

  render() {
    const {
      target,
      TargetComponent,
      tipSize,
      iconClassName,
      value,
      noTarget,
      theme,
      timezone,
    } = this.props;

    let displayValue;

    // If the defined value is in the 10/8/2017 style, parse the date
    const onlyDate = parseDateWithFormat(value, ['L', 'l'], timezone);
    if (typeof value === 'string' && onlyDate.isValid()) {
      displayValue = onlyDate.format('l');
    } else {
      // If value is defined and it is in UTC, format to 10/8/2017 style
      displayValue = value ? getUTCDate(value, timezone).format('l') : value;
    }

    const newPickerProps = omit(this.props, [
      'iconClassName',
      'timezone',
      'handleThisInput',
      'noTarget',
      'TargetComponent',
      'disabledDays',
      'onChange',
      'onClick',
      'onBlur',
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
          month={value ? new Date(convertValueToDate(value)) : this.props.month}
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
  timezone: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  TargetComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  'data-test-id': PropTypes.string,
  tipSize: PropTypes.number,
  noTarget: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]),
  handleThisInput: PropTypes.func,
  theme: PropTypes.objectOf(PropTypes.string),
  month: PropTypes.instanceOf(Date),
};

DayPicker.defaultProps = {
  onChange: e => e,
  target: null,
  iconClassName: '',
  multiple: false,
  TargetComponent: null,
  'data-test-id': '',
  tipSize: 12,
  noTarget: false,
  handleThisInput: e => e,
  value: '',
  theme: {},
  month: new Date(getTodaysDate().year(), getTodaysDate().month()),
};

export default DayPicker;
