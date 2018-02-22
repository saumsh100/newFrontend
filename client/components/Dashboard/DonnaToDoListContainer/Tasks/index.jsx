
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  SContainer,
  SHeader,
  SBody,
} from '../../../library';
import AppointmentReminders from './AppointmentReminders';
import PatientRecalls from './PatientRecalls';
import styles from './styles.scss';

const toDoListNames = [
  'Appointment Reminders',
  'Patient Recalls',
  'Review Requests',
  'Referral Requests',
  'Online Directories',
  'Surveys',
];

const defaultHeaderTemplate = () => {
  return (
    <SHeader className={styles.header}>
      <div className={styles.avatar}>{''}</div>
      <div className={styles.smallCol}>Task</div>
      <div className={styles.smallCol}>Scheduled</div>
      <div className={styles.col}>Name</div>
      <div className={styles.col}>Appointment</div>
      <div className={styles.smallCol}>Confirmed</div>
    </SHeader>
  );
};

class Tasks extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      toDoIndex,
      loadingToDos,
      reminders,
      recalls,
    } = this.props;

    let count = 0;
    let header = <SHeader className={styles.header} />;

    let body = loadingToDos ? null : (
      <div className={styles.noReminders}>
        No {toDoListNames[toDoIndex]}
      </div>
    );

    if (toDoIndex === 0 && reminders && reminders.size && !loadingToDos) {
      count = reminders.size;
      body = <AppointmentReminders reminders={reminders.toJS()} />;
      header = defaultHeaderTemplate();
    } else if (toDoIndex === 1 && recalls && recalls.size && !loadingToDos) {
      count = recalls.size;
      body = <PatientRecalls recalls={recalls.toJS()} />;
      header = (
        <SHeader className={styles.header}>
          <div className={styles.avatar}>{''}</div>
          <div className={styles.mediumCol}>Type</div>
          <div className={styles.smallCol}>Task</div>
          <div className={styles.smallCol}>Scheduled</div>
          <div className={styles.col}>Name</div>
          <div className={styles.col}>Due for Hygiene</div>
        </SHeader>
      );
    }

    return (
      <SContainer className={styles.container}>
        <SHeader className={styles.countHeader}>
          <span className={styles.countHeader_count}>{count}&nbsp;</span> {toDoListNames[toDoIndex]}
        </SHeader>
        {header}
        <SBody className={styles.body}>
          {body}
        </SBody>
      </SContainer>
    );
  }
}

Tasks.propTypes = {
  reminders: PropTypes.object,
  recalls: PropTypes.object,
  toDoIndex: PropTypes.number,
};

export default Tasks;
