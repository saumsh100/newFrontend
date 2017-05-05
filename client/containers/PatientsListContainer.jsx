
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
    };

    this.loadMore = this.loadMore.bind(this);
    this.setCurrentPatient = this.setCurrentPatient.bind(this);
    this.newPatient = this.newPatient.bind(this);
  }

  componentDidMount() {
    const options = { key: 'patients', params: { patientsList: true } };
    this.props.fetchEntities(options);
    this.props.fetchEntities({
      key: 'appointments',
      join: ['patient'],
      params: {
        limit: HOW_MANY_TO_SKIP,
      },
    });
  }

  newPatient(values) {
    console.log(values)
    this.props.createEntityRequest({key: 'patient', entityData: values});
  }

  setCurrentPatient(currentPatient) {
    console.log(currentPatient.firstName);
    this.setState({
      currentPatient,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { filters } = this.props;
    const patientName = filters
    && filters.values && filters.values.patients;
    if (!patientName) return
    if (patientName && !nextProps.filters.values) return;
    if (patientName != nextProps.filters.values.patients) {
      this.props.fetchEntities({ key: 'patients', params: { patientsList: true, patientName }})
    }
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

    console.log(this.props.patient)

    return (
      <PatientList
        loadMore={this.loadMore}
        setCurrentPatient={this.setCurrentPatient}
        currentPatient={this.state.currentPatient}
        patients={patients}
        moreData={this.state.moreData}
        appointments={appointments}
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
