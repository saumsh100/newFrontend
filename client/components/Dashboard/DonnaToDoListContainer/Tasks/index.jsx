
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  SContainer,
  SHeader,
  SBody,
} from '../../../library';
import AppointmentReminders from './AppointmentReminders';
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
    } = this.props;

    let header = <SHeader className={styles.header} />;

    let body = loadingToDos ? null : (
      <div className={styles.noReminders}>
        No {toDoListNames[toDoIndex]}
      </div>
    );

    if (this.props.reminders && this.props.reminders.size && !loadingToDos) {
      const reminders = this.props.reminders.toJS();

      if (toDoIndex === 0) {
        header = defaultHeaderTemplate();

        body = <AppointmentReminders reminders={reminders} />;
      }
    }

    return (
      <SContainer className={styles.container}>
        <SHeader className={styles.countHeader}>
          <span className={styles.countHeader_count}>{this.props.reminders.size || 0}&nbsp;</span> {toDoListNames[toDoIndex]}
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
  toDoIndex: PropTypes.number,
};

export default Tasks;
