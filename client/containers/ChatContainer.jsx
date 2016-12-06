
import React, { PropTypes, Component } from 'react';
import Chat from '../components/Patients/Chat';

class ChatContainer extends Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    /*window.socket.on('receivePatient', (result) => {
      this.setState({ patient: result });
    });
    
    window.socket.emit('fetchPatient', { id: this.props.params.patientId });*/
  }
  
  render() {
    const { patient } = this.props;
    return (
      <Chat patient={patient} />
    );
  }
}

ChatContainer.propTypes = {
  patient: PropTypes.object.isRequired,
};

export default ChatContainer;
