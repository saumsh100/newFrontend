import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import DayPickerStyles from './styles.css';
import Input from '../Input';

class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDay: new Date(),
    }
    this.handleDayClick = this.handleDayClick.bind(this);
  }

  handleDayClick(day, { selected }) {
    this.props.onChange(day);
    this.setState({
      selectedDay: selected ? undefined : day,
   });
  }

  render() {
    const {
      value,
      onChange,
    } = this.props

    return (
      <DayPicker
        onDayClick={this.handleDayClick}
        selectedDays={this.state.selectedDay}
      />
    );
  }

}

export default Calendar;
