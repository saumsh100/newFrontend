
import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import findIndex from 'lodash/findIndex';
import ConfigurationItem from './ConfigurationItem';
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
    };

    this.onUpdateConfiguration = this.onUpdateConfiguration.bind(this);
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    return axios.get('/api/accounts/configurations', headersConfig)
      .then(({ data }) => {
        this.setState({
          isLoading: false,
          configurations: data.data,
        });
      })
      .catch(err => console.error('Failed to load configs', err));
  }

  onUpdateConfiguration(configuration) {
    return axios.put('/api/accounts/configurations', configuration,headersConfig)
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
    const { configurations } = this.state;
    return (
      <div className={styles.advancedWrapper}>
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
