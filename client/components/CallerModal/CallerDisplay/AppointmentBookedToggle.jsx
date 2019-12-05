
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Toggle } from '../../library';
import styles from '../styles.scss';

class AppointmentBookedToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wasApptBookedValue: '',
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { call } = this.props;
    const wasApptBooked = call ? call.wasApptBooked : null;
    const wasApptBookedValue = wasApptBooked ? 'yes' : 'no';
    this.setState({ wasApptBookedValue });
  }

  handleToggle(e) {
    e.stopPropagation();
    const { wasApptBookedValue } = this.state;
    const { call, updateEntityRequest } = this.props;

    const modifiedCall =
      wasApptBookedValue === 'no'
        ? call.set('wasApptBooked', true)
        : call.set('wasApptBooked', false);

    const alert = {
      success: {
        body: 'Appointment Information Updated.',
      },
      error: {
        body: 'Appointment Update Failed.',
      },
    };

    updateEntityRequest({ key: 'calls',
      model: modifiedCall,
      alert });

    const newValue = wasApptBookedValue === 'no' ? 'yes' : 'no';
    this.setState({ wasApptBookedValue: newValue });
  }

  render() {
    const { call } = this.props;

    return (
      <div className={styles.toggleContainer}>
        <span className={styles.toggleContainer_text}> Was Appointment Booked? </span>
        <div className={styles.toggleContainer_toggle}>
          <Toggle
            defaultChecked={call.wasApptBooked}
            value={this.state.wasApptBookedValue}
            onChange={this.handleToggle}
          />
        </div>
      </div>
    );
  }
}

AppointmentBookedToggle.propTypes = {
  call: PropTypes.object,
  updateEntityRequest: PropTypes.func,
};

export default AppointmentBookedToggle;
