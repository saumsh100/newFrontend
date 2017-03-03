import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchEntities} from '../thunks/fetchEntities';

import Chat from '../components/Patients/Chat/';

class ChatContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const params = {
            patientId: this.props.patient.id,
            limit: 100,
        };
        window.socket.emit('fetchPatient', {id: this.props.patient.id});
        this.props.fetchEntities({key: 'textMessages', params: params});
        this.props.fetchEntities({key: 'patients'});
    }

    render() {
        const {
            patient,
            patients,
            textMessages,
            patientList,
        } = this.props;
        return (
            <Chat patient={patient} patients={patients} patientList={patientList} textMessages={textMessages}/>
        );
    }
}

ChatContainer.propTypes = {
    patient: PropTypes.object.isRequired,
    textMessages: PropTypes.object.isRequired,
    patientList: PropTypes.object.isRequired,
    fetchEntities: PropTypes.func.isRequired,
};

function mapStateToProps({entities}) {
    return {
      textMessages: entities.get('textMessages'),
      patientList: entities.get('patients'),
    };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ChatContainer);
