import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntitiesRequest, updateEntityRequest } from '../../../../thunks/fetchEntities';
import Section from '../Shared/Section';
import PatientPreferencesForm from './PatientPreferencesForm';
import { Button } from '../../../library';
import styles from './styles.scss';

class Unsubscribe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
    };
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
    this.props
      .updateEntityRequest({
        id: 'updatePatientPreferences',
        key: 'patients',
        url: `/my/patients/${patientId}/preferences`,
        values,
      })
      .then(() => {
        this.setState({
          success: true,
        });
      })
      .catch((error) => console.log(error));
  }

  toggleForm() {
    this.setState((prevState) => ({
      success: !prevState.success,
    }));
  }

  renderSuccessMessage() {
    const {
      params: {
        account: { website },
      },
    } = this.props;

    return (
      <div>
        <Section>
          <div className={styles.header}>Email Preferences Updated</div>
          <div className={styles.text}>
            If you&apos;d like to review you communication preferences, <br />
            click on the button below.
          </div>
        </Section>
        <Section className={styles.actions}>
          <Button color="red" className={styles.preferenceButton} onClick={() => this.toggleForm()}>
            Manage Preferences
          </Button>
          <Button as="a" flat className={styles.preferenceButton} href={website} target="_blank">
            Go to Practice Website
          </Button>
        </Section>
      </div>
    );
  }

  renderPreferenceForm() {
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
              onSubmit={(values) => this.updatePreferences(values)}
              initialValues={initialValues}
            />
          </Section>
        ) : null}
      </div>
    );
  }

  render() {
    return this.state.success ? this.renderSuccessMessage() : this.renderPreferenceForm();
  }
}

Unsubscribe.propTypes = {
  patient: PropTypes.shape({
    toJS: PropTypes.func,
  }).isRequired,
  params: PropTypes.shape({
    patient: PropTypes.shape({ id: PropTypes.string }),
    account: PropTypes.shape({ website: PropTypes.string }),
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

export default connect(mapStateToProps, mapDispatchToProps)(Unsubscribe);
