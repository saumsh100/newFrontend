
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Field, IconButton } from '../../library';
import styles from '../styles.scss';

class HeaderUserDate extends Component {
  render() {
    const { user, dashboardDate, setDashboardDate } = this.props;

    const dateTheme = {
      group: styles.inputGroup,
      filled: styles.inputFilled,
    };

    const userDisplay = user === '' ? 'Welcome Back!' : `Welcome Back, ${user}`;

    return (
      <div className={styles.header}>
        <div className={styles.userName}>{userDisplay}</div>
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
              refCallBack={(input) => {
                this.inputNode = input;
                return null;
              }}
            />
          </Form>
          <div className={styles.dateIconContainer}>
            <IconButton
              type="solid"
              icon="calendar"
              onClick={() => this.inputNode.focus()}
              className={styles.iconColor}
            />
          </div>
        </div>
      </div>
    );
  }
}

HeaderUserDate.propTypes = {
  user: PropTypes.string,
  dashboardDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  setDashboardDate: PropTypes.func.isRequired,
};

HeaderUserDate.defaultProps = {
  user: '',
};

export default HeaderUserDate;
