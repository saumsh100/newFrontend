import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchPost } from '../../../thunks/fetchEntities';
import Messages from './Messages';
import styles from './styles.scss';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidUpdate() {
    const messagesList = this.messagesList;
    if (messagesList !== null) {
      messagesList.scrollTop = messagesList.scrollHeight;
    }
  }

  sendMessage(e) {
    e.preventDefault();
    const message = this.messageText;
    if (message === '' || message.length === 0) {
      return null;
    }
    const params = {
      patientId: this.props.patient.id,
      body: message.value,
    };
    this.props.fetchPost({ key: 'textMessages', params });
    window.socket.emit('sendMessage', { message: message.value, patient: this.props.patient});
    message.value = '';
  }
  render() {
    const { patient, textMessages } = this.props;
    if (patient === null) {
      return <div>Loading...</div>;
    }
    return (
      <div className={styles.chat__container}>
        <div className={styles.chat}>
          <div className={styles.chat__header}>
            <div className={styles.chat__address}>
              <span className={styles.address__to}>To:</span>
              <span className={styles.address__name}>
                {patient.lastName}
                {patient.phoneNumber}
              </span>
            </div>
          </div>
          <div className={styles.chat__wrapper}>
            <div className={styles.chat__body}>
              <div className={styles.body_header}>
                <div className={styles.body_header__username}>
                  {patient.firstName}
                  {patient.lastName}
                </div>
                <div className={styles.body_header__activity}>
                  Last Seen 02/23/2017 10:00 am
                </div>
              </div>
              <div className={styles.message_list} ref={(ref) => this.messagesList = ref}>
                <Messages messages={textMessages} patientId={patient.id} />
              </div>
              <div className={styles.body_footer}>
                <form onSubmit={this.sendMessage}>
                  <input ref={(ref) => this.messageText = ref} className={styles.body_footer__input} type="text" placeholder="Type a message" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Chat.propTypes = {
  patient: PropTypes.object.isRequired,
  textMessages: PropTypes.object.isRequired,
  fetchPost: PropTypes.object.isRequired,
};
function mapActionsToProps(dispatch) {
  return bindActionCreators({
    fetchPost,
  }, dispatch);
}
const enhance = connect(null, mapActionsToProps);
export default enhance(Chat);
