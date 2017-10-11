
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
      recalls: [],
    };

    this.onUpdateConfiguration = this.onUpdateConfiguration.bind(this);
  }

  componentWillMount() {
    this.setState({ isLoading: true });

    const { account } = this.props;
    return Promise.all([
        axios.get(`/api/accounts/${account.id}/configurations`, headersConfig),
        axios.get(`/api/accounts/${account.id}/recalls/stats`)
      ])
      .then(([{ data }, recallsData]) => {
        this.setState({
          isLoading: false,
          configurations: data.data,
          recalls: recallsData.data,
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
    const { configurations, recalls } = this.state;
    return (
      <div className={styles.advancedWrapper}>
        <h3>Recalls</h3>
        {!recalls.length ? <div>No Recalls</div> : null}
        {recalls.map((recall) => {
          return (
            <div>
              <div>Type: {recall.primaryType}</div>
              <div>Length: {recall.lengthSeconds}</div>
              <div>Success: {recall.success}</div>
              <div>Fail: {recall.fail}</div>
            </div>
          );
        })}
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
