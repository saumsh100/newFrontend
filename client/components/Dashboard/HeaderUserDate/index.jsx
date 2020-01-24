
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Form, Field, IconButton } from '../../library';
import styles from '../styles.scss';

class HeaderUserDate extends Component {
  constructor(props) {
    super(props);
    this.inputNode = createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleFocus() {
    this.inputNode.current.focus();
  }

  handleChange(value) {
    const newDate = moment(value).toISOString();
    this.props.setDashboardDate(newDate);
  }

  render() {
    const { user } = this.props;
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
            ignoreSaveButton
            form="dashboardDate"
            onSubmit={() => {}}
            initialValues={{
              date: this.props.dashboardDate,
            }}
          >
            <Field
              component="DayPicker"
              name="date"
              label="Date"
              tipSize={0.01}
              theme={dateTheme}
              refCallBack={this.inputNode}
              onChange={(event, newValue) => {
                this.handleChange(newValue);
              }}
            />
          </Form>
          <div className={styles.dateIconContainer}>
            <IconButton
              iconType="solid"
              icon="calendar"
              onClick={this.handleFocus}
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
  dashboardDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
  setDashboardDate: PropTypes.func.isRequired,
};

HeaderUserDate.defaultProps = {
  user: '',
};

export default HeaderUserDate;
