
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Toggle } from '../../../../library';
import Practitioner from '../../../../../entities/collections/practitioners';
import styles from '../../styles.scss';

class PractitionerActive extends Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(e) {
    e.stopPropagation();
    const { practitioner, updatePractitioner } = this.props;
    const isActive = !!practitioner.get('isActive');
    const modifiedPractitioner = practitioner.set('isActive', !isActive);

    const alert = {
      success: {
        body: `${practitioner.get('firstName')} status updated.`,
      },
      error: {
        body: `${practitioner.get('firstName')} status update failed.`,
      },
    };
    updatePractitioner(modifiedPractitioner, alert);
  }

  render() {
    const { practitioner } = this.props;
    return (
      <div className={styles.practitionerActive}>
        <span className={styles.practitionerActive_text}> Active Practitioner </span>
        <div className={styles.practitionerActive_toggle}>
          <Toggle checked={practitioner.get('isActive')} onChange={this.handleToggle} />
        </div>
      </div>
    );
  }
}

PractitionerActive.propTypes = {
  practitioner: PropTypes.instanceOf(Practitioner).isRequired,
  updatePractitioner: PropTypes.func.isRequired,
};

export default PractitionerActive;
