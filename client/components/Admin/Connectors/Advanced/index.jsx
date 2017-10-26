
import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import {
  Button,
  DialogBox,
  List,
  ListItem,
} from '../../../library';
import ConfigurationItem from './ConfigurationItem';
import Outbox from '../Outbox';
import styles from './styles.scss';

const headersConfig = {
  headers: {
    'Accept': 'application/vnd.api+json',
  },
};

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

      isDonnaOutboxOpen: false,
    };

    this.onUpdateConfiguration = this.onUpdateConfiguration.bind(this);
    this.toggleDonnaOutbox = this.toggleDonnaOutbox.bind(this);
  }

  componentWillMount() {
    this.setState({ isLoading: true });

    const { account } = this.props;
    return Promise.all([
        axios.get(`/api/accounts/${account.id}/configurations`, headersConfig),
      ])
      .then(([{ data }]) => {
        this.setState({
          isLoading: false,
          configurations: data.data,
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

  toggleDonnaOutbox() {
    this.setState({
      isDonnaOutboxOpen: !this.state.isDonnaOutboxOpen,
    });
  }

  render() {
    const { account } = this.props;
    const { configurations, recalls, reminders, reviews } = this.state;
    return (
      <div className={styles.advancedWrapper}>
        <Button
          onClick={this.toggleDonnaOutbox}
        >
          View Donna's Outbox
        </Button>
        {this.state.isDonnaOutboxOpen ?
          <DialogBox
            className={styles.outboxDialog}
            title={`Donna's Outbox for ${account.name}`}
            active={this.state.isDonnaOutboxOpen}
            onEscKeyDown={this.toggleDonnaOutbox}
            onOverlayClick={this.toggleDonnaOutbox}
            actions={[
              {
                onClick: this.toggleDonnaOutbox,
                label: 'Close',
                component: Button,
                props: { color: 'darkgrey' },
              },
            ]}
          >
            <Outbox account={account} />
          </DialogBox>
        : null}

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
