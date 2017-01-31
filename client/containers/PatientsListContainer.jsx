
import React, { PropTypes, Component } from 'react';
import PatientList from '../components/Patients/PatientList/';
import { fetchEntities } from '../thunks/fetchEntities';
import { 
  setCurrentPatient,
  setPatientsFilter,
} from '../thunks/patientList';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class PatientsListContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const options = { key: 'patients', params: { patientsList: true } };
    this.props.fetchEntities(options);
  }

  componentWillReceiveProps(nextProps) {
    const { filters } = this.props;
    const patientName = filters && filters.patientName;
    if (patientName != nextProps.filters.patientName) {
      this.props.fetchEntities({ key: 'patients', params: { patientsList: true, patientName }})
    }
  }

  render() {
    const {
      patients,
      setCurrentPatient,
      setPatientsFilter,
      filters,
    } = this.props;
    {console.log('currentPatient', this.props.currentPatient.get('currentPatient'))}
    return (
      <PatientList
        setCurrentPatient={setCurrentPatient}
        currentPatient={this.props.currentPatient.get('currentPatient')}
        patients={patients}
        setPatientsFilter={setPatientsFilter}
        filters={filters}
      />
    );
  }
}

PatientsListContainer.propTypes = {};

function mapStateToProps({ entities, patientList }) {
    return {
      patients: entities.get('patientList'),
      currentPatient: patientList,
      filters: patientList.toJS().filters,
    };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    setCurrentPatient,
    setPatientsFilter,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsListContainer);
