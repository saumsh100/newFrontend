import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Field, IconButton } from '../../library';
import styles from '../styles';

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
    this.props.setDashboardDate(value);
  }

  render() {
    const { user } = this.props;
    const dateTheme = {
      group: styles.inputGroup,
      filled: styles.inputFilled,
      dayPicker: styles.dateInputRow,
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
            enableReinitialize
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
              timezone={this.props.timezone}
              dashboardDayPicker
              iconComponent={
                <div className={styles.dateIconContainer}>
                  <IconButton
                    iconType="solid"
                    icon="calendar-alt"
                    onClick={this.handleFocus}
                    className={styles.iconColor}
                  />
                </div>
              }
            />
          </Form>
        </div>
      </div>
    );
  }
}

HeaderUserDate.propTypes = {
  user: PropTypes.string,
  dashboardDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
  setDashboardDate: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
};

HeaderUserDate.defaultProps = {
  user: '',
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(HeaderUserDate);
