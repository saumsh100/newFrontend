
import React, { Component, PropTypes } from 'react';
import Popover from 'react-popover';
import moment from 'moment';
import pick from 'lodash/pick';
import isArray from 'lodash/isArray';
import RDayPicker, { DateUtils } from 'react-day-picker';
import DayPickerStyles from './styles.css';
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

  handleDayClick(day, { selected , disabled }) {
    const {
      multiple,
      value,
      onChange,
    } = this.props;

    if (disabled) {
      return ;
    }
    if (!multiple) {
      this.props.onChange(day.toISOString());
      this.setState({ isOpen: false });
    } else {
      const selectedIndex = value.findIndex(v =>
        DateUtils.isSameDay(new Date(v), day)
      );

      if (selectedIndex > -1) {
        onChange(value.filter((v, i) => i !== selectedIndex));
      } else {
        onChange([...value, day.toISOString()]);
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

  render() {
    const {
      target,
      iconClassName,
      value,
    } = this.props;

    let dayPickerTargetComponent = (
      <Input
        {...this.props}
        onChange={this.handleInputChange}
        onFocus={this.togglePopOver}
      />
    );

    if (target === 'icon') {
      // const iconProps = pick(this.props, ['icon']);
      dayPickerTargetComponent = (
        <IconButton
          // {...iconProps}
          icon="calendar"
          type="button"
          className={iconClassName}
          onClick={this.togglePopOver}
        />
      );
    }

    // TODO: we need to accept all types of values, ISOStrings, Dates, moments, etc. and arrays of those!
    return (
      <Popover
        preferPlace="below"
        onOuterAction={this.togglePopOver}
        isOpen={this.state.isOpen}
        body={[(
          <div className={styles.wrapper}>
            {/*<IconButton className={styles.closeButton} icon="close" onClick={this.togglePopOver} />*/}
            <RDayPicker
              onDayClick={this.handleDayClick}
              selectedDays={convertValueToDate(value)}
              handleInputChange={this.handleInputChange}
              {...this.props}
            />
          </div>
        )]}
      >
        {dayPickerTargetComponent}
      </Popover>
    );
  }
}

DayPicker.propTypes = {
  target: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  iconClassName: PropTypes.string,
  multiple: PropTypes.bool.isRequired,
};

export default DayPicker;
