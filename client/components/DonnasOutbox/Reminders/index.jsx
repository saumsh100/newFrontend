
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import { List, ListItem, Loading, Grid, Row, Col } from '../../library';
import styles from './styles.scss';
import { httpClient } from '../../../util/httpClient';

function ReminderListItem() {
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
          <Col xs={3}>{moment(appointment.startDate).format('dddd, MMMM Do h:mma')}</Col>
        </Row>
      </Grid>
    </ListItem>
  );
}

export default class OutboxReminders extends Component {
  constructor(props) {
    super(props);

    // Using state because configurations are not supported
    this.state = {
      isLoading: true,
      reminders: [],
    };
  }

  UNSAFE_componentWillMount() {
    const { account } = this.props;
    return Promise.all([httpClient().get(`/api/accounts/${account.id}/reminders/outbox`)])
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
                <ReminderListItem key={`${item.patient.appointment.id}_reminder`} data={item} />
              ))}
            </List>
          </div>
        )}
      </div>
    );
  }
}

OutboxReminders.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};
