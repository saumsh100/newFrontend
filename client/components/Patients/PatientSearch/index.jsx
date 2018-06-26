
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { setBackHandler, setTitle } from '../../../reducers/electron';
import { PATIENT_SEARCH_PAGE } from '../../../constants/PageTitle';
import { Icon } from '../../library';
import PatientInfoPage from '../PatientInfo/Electron';
import RelayPatientSearch from '../../../components/RelayPatientSearch';
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

  togglePatientsInfo(patient) {
    this.setState(
      {
        selectedPatient: patient,
        showPatientInfo: true,
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
            <RelayPatientSearch
              onChange={this.togglePatientsInfo}
              inputProps={patientSearchInputProps}
              theme={styles}
              focusInputOnMount
            />
          </div>
        )}
      </div>
    );
  }
}

PatientSearch.propTypes = {
  push: PropTypes.func.isRequired,
  setBackHandler: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
};

const mapActionsToProps = dispatch =>
  bindActionCreators(
    {
      push,
      setBackHandler,
      setTitle,
    },
    dispatch,
  );

const enhance = connect(
  null,
  mapActionsToProps,
);

export default enhance(PatientSearch);
