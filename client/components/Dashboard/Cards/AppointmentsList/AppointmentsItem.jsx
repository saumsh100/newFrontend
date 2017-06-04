import React, { Component, PropTypes } from 'react';
import { ListItem } from '../../../library'

class AppointmentsItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      appointment,
      service,
      patient,
      practitioner,
    } = this.props;
    return (
      <ListItem>
        {patient.firstName}
        {service.name}
        {practitioner.firstName}
      </ListItem>
    );
  }

}

export default AppointmentsItem;
