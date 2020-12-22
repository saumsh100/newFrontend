
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Tab, Tabs } from '../library';
import OutboxReminders from '../Outbox/Reminders';
import OutboxRecalls from '../Outbox/Recalls';
import OutboxReviews from '../Outbox/Reviews';
import styles from './styles.scss';
import { accountShape } from '../library/PropTypeShapes';

const power = bool => <div className={bool ? styles.on : styles.off} />;
const label = (title, bool) => (
  <div className={styles.label}>
    {title}
    {power(bool)}
  </div>
);

export default class Outbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(tabIndex) {
    this.setState({ tabIndex });
  }

  render() {
    const { account } = this.props;
    const { canSendReminders, canSendRecalls, canSendReviews } = account;

    return (
      <div className={styles.outboxWrapper}>
        <Tabs index={this.state.tabIndex} onChange={this.handleTabChange} className={styles.tabs}>
          <Tab label={label('Reminders', canSendReminders)}>
            <OutboxReminders account={account} isDonna />
          </Tab>
          <Tab label={label('Recalls', canSendRecalls)}>
            <OutboxRecalls account={account} />
          </Tab>
          <Tab label={label('Reviews', canSendReviews)}>
            <OutboxReviews account={account} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

Outbox.propTypes = {
  account: PropTypes.shape(accountShape).isRequired,
};
