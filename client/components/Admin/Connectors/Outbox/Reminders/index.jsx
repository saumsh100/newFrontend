
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import { List, ListItem, Loading, Grid, Row, Col } from '../../../../library';
import styles from './styles.scss';
import { httpClient } from '../../../../../util/httpClient';

const getAttrFromPatient = (patient, primaryType) => {
  const attrs = {
    sms: 'mobilePhoneNumber',
    phone: 'mobilePhoneNumber',
    email: 'email',
  };

  return patient[attrs[primaryType]];
};

function SuccessfulList({ success }) {
  return (
    <div className={styles.successList}>
      {success.map(({ patient, primaryType, reminder }) => {
        const reminderAppt = patient.appointment;
        const reminderApptDate = moment(reminderAppt.startDate).format('h:mma MMM Do, YYYY');
        return (
          <Grid className={styles.successItemWrapper}>
            <Row>
              <Col xs={4}>
                {patient.firstName} {patient.lastName}
              </Col>
              <Col xs={4}>{getAttrFromPatient(patient, primaryType)}</Col>
              <Col xs={4}>{reminderApptDate}</Col>
            </Row>
          </Grid>
        );
      })}
    </div>
  );
}

class ReminderListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  toggleExpanded() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { reminder } = this.props;
    return (
      <div className={styles.listItemWrapper}>
        <ListItem className={styles.listItem} onClick={this.toggleExpanded}>
          <div className={styles.col}>Type: {reminder.primaryType}</div>
          <div className={styles.col}>Length: {reminder.lengthSeconds}</div>
          <div className={styles.col}>Success: {reminder.success.length}</div>
          <div className={styles.col}>Fail: {reminder.errors.length}</div>
        </ListItem>
        {this.state.expanded ? (
          <SuccessfulList success={reminder.success} primaryType={reminder.primaryType} />
        ) : null}
      </div>
    );
  }
}

export default class OutboxReminders extends Component {
  constructor(props) {
    super(props);

    // Using state because configurations are not supported
    this.state = {
      isLoading: true,
      reminders: [],
      selectedReminder: null,
    };
  }

  UNSAFE_componentWillMount() {
    const { account } = this.props;
    return Promise.all([httpClient().get(`/api/accounts/${account.id}/reminders/list`)])
      .then(([remindersData]) => {
        console.log('remindersData', remindersData);
        this.setState({
          isLoading: false,
          reminders: remindersData.data,
        });
      })
      .catch(err => console.error('Failed to load configs', err));
  }

  render() {
    const { account } = this.props;
    const { reminders, isLoading } = this.state;

    let totalSuccess = 0;
    let totalErrors = 0;
    reminders.forEach((r) => {
      totalSuccess += r.success.length;
      totalErrors += r.errors.length;
    });

    if (isLoading) {
      return (
        <div className={styles.loadingWrapper}>
          <Loading />
        </div>
      );
    }

    return (
      <div className={styles.remindersWrapper}>
        {!reminders.length ? (
          <div>No Reminders</div>
        ) : (
          <div>
            <h4>Total Success: {totalSuccess}</h4>
            <h4>Total Errors: {totalErrors}</h4>
            <List>
              {reminders.map(reminder => (
                <ReminderListItem key={reminder.id} reminder={reminder} />
              ))}
            </List>
          </div>
        )}
      </div>
    );
  }
}

OutboxReminders.propTypes = {
  account: PropTypes.object.isRequired,
};
