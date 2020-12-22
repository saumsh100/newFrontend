
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { List, Loading } from '../../library';
import styles from './styles.scss';
import { httpClient } from '../../../util/httpClient';
import { accountShape } from '../../library/PropTypeShapes';
import OutboxItem from '../OutboxItem';
import DonnaReminder from './DonnaReminder';

export default class OutboxReminders extends Component {
  constructor(props) {
    super(props);

    // Using state because configurations are not supported
    this.state = {
      isLoading: true,
      reminders: [],
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { account, isDonna } = this.props;
    const link = `/api/accounts/${account.id}/reminders/${isDonna ? 'outbox' : 'list'}`;
    return Promise.all([httpClient().get(link)])
      .then(([remindersData]) => {
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

    if (this.props.isDonna) {
      return (
        <div className={styles.remindersWrapper}>
          {!reminders.length ? (
            <div>No Reminders</div>
          ) : (
            <div>
              <List>
                {reminders.map(item => (
                  <DonnaReminder key={`${item.patient.appointment.id}_reminder`} data={item} />
                ))}
              </List>
            </div>
          )}
        </div>
      );
    }
    let totalSuccess = 0;
    let totalErrors = 0;
    reminders.forEach((r) => {
      totalSuccess += r.success.length;
      totalErrors += r.errors.length;
    });
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
                <OutboxItem
                  key={reminder.id}
                  data={reminder}
                  styles={styles}
                  dateFormat="h:mma MMM Do, YYYY"
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
  account: PropTypes.shape(accountShape).isRequired,
  isDonna: PropTypes.bool,
};

OutboxReminders.defaultProps = {
  isDonna: false,
};
