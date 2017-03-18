import React, { PropTypes } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import DayPickerStyles from './styles.css';

export default function Calendar(props) {

  return (
    <DayPicker
      styles={DayPickerStyles}
      {...props}
    />
  );
}

