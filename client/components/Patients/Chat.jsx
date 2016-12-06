
import React, { PropTypes, Component } from 'react';
import {
  Input,
  InputGroup,
  InputGroupButton,
  Card,
  CardBlock,
} from 'reactstrap';
import { Button } from '../library';
import SendMessageInput from './SendMessageInput';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.sendMessage = this.sendMessage.bind(this);
  }
  
  sendMessage(e, message) {
    e.preventDefault();
    window.socket.emit('sendMessage', {
      message,
      patient: this.props.patient,
    });
  }
  
  render() {
    const { patient } = this.props;
    
    if (patient === null) return <div>Loading...</div>;
    
    return (
      <Card style={{ height: '400px' }}>
        <CardBlock style={{ padding: '0px', position: 'relative', height: '100%' }}>
          <div style={{ overflowY: 'scroll', height: '100%' }}></div>
          <SendMessageInput onSend={this.sendMessage} />
        </CardBlock>
      </Card>
    );
  }
}

Chat.propTypes = {
  patient: PropTypes.object,
};

export default Chat;
