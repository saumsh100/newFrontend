import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchPost } from '../../../thunks/fetchEntities';
import Messages from './Messages';
import DialogsListItem from './DialogsList';
import styles from './styles.scss';
import { Button, Form, Field } from '../../library';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleInput = this.handleInput.bind(this);
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
      patientId: this.props.currentDialogId,
      body: message.value,
      createdAt: new Date(),
    };
    this.props.fetchPost({
      key: 'textMessages',
      params,
    });
    this.props.sendMessageOnClient(params);
    // window.socket.emit('sendMessage', {
    //   message: message.value,
    //   patient: this.props.patient,
    // });
    message.value = '';
  }
  renderChatWindow(patient, textMessages) {
    return (
      <div className={styles.chat}>
        <div className={styles.chat__header}>
          <div className={styles.chat__address}>
            <span className={styles.address__to}>To:</span>
            <span className={styles.address__name}>{patient.lastName} {patient.phoneNumber}</span>
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
            <div className={styles.message_list} ref={ref => (this.messagesList = ref)}>
              <Messages messages={textMessages} patientId={patient.id} />
            </div>
            <div className={styles.body_footer}>
              <form onSubmit={this.sendMessage}>
                <input ref={ref => (this.messageText = ref)} className={styles.body_footer__input} type="text" placeholder="Type a message" />
              </form>
              <div className={styles.body_footer__attach}></div>
            </div>
          </div>
          <div className={styles.chat__partner}>
            <div className={styles.partner}>
              <div className={styles.partner__header}>
                <img className={styles.partner__photo} src={patient.image} alt="avatar" />
                <div className={styles.partner__name}>
                  Jenn Frye, 30
                </div>
                <div className={styles.partner__birthday}>
                  02/17/1987
                </div>
                <div className={styles.partner__gender}>
                  Female
                </div>
              </div>
              <div className={styles.partner__main}>
                <div className={styles.partner__phone}>
                  <a href={`tel: ${patient.phoneNumber}`}>
                    <i className="fa fa-phone" />
                    {patient.phoneNumber}
                  </a>
                </div>
                <div className={styles.partner__email}>
                  <a href={`mailto: ${patient.email}`}>
                    <i className="fa fa-envelope" />
                    {patient.email}
                  </a>
                </div>
              </div>
              <div className={styles.partner__footer}>
                <div className={styles.appointment}>
                  <div className={styles.appointment__last}>
                    <div className={styles.appointment__last_text}>Last appointment</div>
                    <div className={styles.appointment__last_date}>02/23/2017</div>
                  </div>
                  <div className={styles.appointment__next}>
                    <div className={styles.appointment__next_text}>Next appointment</div>
                    <div className={styles.appointment__next_date}>08/23/2017</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleInput() {
    const value = this.textInput.value;
    this.props.setDialogsFilter(value);
  }

  render() {
    const { currentDialogId, setDialogsFilter, filters } = this.props;
    let { dialogList = [] } = this.props;
    const patient = {};
    let currentDialog = dialogList[0] || {};
    if (currentDialogId) {
      currentDialog = dialogList.filter(n => (n.patientId === currentDialogId))[0];
    }
    const textMessages = currentDialog.messages;
    if (!dialogList.length) {
      return <div>Loading...</div>;
    }
    const userNameFilterText = filters && filters.username;
    if (userNameFilterText) {
      const pattern = new RegExp(userNameFilterText, 'i');
      dialogList = dialogList.filter(d => pattern.test(d.patientName));
    }
    return (
      <div className={styles.chat__container}>
        <div className={styles.dialogs}>
          <div className={styles.dialogs__search}>
            <label className={styles.search__label} htmlFor="search__input">
              <i className="fa fa-search"></i>
            </label>
            <input id="search__input"
              className={styles.search__input}
              placeholder="Search..."
              ref={(input) => { this.textInput = input; }}
              onChange={this.handleInput}
            />
            <div className={styles.search__edit}>
              <i className="fa fa-pencil"></i>
            </div>
          </div>
          <ul className={styles.dialogs__messages}>
            {dialogList && dialogList.map(((d) => {
              const lastMessageText = d.lastMessageText;
              const lastMessageTime = d.lastMessageTime;
              const unreadCount = d.unreadCount;
              const unreadMessagesCount = null; 
              const patientList = null;
              const messages = dialogList.messages;
              const userNameFilterText = filters && filters.username; 
              return (<DialogsListItem
                lastMessageText={lastMessageText}
                unreadCount={unreadCount}
                lastMessageTime={lastMessageTime}
                patientList={patientList}
                patientId={d.patientId}
                patientName={d.patientName}
                setCurrentDialog={this.props.setCurrentDialog}
                />);
            }).bind(this))}
          </ul>
        </div>
        {currentDialogId && this.renderChatWindow(patient, textMessages)}
      </div>
    );
  }
}

Chat.propTypes = {
  textMessages: PropTypes.object.isRequired,
  fetchPost: PropTypes.object.isRequired,
};
function mapActionsToProps(dispatch) {
  return bindActionCreators({
    fetchPost
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);
export default enhance(Chat);
