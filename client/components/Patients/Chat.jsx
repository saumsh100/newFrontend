
import React, { PropTypes, Component } from 'react';
import { Card } from '../library';
import SendMessageInput from './SendMessageInput';
import Dialog from './Dialog';
class Chat extends Component {
  constructor(props) {
    super(props);
    this.sendMessage = this.sendMessage.bind(this);
  }
  
  componentDidMount() {
    const { patient } = this.props;
  }
  
  sendMessage(e, message) {
    e.preventDefault();
    window.socket.emit('sendMessage', {
      message,
      patient: this.props.patient,
    });
  }
  
  render() {
    const { patient, textMessages } = this.props;
    console.log(textMessages.get('models').size);
    if (patient === null) return <div>Loading...</div>;
    return (
        <Card style={{ height: '400px' }}>
          <div style={{ padding: '0px', position: 'relative', height: '100%' }}>
            <div style={{ overflowY: 'scroll', height: '100%' }}>
            <Dialog messages={textMessages} patientId={patient.id} />
            </div>
            <SendMessageInput onSend={this.sendMessage} />
          </div>
        </Card>
    );
  }
}

Chat.propTypes = {
  patient: PropTypes.object,
  textMessages: PropTypes.object.isRequired,
};

export default Chat;
