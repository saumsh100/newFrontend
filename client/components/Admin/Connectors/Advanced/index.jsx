
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, DialogBox, Loading } from '../../../library';
import ConfigurationItem from './ConfigurationItem';
import Outbox from '../Outbox';
import DonnasOutbox from '../../../DonnasOutbox';
import styles from './styles.scss';
import { httpClient } from '../../../../util/httpClient';
import accountShape from '../../../library/PropTypeShapes/accountShape';

const headersConfig = {
  headers: {
    Accept: 'application/vnd.api+json',
  },
};

export default class Advanced extends Component {
  constructor(props) {
    super(props);

    // Using state because configurations are not supported
    this.state = {
      isLoading: false,
      configurations: [],
      isDonnaOutboxOpen: false,
      isDonnaTODOListOpen: false,
    };

    this.onUpdateConfiguration = this.onUpdateConfiguration.bind(this);
    this.toggleDonnaOutbox = this.toggleDonnaOutbox.bind(this);
    this.toggleDonnaTODOList = this.toggleDonnaTODOList.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.setState({ isLoading: true });

    const { account } = this.props;
    return Promise.all([
      httpClient().get(`/api/accounts/${account.id}/configurations`, headersConfig),
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
    return httpClient()
      .put(`/api/accounts/${account.id}/configurations`, configuration, headersConfig)
      .then(({ data }) => {
        const newConfig = data.data;
        const { configurations } = this.state;
        const index = configurations.findIndex(
          c => c.attributes.name === newConfig.attributes.name,
        );
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

  toggleDonnaTODOList() {
    this.setState({
      isDonnaTODOListOpen: !this.state.isDonnaTODOListOpen,
    });
  }

  render() {
    const { account } = this.props;
    const { configurations, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className={styles.loadingWrapper}>
          <Loading />
        </div>
      );
    }

    return (
      <div className={styles.advancedWrapper}>
        <Button onClick={this.toggleDonnaOutbox}>View Donna&apos;s Outbox</Button>
        {this.state.isDonnaOutboxOpen ? (
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
        ) : null}

        <Button onClick={this.toggleDonnaTODOList}>View Donna&apos;s TODO List</Button>
        {this.state.isDonnaTODOListOpen ? (
          <DialogBox
            className={styles.outboxDialog}
            title={`Donna's TODO List for ${account.name}`}
            active={this.state.isDonnaTODOListOpen}
            onEscKeyDown={this.toggleDonnaTODOList}
            onOverlayClick={this.toggleDonnaTODOList}
            actions={[
              {
                onClick: this.toggleDonnaTODOList,
                label: 'Close',
                component: Button,
                props: { color: 'darkgrey' },
              },
            ]}
          >
            <DonnasOutbox account={account} />
          </DialogBox>
        ) : null}

        <h3>Configurations</h3>
        {configurations.map(config => (
          <ConfigurationItem
            key={config.id}
            configuration={config}
            account={account}
            onUpdateConfiguration={this.onUpdateConfiguration}
          />
        ))}
      </div>
    );
  }
}

Advanced.propTypes = {
  account: PropTypes.shape(accountShape).isRequired,
};
