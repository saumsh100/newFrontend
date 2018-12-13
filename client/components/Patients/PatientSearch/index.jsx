
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntities } from '../../../thunks/fetchEntities';
import { setBackHandler, setTitle } from '../../../reducers/electron';
import { PATIENT_SEARCH_PAGE } from '../../../constants/PageTitle';
import { Icon } from '../../library';
import PatientInfoPage from '../PatientInfo/Electron';
import GraphQLPatientSearch from '../../GraphQLPatientSearch';
import styles from './styles.scss';

const patientSearchInputProps = {
  placeholder: 'Search',
  id: 'PatientSearch',
};

class PatientSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPatientInfo: false,
      selectedPatient: null,
    };
    this.togglePatientsInfo = this.togglePatientsInfo.bind(this);
  }

  componentDidMount() {
    this.props.fetchEntities({
      key: 'accounts',
      url: '/api/accounts',
    });
  }

  togglePatientsInfo(patient) {
    this.setState(
      {
        showPatientInfo: true,
        selectedPatient: patient,
      },
      () => {
        this.props.setTitle(`${patient.firstName} ${patient.lastName}`);

        this.props.setBackHandler(() => {
          this.props.setTitle(PATIENT_SEARCH_PAGE);
          this.setState({
            selectedPatient: null,
            showPatientInfo: false,
          });
        });
      },
    );
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        {this.state.showPatientInfo ? (
          <PatientInfoPage
            patient={this.state.selectedPatient}
            patientId={this.state.selectedPatient.ccId}
          />
        ) : (
          <div>
            <Icon icon="search" className={styles.searchIcon} />
            <GraphQLPatientSearch
              focusInputOnMount
              context="hub"
              onChange={this.togglePatientsInfo}
              inputProps={patientSearchInputProps}
              theme={styles}
            />
          </div>
        )}
      </div>
    );
  }
}

PatientSearch.propTypes = {
  setBackHandler: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
};

const mapActionsToProps = dispatch =>
  bindActionCreators(
    {
      setBackHandler,
      setTitle,
      fetchEntities,
    },
    dispatch,
  );

const enhance = connect(
  null,
  mapActionsToProps,
);

export default enhance(PatientSearch);
