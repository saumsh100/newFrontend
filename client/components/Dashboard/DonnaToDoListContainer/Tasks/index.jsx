
import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { SContainer, SHeader, SBody } from '../../../library';
import AppointmentReminders from './AppointmentReminders';
import ReviewsRequests from './ReviewsRequests';
import PatientRecalls from './PatientRecalls';
import styles from './styles.scss';

const toDoListNames = [
  'Appointment Reminders',
  'Patient Recalls',
  'Review Requests',
  'Referral Requests',
  'Referral Follow Ups',
  'Waitlist Queue',
];

const AppointmentRemindersHeader = () => (
  <SHeader className={styles.header}>
    <div className={styles.avatar} />
    <div className={styles.col}>Contact</div>
    <div className={styles.smallCol}>Type</div>
    <div className={styles.col}>Patient</div>
    <div className={styles.col}>Appointment</div>
  </SHeader>
);

const PatientRecallsHeader = () => (
  <SHeader className={styles.header}>
    <div className={styles.avatar} />
    <div className={styles.col}>Contact</div>
    <div className={styles.mediumCol}>Type</div>
    <div className={styles.col}>Due for Hygiene</div>
    <div className={styles.col}>Due for Recall</div>
  </SHeader>
);

const ReviewRequestHeader = () => (
  <SHeader className={styles.header}>
    <div className={styles.avatar} />
    <div className={styles.col}>Contact</div>
    <div className={styles.smallCol}>Channel</div>
    <div className={styles.col}>Appointment</div>
  </SHeader>
);

const getCurrentTaskList = ({ toDoIndex, loadingToDos, reminders, reviews, recalls, timezone }) => {
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
      body: <ReviewsRequests reviews={reviews.toJS()} timezone={timezone} />,
    };
  }

  return {
    count: 0,
    header: <SHeader className={styles.header} />,
    body: <div className={styles.noReminders}>No {toDoListNames[toDoIndex]}</div>,
  };
};

export default function Tasks({ toDoIndex, loadingToDos, reminders, reviews, recalls, timezone }) {
  if (loadingToDos) {
    return null;
  }

  const { count, header, body } = getCurrentTaskList({
    toDoIndex,
    loadingToDos,
    reminders,
    reviews,
    recalls,
    timezone,
  });

  return (
    <SContainer className={styles.container}>
      <SHeader className={styles.countHeader}>
        <span className={styles.countHeader_count}>
          {count}
          &nbsp;
        </span>{' '}
        {toDoListNames[toDoIndex]}
      </SHeader>
      {header}
      <SBody className={styles.body}>{body}</SBody>
    </SContainer>
  );
}

Tasks.propTypes = {
  reminders: PropTypes.instanceOf(List),
  reviews: PropTypes.instanceOf(List),
  recalls: PropTypes.instanceOf(List),
  toDoIndex: PropTypes.number,
  loadingToDos: PropTypes.bool,
  timezone: PropTypes.string.isRequired,
};

Tasks.defaultProps = {
  reminders: List,
  reviews: List,
  recalls: List,
  toDoIndex: 0,
  loadingToDos: false,
};
