
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PatientList from './PatientList';
import fetchEntities from '../../thunks/fetchEntities';
import styles from './styles.scss';

class Patients extends Component {
  constructor(props) {
    super(props);
    
    this.sendMessage = this.sendMessage.bind(this);
  }
  
  componentDidMount() {
    this.props.fetchEntities({ key: 'patients' });
  }
  
  sendMessage(patient) {
    window.socket.emit('sendMessage', { patient });
  }
  
  render() {
    const { patients } = this.props;
    // if (patients.get('lastUpdated') === null) return null;
    
    return (
      <PatientList
        patients={patients}
        onChat={this.sendMessage}
      />
    );
  }
}

Patients.propTypes = {
  patients: PropTypes.object.isRequired,
  fetchEntities: PropTypes.func.isRequired,
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

export default enhance(Patients);
