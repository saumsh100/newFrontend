
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import PatientUser from '../../../entities/models/PatientUser';
import RequestModel from '../../../entities/models/Request';
import { patientShape } from '../../library/PropTypeShapes';
import PatientData from './PatientData';
import { Button } from '../../library';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import styles from './styles.scss';

class AddPatientSuggestions extends Component {
  constructor(props) {
    super(props);

    const { mergingPatientData } = props;

    this.state = {
      selectedPatient: mergingPatientData.suggestions[0],
    };

    this.handleCreatePatient = this.handleCreatePatient.bind(this);
    this.handleConnectPatient = this.handleConnectPatient.bind(this);
    this.selectPatient = this.selectPatient.bind(this);
  }

  selectPatient(selectedPatient) {
    this.setState({
      selectedPatient,
    });
  }

  handleCreatePatient() {
    const { setMergingPatient, mergingPatientData } = this.props;

    setMergingPatient({
      patientUser: mergingPatientData.patientUser,
      requestData: mergingPatientData.requestData,
      suggestions: [],
    });
  }

  handleConnectPatient() {
    const {
      patients, reinitializeState, selectAppointment, mergingPatientData,
    } = this.props;

    const requestData = mergingPatientData.requestData;
    const patient = this.state.selectedPatient;

    const futureAppointments =
      patient.appointments && patient.appointments.length ? patient.appointments : false;

    const appointment = {
      startDate: requestData.startDate,
      endDate: requestData.endDate,
      serviceId: requestData.serviceId,
      note: requestData.note,
      isSyncedWithPms: false,
      customBufferTime: 0,
      request: true,
      patientId: patient.id,
      requestModel: requestData.requestModel,
      practitionerId: requestData.practitionerId,
      nextAppt: futureAppointments,
    };

    const patientModel = patients.get(appointment.patientId);
    const patientUserId = mergingPatientData.patientUser.id;
    const modifiedPatient = patientModel.set('patientUserId', patientUserId);

    const confirmSuggestion = window.confirm('Are you sure you want to connect these patients?');

    if (confirmSuggestion) {
      this.props
        .updateEntityRequest({
          key: 'patients',
          model: modifiedPatient,
          url: `/api/patients/${modifiedPatient.get('id')}`,
        })
        .then(() => {
          reinitializeState();
          return selectAppointment(appointment);
        });
    }
  }

  render() {
    const { mergingPatientData } = this.props;

    const suggestions = mergingPatientData.suggestions;
    const patientUser = mergingPatientData.patientUser;
    const fullName = `${patientUser.firstName} ${patientUser.lastName}`;

    return (
      <div className={styles.container}>
        <div className={styles.patientSpeel}>
          <span className={styles.bold}>{fullName}</span> could not be found in your Practice
          Management Software, however we have found some similar matches. If one of these are
          correct, please select the option and then click on{' '}
          <span className={styles.bold}>Connect Patient</span>. Otherwise, please click{' '}
          <span className={styles.bold}>Create New Patient</span> to add a new patient record.{' '}
        </div>
        <div className={styles.suggestionsList}>
          {suggestions.map(patient => (
            <PatientData
              key={patient.id}
              patient={patient}
              requestData={mergingPatientData.requestData}
              handleUpdatePatient={this.handleUpdatePatient}
              selectPatient={this.selectPatient}
              selectedPatient={this.state.selectedPatient}
            />
          ))}
        </div>
        <div className={styles.createPatientButtonContainer}>
          <Button border="blue" onClick={this.handleCreatePatient}>
            Create New Patient
          </Button>
          <Button color="blue" onClick={this.handleConnectPatient} className={styles.connectButton}>
            Connect Patient
          </Button>
        </div>
      </div>
    );
  }
}

AddPatientSuggestions.propTypes = {
  patients: PropTypes.instanceOf(Map),
  reinitializeState: PropTypes.func.isRequired,
  selectAppointment: PropTypes.func.isRequired,
  setMergingPatient: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  mergingPatientData: PropTypes.shape({
    patientUser: PropTypes.instanceOf(PatientUser),
    requestData: PropTypes.shape({
      requestModel: PropTypes.instanceOf(RequestModel),
    }),
    suggestions: PropTypes.arrayOf(PropTypes.shape(patientShape)),
  }).isRequired,
};

AddPatientSuggestions.defaultProps = {
  patients: new Map(),
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateEntityRequest,
    },
    dispatch,
  );

const mapStateToProps = ({ entities }) => ({
  patients: entities.getIn(['patients', 'models']),
});

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(AddPatientSuggestions);
