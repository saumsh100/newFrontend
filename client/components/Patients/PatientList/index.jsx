
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import jwt from 'jwt-decode';
import _ from 'lodash';
import { Map } from 'immutable';
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
      roll: 1,
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
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);

    this.props.fetchEntities({
      key: 'accounts',
      url: `/api/accounts/${decodedToken.activeAccountId}`,
    });
    this.props.fetchEntities({
      key: 'appointments',
      join: ['patient'],
      params: {
        limit: HOW_MANY_TO_SKIP,
      },
    }).then((result) => {
      if (Object.keys(result).length === 0) {
        this.setState({ moreData: false });
      }
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
    this.props.setSelectedPatient(currentPatientId);
    this.setState({
      showNewUser: true,
      initialUser: true,
    });
  }

  newPatient(values) {
    const newState = {
      active: false,
      showNewUser: true,
    };

    values.isSyncedWithPMS = false;

    this.setState(newState);

    this.props.createEntityRequest({
      key: 'patients',
      entityData: values,
    }).then((result) => {
        this.props.setSelectedPatient(Object.keys(result.patients)[0]);
    });
  }

  deletePatient(id) {
    const key = 'patients';

    this.setState({
      currentPatient: { id: null },
      showNewUser: false,
      initialUser: true,
    });

    const values = {
      isDeleted: true,
    };

    this.props.updateEntityRequest({
      key,
      values,
      alert: {
        success: 'Deleted patient',
        error: 'Patient not deleted',
      },
      url: `/api/patients/${id}`,
    })
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

    values.isSyncedWithPMS = false;

    const valuesMap = Map(values);
    const modifiedPatient = currentPatient.merge(valuesMap);

    this.props.updateEntityRequest({
      key: 'patients',
      model: modifiedPatient,
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


    this.props.fetchEntities({
      key: 'appointments',
      join: ['patient'],
      params: {
        skip: this.state.people,
        limit: HOW_MANY_TO_SKIP,
      },
    }).then((result) => {
      if (Object.keys(result).length === 0) {
        this.setState({ moreData: false });
      }
    });

    newState.people = this.state.people + HOW_MANY_TO_SKIP;

    this.setState(newState);
  }

  render() {

    const {
      patients,
      appointments,
      selectedPatient,
    } = this.props;

    const selectedPatientShow = (selectedPatient ? selectedPatient : {});

    const patientSearch = this.props.searchedPatients || [] ;
    let currentPatient = this.state.currentPatient;
    let app = appointments.sort((a, b) => moment(a.startDate).diff(b.startDate));
    app = app.filter((appointment) => {
      if (moment(appointment.startDate).diff(new Date()) > 0) {
        return true;
      }
      return false;
    });


    if (this.state.initialUser && appointments.toArray()[0] && !selectedPatient) {
      console.log(app, app.toArray()[0].patientId)
      currentPatient = patients.get(app.toArray()[0].patientId);
      if (currentPatient) {
        currentPatient.appointment = app.toArray()[0];
      } else {
        currentPatient = patients.toArray()[0];
        currentPatient.appointment = {};
      }
    }

    if (this.state.showNewUser && selectedPatientShow.toObject || (this.state.initialUser && selectedPatientShow.toObject)) {
      console.log(selectedPatientShow)
      currentPatient = selectedPatientShow;

      let userAppointments = currentPatient.get('appointments');

      userAppointments = (userAppointments ? userAppointments : {});

      userAppointments = (!userAppointments.toArray ? [] : userAppointments.toArray());

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

        currentPatient.appointment = currentPatient.appointment || (currentPatient.appointments[0] ? currentPatient.appointments[0] : {});
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

