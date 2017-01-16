
import React, { PropTypes, Component } from 'react';
import { Card } from '../library';
import SendMessageInput from './SendMessageInput';
import moment from 'moment';

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
              <ul className="dialogs__messages" >
                {textMessages.get('models').map(m =>
                    <li className="messages">
                      <img className="messages__photo" src="./img/people.png" alt="" />
                      <div className="messages__wrapper">
                          <div className="messages__header">
                              <div className="messages__name"></div>
                              <div className="messages__date">
                                {moment(m.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                              </div>
                          </div>
                          <div className="messages__body">
                              <div className="messages__unread">
                                  <span></span>
                              </div>
                              <div className="messages__text">
                                {m.body}
                              </div>
                          </div>
                      </div>
                  </li>
                )}
              </ul>
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
