
import React, { Component, PropTypes } from 'react';
import DisplayForm from './DisplayForm';
import styles from './styles.scss';

class AddNewAppointment extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    console.log(values);
  }

  render() {
    return (
      <div className={styles.addNewAppt}>
        <DisplayForm
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default AddNewAppointment;
