
import React, { Component, PropTypes } from 'react';
import Popover from 'react-popover';
import moment from 'moment-timezone';
import 'react-day-picker/lib/style.css';
import isArray from 'lodash/isArray';
import omit from 'lodash/omit';
import RDayPicker, { DateUtils } from 'react-day-picker';
import Input from '../Input';
import IconButton from '../IconButton';
import styles from './styles.scss';

const convertValueToDate = (value) => {
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

  handleDayClick(day, { disabled }) {
    const {
      multiple, value, onChange, timezone,
    } = this.props;

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
      noTarget,
    } = this.props;

    // If value is defined, format to 10/8/2017 style
    const displayValue = value ? moment(value).format('l') : value;

    const newPickerProps = omit(this.props, [
      'iconClassName',
      'timezone',
      'handleThisInput',
      'noTarget',
      'TargetComponent',
    ]);

    let dayPickerTargetComponent = (
      <Input
        {...newPickerProps}
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
          <TargetComponent onClick={this.togglePopOver} />
        );
      }
    }

    const body = (
      <div className={styles.wrapper}>
        <RDayPicker
          onDayClick={this.handleDayClick}
          selectedDays={convertValueToDate(value, timezone)}
          handleInputChange={this.handleInputChange}
          initialMonth={
            value ? new Date(convertValueToDate(value, timezone)) : new Date()
          }
          {...this.props}
        />
      </div>
    );

    return (
      <div>
        {!noTarget ? (
          <Popover
            preferPlace="below"
            onOuterAction={this.togglePopOver}
            isOpen={this.state.isOpen}
            tipSize={tipSize}
            body={[body]}
          >
            {dayPickerTargetComponent}
          </Popover>
        ) : (
          body
        )}
      </div>
    );
  }
}

DayPicker.propTypes = {
  target: PropTypes.string,
  onChange: PropTypes.func,
  iconClassName: PropTypes.string,
  timezone: PropTypes.string,
  multiple: PropTypes.bool,
  TargetComponent: PropTypes.element,
  'data-test-id': PropTypes.string,
  tipSize: PropTypes.number,
  noTarget: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.objectOf(PropTypes.any),
  ]),
  handleThisInput: PropTypes.func,
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
};

export default DayPicker;
