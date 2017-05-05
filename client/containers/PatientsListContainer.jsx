
import React, { PropTypes, Component } from 'react';
import PatientList from '../components/Patients/PatientList/';
import { fetchEntities, createEntityRequest } from '../thunks/fetchEntities';
import {
  setCurrentPatient,
  updateEditingPatientState,
  changePatientInfo,
} from '../thunks/patientList';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const HOW_MANY_TO_SKIP = 10;

class PatientsListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      people: HOW_MANY_TO_SKIP,
      moreData: true,
      patients: null,
      roll: 0,
      currentPatient: {id: null},
      active: false,
      showNewUser: false,
      initialUser: true,
    };

    this.loadMore = this.loadMore.bind(this);
    this.setCurrentPatient = this.setCurrentPatient.bind(this);
    this.newUserForm = this.newUserForm.bind(this);
    this.newPatient = this.newPatient.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
  }

  componentDidMount() {
    this.props.fetchEntities({
      key: 'appointments',
      join: ['patient'],
      params: {
        limit: HOW_MANY_TO_SKIP,
      },
    });
  }

  setCurrentPatient(currentPatient) {
    this.setState({
      currentPatient,
      showNewUser: false,
      initialUser: false,
    });
  }

  newPatient(values) {
    const newState = {
      active: false,
      showNewUser: true,
    };

    this.setState(newState);
    this.props.createEntityRequest({key: 'patient', entityData: values});
  }

  newUserForm() {
    const newState = {
      active: true,
    };

    this.setState(newState);
  }

  reinitializeState() {
    const newState = {
      active: false,
    };

    this.setState(newState);
  }

  loadMore() {
    const newState = {};
    newState.roll = this.state.roll;

    //Infinite scrolling calls this twice when scrolled down, so making sure we only do one fetch.

    if (this.state.roll === 2) {
      if (this.state.patients === this.props.patients) {
        this.setState({
          moreData: false,
        });
      }
      newState.roll = 0;
    } else if (this.state.roll === 1) {

      this.props.fetchEntities({
        key: 'appointments',
        join: ['patient'],
        params: {
          skip: this.state.people,
          limit: HOW_MANY_TO_SKIP,
        },
      });

      newState.people = this.state.people + HOW_MANY_TO_SKIP;
      newState.roll += 1;
    } else {
      newState.roll += 1;
    }

    newState.patients = this.props.patients;

    this.setState(newState);
  }

  render() {
    const {
      patients,
      setCurrentPatient,
      filters,
      updateEditingPatientState,
      editingPatientState,
      changePatientInfo,
      form,
      appointments,
    } = this.props;

    const currentPatient = ((this.state.showNewUser) ? this.props.patient.toArray()[0] : this.state.currentPatient)
    currentPatient.appointment = {};


    return (
      <PatientList
        loadMore={this.loadMore}
        setCurrentPatient={this.setCurrentPatient}
        currentPatient={currentPatient}
        patients={patients}
        moreData={this.state.moreData}
        appointments={appointments}
        active={this.state.active}
        initialUser={this.state.initialUser}
        newUserForm={this.newUserForm}
        reinitializeState={this.reinitializeState}
        filters={filters}
        submit={this.newPatient}
        updateEditingPatientState={updateEditingPatientState}
        editingPatientState={editingPatientState}
        form={form}
        changePatientInfo={changePatientInfo}
      />
    );
  }
}

PatientsListContainer.propTypes = {};

function mapStateToProps({ entities }) {
  return {
    appointments: entities.getIn(['appointments', 'models']),
    patient: entities.getIn(['patient', 'models']),
    patients: entities.getIn(['patients', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    createEntityRequest,
    setCurrentPatient,
    updateEditingPatientState,
    changePatientInfo,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsListContainer);
