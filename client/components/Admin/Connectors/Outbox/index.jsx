
import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import {
  List,
  ListItem,
  Tab,
  Tabs,
} from '../../../library';
import OutboxReminders from './Reminders';
import OutboxRecalls from './Recalls';
import OutboxReviews from './Reviews';
import styles from './styles.scss';

const power = bool => <div className={bool ? styles['on'] : styles['off']} />;
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
    const {
      canSendReminders,
      canSendRecalls,
      canSendReviews,
    } = account;

    return (
      <div className={styles.outboxWrapper}>
        <Tabs
          index={this.state.tabIndex}
          onChange={this.handleTabChange}
          className={styles.tabs}
        >
          <Tab label={label('Reminders', canSendReminders)}>
            <OutboxReminders account={account} />
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
  account: PropTypes.object.isRequired,
};
