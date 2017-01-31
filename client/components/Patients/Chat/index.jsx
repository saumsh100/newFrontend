import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchPost } from '../../../thunks/fetchEntities';
import Messages from './Messages';
import DialogsListItem from './DialogsList';
import styles from './styles.scss';
import { Button, Form, Field } from '../../library';
import ChatWindow from './ChatWindow';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput() {
    const value = this.textInput.value;
    this.props.setDialogsFilter(value);
  }

  render() {
    const {
      currentDialogId,
      setDialogsFilter,
      filters,
      readMessagesInCurrentDialog,
    } = this.props;
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
              return (<DialogsListItem
                lastMessageText={lastMessageText}
                unreadCount={unreadCount}
                lastMessageTime={lastMessageTime}
                patientList={patientList}
                patientId={d.patientId}
                patientName={d.patientName}
                setCurrentDialog={this.props.setCurrentDialog}
                readMessagesInCurrentDialog={readMessagesInCurrentDialog}
                />);
            }).bind(this))}
          </ul>
        </div>
        {currentDialog &&
          <ChatWindow 
            patient={patient}
            textMessages={textMessages}
            sendMessage={this.sendMessage}
            currentDialogId={this.props.currentDialogId}
            fetchPost={this.props.fetchPost}
            sendMessageOnClient={this.props.sendMessageOnClient}
          />
        }
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
    fetchPost,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);
export default enhance(Chat);
