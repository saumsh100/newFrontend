
import React, { PropTypes } from 'react';
import { Card, CardHeader, CardBlock } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RouterButton from '../components/library/RouterButton';
import styles from '../components/Patients/styles.scss';
import AddPatientForm from '../components/Patients/AddPatientForm';
import { fetchEntities } from '../thunks/fetchEntities';
import { openForm } from '../actions/patientForm';

class PatientsContainer extends React.Component {

  componentWillMount() {
    this.props.fetchEntities({ key: 'patients' });
  }

  renderHeader() {
    const { location } = this.props;
    let header;
    if (location.pathname === '/patients') {
      header = (
        <div>Patients
          <button
            className="btn btn-primary offset-lg-10"
            onClick={() => this.props.openForm()}
          >
              Add new patient
          </button>
        </div>

      );
    } else {
      header = (
        <RouterButton to="/patients" color="link">
          {'< Back to Patient List'}
        </RouterButton>
      );
    }

    return header;
  }

  renderChildren(props) {
    return React.Children.map(props.children, child => (
      React.cloneElement(child, {
        patients: props.patients,
      })
    ));
  }

  render() {
    return (
      <div>
        <div className={styles.scheduleContainer}>
          <Card className={styles.cardContainer}>
            <CardHeader>{this.renderHeader()}</CardHeader>
            <CardBlock>
              {this.renderChildren(this.props)}
            </CardBlock>
          </Card>
        </div>
        <AddPatientForm />
      </div>
    );
  }
}

PatientsContainer.propTypes = {
  fetchEntities: PropTypes.func,
  openForm: PropTypes.func,
};

function mapStateToProps({ entities }) {
  return { patients: entities.get('patients') };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    openForm,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsContainer);
