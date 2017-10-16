import React, { Component, PropTypes } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import DayPickerStyles from './styles.scss';

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDay: null,
    };

    this.handleDayClick = this.handleDayClick.bind(this);
  }

  handleDayClick(day, { selected }) {
    this.setState({
      selectedDay: selected ? undefined : day,
      dayPicker: null,
    });
  }

  render() {
    return (
      <DayPicker
        onDayClick={this.handleDayClick}
        selectedDays={this.state.selectedDay}
        {...this.props}
      />
    );
  }
}

export default Calendar;
