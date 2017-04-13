
import React, { Component, PropTypes } from 'react';
import Popover from 'react-popover';
import moment from 'moment';
import { pick } from 'lodash';
import Daypicker, { DateUtils } from 'react-day-picker';
import DayPickerStyles from './styles.css';
import Input from '../Input';
import Icon from '../Icon';
import styles from './styles.scss';

class DayPicker extends Component {
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
    this.props.onChange(moment(day).format('L'));
    this.setState({
      selectedDay: selected ? undefined : day,
      isOpen: false,
      dayPicker: null,
    });
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
      target
    } = this.props;

    let dayPickerTargetComponent = (
      <Input
        {...this.props}
        onChange={this.handleInputChange}
        onFocus={this.handleInputClick}
      />
    );

    if (target === 'icon') {
      const iconProps = pick(this.props, ['icon']);
      dayPickerTargetComponent = (
        <Icon
          {...iconProps}
          onClick={this.handleInputClick}
        />
      );
    }

    return (
      <Popover
        preferPlace="left"
        onOuterAction={this.handleInputClick}
        isOpen={this.state.isOpen}
        body={[(
          <Daypicker
            ref={(el) => { this.state.dayPicker = el; }}
            onDayClick={this.handleDayClick}
            selectedDays={this.state.selectedDay}
            className={styles.dayPickerContainer}
          />
        )]}
      >
        {dayPickerTargetComponent}
      </Popover>
    );
  }
}

export default DayPicker;
