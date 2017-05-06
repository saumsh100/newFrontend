
import React, { PropTypes, Component } from 'react';
import PatientList from '../components/Patients/PatientList/';
import { fetchEntities, createEntityRequest, updateEntityRequest, deleteEntityCascade } from '../thunks/fetchEntities';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

const HOW_MANY_TO_SKIP = 10;

class PatientsListContainer extends Component {
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
    this.setCurrentPatient = this.setCurrentPatient.bind(this);
    this.newUserForm = this.newUserForm.bind(this);
    this.newPatient = this.newPatient.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
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

  newPatient(values) {
    const newState = {
      active: false,
      showNewUser: true,
    };

    this.setState(newState);
    this.props.createEntityRequest({
      key: 'patient',
      entityData: values,
      noSave: true,
    });
  }

  deletePatient() {
    const key = (this.state.showNewUser ? 'patient' : 'patients');
    const currentPatient = ((this.state.showNewUser) ? this.props.patient.toArray()[0] : this.state.currentPatient);

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
    })
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
    })

    values.firstName = '';
    values.lastName = '';
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
      appointments,
      patient,
    } = this.props;


    let currentPatient = this.state.currentPatient;
    const app = appointments.sort((a, b) => moment(a.startDate).diff(b.startDate));

    if (this.state.initialUser && appointments.toArray()[0]) {
      currentPatient = patients.get(app.toArray()[0].patientId);
      currentPatient.appointment = app.toArray()[0];
    }

    if (this.state.showNewUser) {
      currentPatient = patient.toArray()[0];
      currentPatient.appointment = {};
    } else {
      if (this.state.currentPatient.id !== null) {
        currentPatient = patients.get(this.state.currentPatient.id);
        currentPatient.appointment = appointments.get(this.state.currentPatient.appointment.id);
      }
    }

    return (
      <PatientList
        loadMore={this.loadMore}
        setCurrentPatient={this.setCurrentPatient}
        currentPatient={currentPatient}
        patients={patients}
        moreData={this.state.moreData}
        appointments={app}
        active={this.state.active}
        initialUser={this.state.initialUser}
        newUserForm={this.newUserForm}
        deletePatient={this.deletePatient}
        reinitializeState={this.reinitializeState}
        submitEdit={this.submitEdit}
        submit={this.newPatient}
      />
    );
  }
}

PatientsListContainer.PropTypes = {
  appointments: PropTypes.object,
  patient: PropTypes.object,
  patients: PropTypes.object,
  fetchEntities: PropTypes.function,
  createEntityRequest: PropTypes.function,
  updateEntityRequest: PropTypes.function,
  deleteEntityCascade: PropTypes.function,
};

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
    updateEntityRequest,
    deleteEntityCascade,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsListContainer);
