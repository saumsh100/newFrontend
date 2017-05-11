
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import _ from 'lodash';
import MainContainer from './MainContainer';
import { fetchEntities, createEntityRequest, updateEntityRequest, deleteEntityCascade } from '../../../thunks/fetchEntities';
import * as Actions from '../../../actions/patientList';

const HOW_MANY_TO_SKIP = 15;

class PatientList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      people: HOW_MANY_TO_SKIP,
      moreData: true,
      patients: null,
      roll: 0,
      currentPatient: { id: null },
      active: false,
      showNewUser: false,
      initialUser: true,
    };

    this.loadMore = this.loadMore.bind(this);
    this.setSearchPatient = this.setSearchPatient.bind(this);
    this.setCurrentPatient = this.setCurrentPatient.bind(this);
    this.newUserForm = this.newUserForm.bind(this);
    this.newPatient = this.newPatient.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.deletePatient = this.deletePatient.bind(this);
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

  setSearchPatient(currentPatientId) {
    if (this.props.patients.get(currentPatientId)) {
      this.props.setSelectedPatient(this.props.patients.get(currentPatientId).get('id'));
      this.setState({
        showNewUser: true,
        initialUser: true,
      });
    }
  }

  newPatient(values) {
    const newState = {
      active: false,
      showNewUser: true,
    };

    this.setState(newState);
    this.props.createEntityRequest({
      key: 'patient',
      entityData: values,
    }).then((result) => {
        this.props.setSelectedPatient(Object.keys(result.patients)[0]);
    });
  }

  deletePatient() {
    const key = (this.state.showNewUser ? 'patient' : 'patients');
    const currentPatient = ((this.state.showNewUser) ? this.props.patient : this.state.currentPatient);

    this.setState({
      currentPatient: { id: null },
      showNewUser: false,
    });

    const ids = [];

    this.props.appointments.toArray().forEach((appointment) => {
      if (appointment.patientId === currentPatient.id) {
        ids.push(appointment.id);
      }
    });

    this.props.deleteEntityCascade({
      key,
      id: currentPatient.id,
      url: `/api/patients/${currentPatient.id}`,
      cascadeKey: 'appointments',
      ids,
    });
  }

  submitSearch(value){
    if (value.patients.length >= 2) {
      return this.props.fetchEntities({url: '/api/patients/search', params: value})
        .then(result => {
          this.props.searchPatient(Object.keys(result.patients));
        });
    }
    return new Promise((resolve) => { resolve(); });
  }

  submitEdit(currentPatient, values) {
    const key = (this.state.showNewUser ? 'patient' : 'patients');

    if (key === 'patients') {
      values.key = 'patient';
    }

    this.props.updateEntityRequest({
      key,
      values,
      url: `/api/patients/${currentPatient.id}`,
    }).then((result) => {
      this.props.setSelectedPatient(Object.keys(result.patients)[0]);
    });
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
      appointments,
      selectedPatient,
    } = this.props;

    const patientSearch = this.props.searchedPatients || [] ;

    let currentPatient = this.state.currentPatient;
    const app = appointments.sort((a, b) => moment(a.startDate).diff(b.startDate));

    if (this.state.initialUser && appointments.toArray()[0]) {
      currentPatient = patients.get(app.toArray()[0].patientId);
      currentPatient.appointment = app.toArray()[0];
    }

    if (this.state.showNewUser && selectedPatient) {
      currentPatient = selectedPatient;

      let userAppointments = currentPatient.get('appointments');
      userAppointments = userAppointments.toArray();

      if (userAppointments[0]) {
        userAppointments = userAppointments
          .sort((a, b) => moment(a.startDate).diff(b.startDate));
        currentPatient.appointment = userAppointments[0];
        currentPatient.appointment = currentPatient.appointment.toObject();
      } else {
        currentPatient.appointment = {};
      }

    } else {
      if (this.state.currentPatient.id !== null) {
        currentPatient = patients.get(this.state.currentPatient.id);
        currentPatient.appointment = appointments.get(this.state.currentPatient.appointment.id);
      }
    }

    return (
      <MainContainer
        loadMore={this.loadMore}
        setCurrentPatient={this.setCurrentPatient}
        setSearchPatient={this.setSearchPatient}
        currentPatient={currentPatient}
        patients={patients}
        moreData={this.state.moreData}
        appointments={app}
        active={this.state.active}
        initialUser={this.state.initialUser}
        newUserForm={this.newUserForm}
        deletePatient={this.deletePatient}
        reinitializeState={this.reinitializeState}
        editUser={this.submitEdit}
        newPatient={this.newPatient}
        submitSearch={this.submitSearch}
        searchedPatients={patientSearch}
      />
    );
  }
}

PatientList.PropTypes = {
  appointments: PropTypes.object,
  patient: PropTypes.object,
  patients: PropTypes.object,
  fetchEntities: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  deleteEntityCascade: PropTypes.func.isRequired,
  setSelectedPatient: PropTypes.func.isRequired,
  searchPatient: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, patientList }) {
  const patients = entities.getIn(['patients', 'models']);
  const selectedPatientId = patientList.get('selectedPatientId');
  const selectedPatient = patients.get(selectedPatientId);
  return {
    selectedPatient,
    patients,
    searchedPatients: patientList.get('searchedPatients'),
    appointments: entities.getIn(['appointments', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    createEntityRequest,
    updateEntityRequest,
    deleteEntityCascade,
    setSelectedPatient: Actions.setSelectedPatientIdAction,
    searchPatient: Actions.searchPatientAction,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientList);

