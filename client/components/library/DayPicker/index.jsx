
import React, { Component, PropTypes } from 'react';
import Popover from 'react-popover';
import moment from 'moment-timezone';
import 'react-day-picker/lib/style.css';
import pick from 'lodash/pick';
import isArray from 'lodash/isArray';
import RDayPicker, { DateUtils } from 'react-day-picker';
import DayPickerStyles from './styles.css';
import Input from '../Input';
import IconButton from '../IconButton';
import styles from './styles.scss';

const convertValueToDate = (value, timezone) => {
  if (isArray(value)) {
    return value.map(v => new Date(v));
  }

  return new Date(value);
};

class DayPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.handleDayClick = this.handleDayClick.bind(this);
    this.togglePopOver = this.togglePopOver.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleDayClick(day, { selected, disabled }) {
    const {
      multiple,
      value,
      onChange,
      timezone,
    } = this.props;


    const dates = moment(day).format('YYYY-MM-DD');

    day = timezone ? moment.tz(dates, timezone).add(12, 'hours').toISOString() : moment(day).subtract(12, 'hours').toISOString();
    if (disabled) {
      return;
    }

    if (!multiple) {
      this.props.onChange(day);
      this.setState({ isOpen: false });
    } else {
      const selectedIndex = value.findIndex((v) => {
        const date = moment(new Date(v))._d;
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
    this.setState({ isOpen: !this.state.isOpen });
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
    const key = e.key;
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
      timezone,
      icon,
      noTarget,
    } = this.props;

    // If value is defined, format to 10/8/2017 style
    const displayValue = value ? moment(value).format('l') : value;

    let dayPickerTargetComponent = (
      <Input
        {...this.props}
        value={displayValue}
        onChange={this.handleInputChange}
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
        dayPickerTargetComponent = (
          <TargetComponent
            onClick={this.togglePopOver}
          />
        );
      }
    }

    const body = (
      <div className={styles.wrapper}>
        <RDayPicker
          onDayClick={this.handleDayClick}
          selectedDays={convertValueToDate(value, timezone)}
          handleInputChange={this.handleInputChange}
          initialMonth={value ? new Date(convertValueToDate(value, timezone)) : new Date()}
          {...this.props}
        />
      </div>
    );

    // TODO: we need to accept all types of values, ISOStrings, Dates, moments, etc. and arrays of those!
    return (
      <div>
        {!noTarget ?
          <Popover
            preferPlace="below"
            onOuterAction={this.togglePopOver}
            isOpen={this.state.isOpen}
            tipSize={tipSize}
            body={[body]}
          >
            {dayPickerTargetComponent}
          </Popover> : body}
      </div>
    );
  }
}

DayPicker.propTypes = {
  target: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  iconClassName: PropTypes.string,
  timezone: PropTypes.string,
  multiple: PropTypes.bool,
};

export default DayPicker;
