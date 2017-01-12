
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Card, RouterButton } from '../components/library';
import styles from '../components/Patients/styles.scss';
import AddPatientForm from '../components/Patients/AddPatientForm';
import { fetchEntities } from '../thunks/fetchEntities';

class PatientsContainer extends React.Component {
  componentWillMount() {
    this.props.fetchEntities({ key: 'patients' });
  }

  renderHeader() {
    const { location } = this.props;
    let header;
    if (location.pathname === '/patients') {
      header = (
        <div>
          Patients
          <Button>
            Add new patient
          </Button>
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
            <h3>{this.renderHeader()}</h3>
            <div>
              {this.renderChildren(this.props)}
            </div>
          </Card>
        </div>
        <AddPatientForm onSubmit={values => alert(JSON.stringify(values))} />
      </div>
    );
  }
}

PatientsContainer.propTypes = {
  fetchEntities: PropTypes.func,
};

function mapStateToProps({ entities }) {
  return { patients: entities.get('patients') };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsContainer);
