
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Form,
  Field,
  Icon,
} from '../../library';
import styles from '../styles.scss';

export default function HeaderUserDate({ user, dashboardDate, setDashboardDate }) {
  const dateTheme = {
    group: styles.inputGroup,
    filled: styles.inputFilled,
  };

  const userDisplay = user === '' ? 'Welcome Back!' : `Welcome Back, ${user}`;

  return (
    <div className={styles.header}>
      <div className={styles.userName}>
        {userDisplay}
      </div>
      <div className={styles.dateInput}>
        <Form
          form="Dashboard Date"
          onChange={(values) => {
            setDashboardDate(values.date);
          }}
          ignoreSaveButton
          initialValues={{
            date: dashboardDate,
          }}
        >
          <Field
            component="DayPicker"
            name="date"
            label="Date"
            multiple={false}
            tipSize={0.01}
            theme={dateTheme}
          />
        </Form>
        <div className={styles.dateIconContainer}>
          <Icon icon="calendar" />
        </div>
      </div>
    </div>
  );
}

HeaderUserDate.propTypes = {
  user: PropTypes.string,
  dashboardDate: PropTypes.instanceOf(Date),
  setDashboardDate: PropTypes.func,
};
