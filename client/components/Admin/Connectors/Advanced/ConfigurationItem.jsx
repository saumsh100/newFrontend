
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form, Field } from '../../../library';
import styles from './config-item.scss';

export default class ConfigurationItem extends Component {
  constructor(props) {
    super(props);

    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange({ value }) {
    const { account, configuration } = this.props;
    const { attributes } = configuration;
    const { name } = attributes;
    // Put together configuration object and call parent function
    if (
      window.confirm(`Are you sure you want to change ${name} in ${account.name}?`)
    ) {
      this.props.onUpdateConfiguration({ name, value });
    }
  }

  render() {
    const { account, configuration } = this.props;
    const { attributes } = configuration;
    const initialValues = { value: attributes.value };
    return (
      <div className={styles.configWrapper}>
        <div className={styles.name}>{attributes.name}</div>
        <div className={styles.description}>{attributes.description}</div>
        <Form
          initialValues={initialValues}
          onSubmit={this.handleValueChange}
          form={`account_configuration_${account.id}_${configuration.id}`}
        >
          <Field label="Value" name="value" />
        </Form>
      </div>
    );
  }
}

ConfigurationItem.propTypes = {
  account: PropTypes.object,
  configuration: PropTypes.object,
};
