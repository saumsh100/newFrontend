import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Popover from 'react-popover';
import 'react-day-picker/lib/style.css';
import omit from 'lodash/omit';
import RDayPicker, { DateUtils } from 'react-day-picker';
import Input from '../Input';
import IconButton from '../IconButton';
import { dayPickerTheme } from './defaultTheme';
import { StyleExtender } from '../../Utils/Themer';
import styles from './reskin-styles.scss';
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
    return value.map((v) => toDateObject(v));
  }
  return toDateObject(value);
};

const DayPicker = (props) => {
  const {
    multiple,
    onChange,
    target,
    TargetComponent,
    tipSize,
    iconClassName,
    value,
    noTarget,
    theme,
    timezone,
  } = props;
  const [displayValue, setDisplayValue] = useState(() => {
    const onlyDate = parseDateWithFormat(value, 'l', timezone, true);
    if (typeof value === 'string' && onlyDate.isValid()) return onlyDate.format('l');
    // If value is defined and it is in UTC, format to 10/8/2017 style
    const newDisplayValue = value ? getUTCDate(value, timezone).format('l') : value;
    return newDisplayValue;
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleDayClick = (day, { disabled }) => {
    const dates = getDate(day).format('YYYY-MM-DD');
    const displayDate = getDate(day).format('MM/DD/YYYY');

    day = timezone
      ? parseDate(dates, timezone).add(12, 'hours').toISOString()
      : getDate(day).subtract(12, 'hours').toISOString();
    if (disabled) {
      return;
    }

    if (!multiple) {
      onChange(day);
      setIsOpen(false);
      setDisplayValue(displayDate);
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
  };

  const togglePopOver = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (inputDate) => {
    setDisplayValue(inputDate);
    onChange(inputDate);
  };

  function handleClose(e) {
    const { key } = e;
    if (key === 'Tab' || key === 'Enter' || key === 'Escape') {
      setIsOpen(false);
    }
  }

  const newPickerProps = omit(props, [
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
      onChange={(e) => handleInputChange(e.target.value)}
      onKeyDown={(e) => handleClose(e)}
      onFocus={togglePopOver}
      data-test-id={props['data-test-id']}
    />
  );

  if (target) {
    // const iconProps = pick(props, ['icon']);
    if (target === 'icon') {
      dayPickerTargetComponent = (
        <IconButton
          // {...iconProps}
          icon="calendar"
          type="button"
          className={iconClassName}
          onClick={togglePopOver}
          data-test-id={props['data-test-id']}
        />
      );
    } else if (target === 'custom') {
      dayPickerTargetComponent = <TargetComponent onClick={togglePopOver} />;
    }
  }

  const body = (
    <div className={styles.outerContainer} key="body">
      <RDayPicker
        onDayClick={handleDayClick}
        selectedDays={convertValueToDate(value)}
        handleInputChange={handleInputChange}
        initialMonth={value ? new Date(convertValueToDate(value)) : new Date()}
        classNames={StyleExtender(dayPickerTheme, theme)}
        {...props}
        month={value ? new Date(convertValueToDate(value)) : props.month}
      />
    </div>
  );

  const popOverWrapper = (
    <Popover
      preferPlace="below"
      className={styles.zIndex}
      onOuterAction={togglePopOver}
      isOpen={isOpen}
      tipSize={tipSize}
      body={[body]}
    >
      {target === 'custom' ? <div>{dayPickerTargetComponent}</div> : dayPickerTargetComponent}
    </Popover>
  );

  return noTarget ? body : popOverWrapper;
};

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
  onChange: (e) => e,
  target: null,
  iconClassName: '',
  multiple: false,
  TargetComponent: null,
  'data-test-id': '',
  tipSize: 12,
  noTarget: false,
  handleThisInput: (e) => e,
  value: '',
  theme: {},
  month: new Date(getTodaysDate().year(), getTodaysDate().month()),
};

export default DayPicker;
