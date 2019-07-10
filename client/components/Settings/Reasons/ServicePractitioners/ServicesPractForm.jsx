
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';
import isEqual from 'lodash/isEqual';
import { Header, Button } from '../../../library';
import MultiSelect from '../../../library/ui-kit/MultiSelect';
import styles from '../styles.scss';

class ServicesPractForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItems: props.practitionerIds.toArray(),
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(values) {
    const sortedValues = values.sort();
    if (!isEqual(this.state.selectedItems, sortedValues)) {
      this.setState({ selectedItems: sortedValues });
    }
  }

  render() {
    const { practitioners, practitionerIds, handleSubmit } = this.props;
    if (practitioners.size === 0 || !practitionerIds) return null;
    const mappedPractitioners = practitioners.toArray().map(practitioner => ({
      value: practitioner.get('id'),
      label: practitioner.getPrettyName(),
    }));
    return (
      <div>
        <Header
          className={styles.header}
          title="Practitioners Performing This Reason"
          contentHeader
        />
        <div className={styles.servicesPractForm}>
          <MultiSelect
            onChange={this.handleChange}
            options={mappedPractitioners}
            placeholder="Select practitioners"
            selected={this.state.selectedItems}
          />
          <Button
            className={styles.saveButton}
            disabled={isEqual(this.state.selectedItems, this.props.practitionerIds.toArray())}
            onClick={() => handleSubmit(this.state.selectedItems)}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
}

ServicesPractForm.propTypes = {
  practitioners: PropTypes.instanceOf(Map),
  practitionerIds: PropTypes.oneOfType([
    PropTypes.instanceOf(List),
    PropTypes.arrayOf(PropTypes.string),
  ]),
  handleSubmit: PropTypes.func.isRequired,
};

ServicesPractForm.defaultProps = {
  practitionerIds: null,
  practitioners: null,
};

export default ServicesPractForm;
