
import React, { Component, PropTypes } from 'react';
import Popover from 'react-popover';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import DayPickerStyles from './styles.css';
import Input from '../Input';

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDay: null,
      isOpen: false,
    };

    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleDayClick(day, { selected }) {
    this.props.onChange(day);
    this.setState({
      selectedDay: selected ? undefined : day,
      isOpen: false,
      dayPicker: null,
    });
  }

  componentWillMount() {
    const { value } = this.props;

    if (value) {
      this.setState({
        selectedDay: value,
      })
    }
  }

  handleInputClick(e) {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  handleInputChange(e) {
    const { value } = e.target;
    const momentDay = moment(value, 'L', true);

    if (momentDay.isValid()) {
      this.props.onChange(value);
      this.setState({
        selectedDay: momentDay.toDate(),
      }, () => {
        this.state.dayPicker.showMonth(this.state.selectedDay);
      });
    } else {
      this.props.onChange(value);
      this.setState({ selectedDay: null });
    }
  }

  render() {
    const {
      value,
      onChange,
    } = this.props;

    return (
      <Popover
        preferPlace="below"
        tipSize={12}
        onOuterAction={this.handleInputClick}
        isOpen={this.state.isOpen}
        body={[(
          <DayPicker
            ref={(el) => { this.state.dayPicker = el; }}
            onDayClick={this.handleDayClick}
            selectedDays={this.state.selectedDay}
          />
        )]}
      >
        <Input
          {...this.props}
          onChange={this.handleInputChange}
          onFocus={this.handleInputClick}
          disabled={this.state.isOpen}
        />
      </Popover>
    );
  }

}

export default Calendar;
