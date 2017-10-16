
import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import ConfigurationItem from './ConfigurationItem';
import {
  List,
  ListItem,
} from '../../../library';
import styles from './styles.scss';

const headersConfig = {
  headers: {
    'Accept': 'application/vnd.api+json',
  },
};

function RemindersStats({ reminders }) {
  return (
    <List>
      {reminders.map((reminder) => {
        return (
          <ListItem key={reminder.id} className={styles.listItem}>
            <div className={styles.col}>Type: {reminder.primaryType}</div>
            <div className={styles.col}>Length: {reminder.lengthSeconds}</div>
            <div className={styles.col}>Success: {reminder.success}</div>
            <div className={styles.col}>Fail: {reminder.fail}</div>
          </ListItem>
        );
      })}
    </List>
  );
}

function RecallsStats({ recalls }) {
  return (
    <List>
      {recalls.map((recall) => {
        return (
          <ListItem key={recall.id} className={styles.listItem}>
            <div className={styles.col}>Type: {recall.primaryType}</div>
            <div className={styles.col}>Length: {recall.lengthSeconds}</div>
            <div className={styles.col}>Success: {recall.success}</div>
            <div className={styles.col}>Fail: {recall.fail}</div>
          </ListItem>
        );
      })}
    </List>
  );
}

function ReviewsStats({ reviews }) {
  return (
    <div>
      <div>Success: {reviews.success}</div>
      <div>Fail: {reviews.fail}</div>
    </div>
  );
}

export default class Advanced extends Component {
  constructor(props) {
    super(props);

    // Using state because configurations are not supported
    this.state = {
      isLoading: false,
      configurations: [],
      recalls: [],
      reminders: [],
      reviews: null,
    };

    this.onUpdateConfiguration = this.onUpdateConfiguration.bind(this);
  }

  componentWillMount() {
    this.setState({ isLoading: true });

    const { account } = this.props;
    return Promise.all([
        axios.get(`/api/accounts/${account.id}/configurations`, headersConfig),
        axios.get(`/api/accounts/${account.id}/reminders/stats`),
        axios.get(`/api/accounts/${account.id}/recalls/stats`),
        axios.get(`/api/accounts/${account.id}/reviews/stats`),
      ])
      .then(([{ data }, remindersData, recallsData, reviewsData]) => {
        console.log(reviewsData);
        this.setState({
          isLoading: false,
          configurations: data.data,
          recalls: recallsData.data,
          reminders: remindersData.data,
          reviews: reviewsData.data,
        });
      })
      .catch(err => console.error('Failed to load configs', err));
  }

  onUpdateConfiguration(configuration) {
    const { account } = this.props;
    return axios.put(`/api/accounts/${account.id}/configurations`, configuration,headersConfig)
      .then(({ data }) => {
        const newConfig = data.data;
        const { configurations } = this.state;
        const index = findIndex(configurations, c => c.attributes.name === newConfig.attributes.name);
        const newConfigurations = this.state.configurations.slice();
        newConfigurations[index] = newConfig;
        this.setState({ configurations: newConfigurations });
      })
      .catch(err => console.error('Failed to update config', err));
  }

  render() {
    const { account } = this.props;
    const { configurations, recalls, reminders, reviews } = this.state;
    return (
      <div className={styles.advancedWrapper}>
        <h3>Reminders</h3>
        {!reminders.length ? <div>No Reminders</div> :
          <RemindersStats
            reminders={reminders}
          />
        }
        <h3>Recalls</h3>
        {!recalls.length ? <div>No Recalls</div> :
          <RecallsStats
            recalls={recalls}
          />
        }
        <h3>Reviews</h3>
        {!reviews ? <div>No Reviews</div> :
          <ReviewsStats
            reviews={reviews}
          />
        }
        <h3>Configurations</h3>
        {configurations.map((config) => {
          return (
            <ConfigurationItem
              key={config.id}
              configuration={config}
              account={account}
              onUpdateConfiguration={this.onUpdateConfiguration}
            />
          );
        })}
      </div>
    );
  }
}

Advanced.propTypes = {
  account: PropTypes.object.isRequired,
};
