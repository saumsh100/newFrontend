
import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  List,
  ListItem,
  Tab,
  Tabs,
  Loading,
  Grid,
  Row,
  Col,
} from '../../library';
import styles from './styles.scss';

class ReminderListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    const { patient, primaryTypes, sendDate } = data;
    const { appointment } = patient;
    return (
      <ListItem>
        <Grid>
          <Row>
            <Col xs={3}>{primaryTypes.join('&')}</Col>
            <Col xs={3}>{moment(sendDate).format('h:mma')}</Col>
            <Col xs={3}>{`${patient.firstName} ${patient.lastName}`}</Col>
            <Col xs={3}>
              {moment(appointment.startDate).format('dddd, MMMM Do h:mma')}
            </Col>
          </Row>
        </Grid>
      </ListItem>
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

  componentWillMount() {
    const { account } = this.props;
    return Promise.all([
      axios.get(`/api/accounts/${account.id}/reminders/outbox`),
    ])
      .then(([remindersData]) => {
        console.log('outboxData', remindersData);
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
            <List>
              {reminders.map(item => (
                <ReminderListItem
                  key={`${item.patient.appointment.id}_reminder`}
                  data={item}
                />
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
