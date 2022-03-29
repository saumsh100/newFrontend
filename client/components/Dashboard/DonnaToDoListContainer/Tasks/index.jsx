import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { SContainer, SHeader, SBody } from '../../../library';
import AppointmentReminders from './AppointmentReminders';
import ReviewsRequests from './ReviewsRequests';
import PatientRecalls from './PatientRecalls';
import styles from '../../styles';
import Account from '../../../../entities/models/Account';

const toDoListNames = [
  'Appointment Reminders',
  'Patient Recalls',
  'Review Requests',
  'Waitlist Queue',
];

const AppointmentRemindersHeader = () => (
  <SHeader className={styles.tasks_header}>
    <div className={styles.tasks_avatar} />
    <div className={styles.tasks_col}>Contact</div>
    <div className={styles.tasks_smallCol}>Type</div>
    <div className={styles.tasks_col}>Patient</div>
    <div className={styles.tasks_col}>Appointment</div>
  </SHeader>
);

const PatientRecallsHeader = () => (
  <SHeader className={styles.tasks_header}>
    <div className={styles.tasks_avatar} />
    <div className={styles.tasks_col}>Contact</div>
    <div className={styles.tasks_mediumCol}>Type</div>
    <div className={styles.tasks_col}>Due for Hygiene</div>
    <div className={styles.tasks_col}>Due for Recall</div>
  </SHeader>
);

const ReviewRequestHeader = () => (
  <SHeader className={styles.tasks_header}>
    <div className={styles.tasks_avatar} />
    <div className={styles.tasks_col}>Contact</div>
    <div className={styles.tasks_smallCol}>Channel</div>
    <div className={styles.tasks_col}>Appointment</div>
  </SHeader>
);

const getCurrentTaskList = ({
  toDoIndex,
  loadingToDos,
  account,
  reminders,
  reviews,
  recalls,
  timezone,
}) => {
  if (toDoIndex === 0 && reminders && reminders.size) {
    return {
      count: reminders.size,
      header: <AppointmentRemindersHeader />,
      body: <AppointmentReminders reminders={reminders.toJS()} timezone={timezone} />,
    };
  }

  if (toDoIndex === 1 && recalls && recalls.size && !loadingToDos) {
    return {
      count: recalls.size,
      header: <PatientRecallsHeader />,
      body: <PatientRecalls recalls={recalls.toJS()} timezone={timezone} />,
    };
  }

  if (toDoIndex === 2 && reviews && reviews.size) {
    return {
      count: reviews.size,
      header: <ReviewRequestHeader />,
      body: (
        <ReviewsRequests
          reviewsChannels={account.get('reviewsChannels')}
          reviews={reviews.toJS()}
          timezone={timezone}
        />
      ),
    };
  }

  return {
    count: 0,
    header: <SHeader className={styles.tasks_header} />,
    body: <div className={styles.tasks_noReminders}>No {toDoListNames[toDoIndex]}</div>,
  };
};

export default function Tasks({
  account,
  toDoIndex,
  loadingToDos,
  reminders,
  reviews,
  recalls,
  timezone,
}) {
  if (loadingToDos) {
    return null;
  }

  const { count, header, body } = getCurrentTaskList({
    toDoIndex,
    loadingToDos,
    account,
    reminders,
    reviews,
    recalls,
    timezone,
  });

  return (
    <SContainer className={styles.tasks_container}>
      <SHeader className={styles.tasks_countHeader}>
        <span className={styles.tasks_countHeader_count}>
          {count}
          &nbsp;
        </span>{' '}
        {toDoListNames[toDoIndex]}
      </SHeader>
      {header}
      <SBody className={styles.tasks_body}>{body}</SBody>
    </SContainer>
  );
}

Tasks.propTypes = {
  reminders: PropTypes.instanceOf(List),
  reviews: PropTypes.instanceOf(List),
  recalls: PropTypes.instanceOf(List),
  toDoIndex: PropTypes.number,
  loadingToDos: PropTypes.bool,
  account: PropTypes.instanceOf(Account).isRequired,
  timezone: PropTypes.string.isRequired,
};

Tasks.defaultProps = {
  reminders: List,
  reviews: List,
  recalls: List,
  toDoIndex: 0,
  loadingToDos: false,
};
