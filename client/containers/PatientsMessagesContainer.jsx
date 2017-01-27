
import React, { PropTypes, Component } from 'react';
import PatientMessages from '../components/Patients/Messages';
import { fetchEntities } from '../thunks/fetchEntities';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
class PatientsMessagesContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchEntities({ key: 'dialogs'});
  }

  render() {
    // const { patient, patients } = this.state;
    return (
      <PatientMessages />
    );
  }
}

PatientsMessagesContainer.propTypes = {};

function mapStateToProps({entities}) {
    return {
      dialogs: entities.get('dialogs'),

    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchEntities,
    }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsMessagesContainer);
