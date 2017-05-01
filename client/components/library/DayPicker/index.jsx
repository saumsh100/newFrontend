
import React, { Component, PropTypes } from 'react';
import Popover from 'react-popover';
import moment from 'moment';
import { pick } from 'lodash';
import Daypicker, { DateUtils } from 'react-day-picker';
import DayPickerStyles from './styles.css';
import Input from '../Input';
import IconButton from '../IconButton';
import styles from './styles.scss';

class DayPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleDayClick(day, { selected }) {
    this.props.onChange(day.toISOString());
    this.setState({ isOpen: false });
  }

  handleInputClick() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  handleInputChange(e) {
    const { value } = e.target;
    const momentDay = moment(value, 'L', true);
    if (momentDay.isValid()) {
      this.props.onChange(value);
    } else {
      this.props.onChange(value);
    }
  }

  render() {
    const {
      target,
      value,
    } = this.props;

    let dayPickerTargetComponent = (
      <Input
        {...this.props}
        onChange={this.handleInputChange}
        onFocus={this.handleInputClick}
      />
    );

    if (target === 'icon') {
      // const iconProps = pick(this.props, ['icon']);
      dayPickerTargetComponent = (
        <IconButton
          // {...iconProps}
          icon="calendar"
          type="button"
          onClick={this.handleInputClick}
        />
      );
    }

    // TODO: we need to accept all types of values, ISOStrings, Dates, moments, etc. and arrays of those!
    const selectedDays = new Date(value);

    return (
      <Popover
        preferPlace="below"
        onOuterAction={this.handleInputClick}
        isOpen={this.state.isOpen}
        body={[(
          <Daypicker
            ref={(el) => { this.state.dayPicker = el; }}
            onDayClick={this.handleDayClick}
            selectedDays={selectedDays}
            // TODO: why do we spread props?
            {...this.props}
          />
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
  value: PropTypes.object,
};

export default DayPicker;
