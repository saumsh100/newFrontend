
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Toggle } from '../../../../library';
import styles from '../../styles.scss';

class PractitionerActive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: '',
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentWillMount() {
    const { practitioner } = this.props;
    const activeValue = practitioner ? practitioner.get('isActive') : null;
    const active = activeValue ? 'yes' : 'no';
    this.setState({ active });
  }

  handleToggle(e) {
    e.stopPropagation();
    const { active } = this.state;
    const { practitioner, updatePractitioner } = this.props;

    const modifiedPractitioner =
      active === 'no'
        ? practitioner.set('isActive', true)
        : practitioner.set('isActive', false);

    const alert = {
      success: {
        body: `${practitioner.get('firstName')} status updated.`,
      },
      error: {
        body: `${practitioner.get('firstName')} status update failed.`,
      },
    };

    updatePractitioner(modifiedPractitioner, alert);

    const newValue = active === 'no' ? 'yes' : 'no';
    this.setState({ active: newValue });
  }

  render() {
    const { practitioner } = this.props;

    return (
      <div className={styles.practitionerActive}>
        <span className={styles.practitionerActive_text}>
          {' '}
          Active Practitioner{' '}
        </span>
        <div className={styles.practitionerActive_toggle}>
          <Toggle
            defaultChecked={practitioner.get('isActive')}
            value={this.state.value}
            onChange={this.handleToggle}
          />
        </div>
      </div>
    );
  }
}

PractitionerActive.propTypes = {
  practitioner: PropTypes.object,
  updatePractitioner: PropTypes.func,
};

export default PractitionerActive;
