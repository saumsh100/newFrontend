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
  }

  render() {
    const {
      currentDialogId,
      setDialogsFilter,
      filters,
      readMessagesInCurrentDialog,
      setDialogScrollPermission,
      allowDialogScroll,
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
    const userNameFilterText = filters && filters.values && filters.values.dialogs;
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

            <Form form="dialogs">
              <Field
                className={styles.search__input}
                type="text"
                name="dialogs"
              />
            </Form>
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
            readMessagesInCurrentDialog={readMessagesInCurrentDialog}
            setDialogScrollPermission={setDialogScrollPermission}
            allowDialogScroll={allowDialogScroll}
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
