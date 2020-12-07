
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntitiesRequest, updateEntityRequest } from '../../../../thunks/fetchEntities';
import Section from '../Shared/Section';
import PatientPreferencesForm from './PatientPreferencesForm';
import styles from './styles.scss';

class Unsubscribe extends Component {
  constructor(props) {
    super(props);
    this.updatePreferences = this.updatePreferences.bind(this);
  }

  componentDidMount() {
    const patientId = this.props.params.patient.id;
    this.props.fetchEntitiesRequest({
      id: 'fetchPatientPreferences',
      key: 'patients',
      url: `/my/patients/${patientId}/preferences`,
    });
  }

  updatePreferences(values) {
    const patientId = this.props.params.patient.id;
    this.props.updateEntityRequest({
      id: 'updatePatientPreferences',
      key: 'patients',
      url: `/my/patients/${patientId}/preferences`,
      values,
    });
  }

  render() {
    // If patient is pulled, display the form
    const initialValues = this.props.patient && this.props.patient.toJS().preferences;

    return (
      <div>
        <Section>
          <div className={styles.header}>Unsubscribe</div>
          <div className={styles.text}>Manage your communication preferences below.</div>
        </Section>
        {initialValues ? (
          <Section className={styles.formSection}>
            <PatientPreferencesForm
              onSubmit={this.updatePreferences}
              initialValues={initialValues}
            />
          </Section>
        ) : null}
      </div>
    );
  }
}

Unsubscribe.propTypes = {
  patient: PropTypes.shape({
    toJS: PropTypes.func,
  }).isRequired,
  params: PropTypes.shape({
    patient: PropTypes.shape({ id: PropTypes.string }),
  }).isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
};

function mapStateToProps({ entities }, { params }) {
  const patientId = params.patient.id;
  const patient = entities.getIn(['patients', 'models', patientId]);
  return { patient };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntitiesRequest,
      updateEntityRequest,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Unsubscribe);
