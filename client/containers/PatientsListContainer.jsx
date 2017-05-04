
import React, { PropTypes, Component } from 'react';
import PatientList from '../components/Patients/PatientList/';
import { fetchEntities } from '../thunks/fetchEntities';
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
    };

    this.loadMore = this.loadMore.bind(this);
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
    console.log('wrf')
    this.props.fetchEntities({
      key: 'appointments',
      join: ['patient'],
      params: {
        skip: this.state.people,
        limit: HOW_MANY_TO_SKIP,
      },
    });

    let roll = this.state.roll;

    if (this.state.roll === 2) {
      if (this.state.patients === this.props.patients) {
        this.setState({
          moreData: false,
        });
      }
      roll = 0;
    } else {
      roll += 1;
    }

    const people = this.state.people + HOW_MANY_TO_SKIP;

    this.setState({
      patients: this.props.patients,
      people,
      roll,
    });
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

    return (
      <PatientList
        loadMore={this.loadMore}
        setCurrentPatient={setCurrentPatient}
        currentPatient={'asds'}
        patients={patients}
        moreData={this.state.moreData}
        appointments={appointments}
        filters={filters}
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
      patients: entities.getIn(['patients', 'models']),
    };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    setCurrentPatient,
    updateEditingPatientState,
    changePatientInfo,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsListContainer);
