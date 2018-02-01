
import React, { PropTypes, Component } from 'react';
import { fetchEntities } from '../thunks/fetchEntities';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import immutable from 'immutable';
import { bindActionCreators } from 'redux';
import ChatMessage from '../components/Chat';
import {
  setCurrentDialog,
  setDialogScrollPermission,
} from '../thunks/dialogs';
import moment from 'moment';
import * as Actions from '../reducers/chat';
import { defaultSelectedChatId } from '../thunks/chat';
import { searchPatientAction } from '../actions/patientList';

const HOW_MANY_TO_SKIP = 15;

class PatientsMessagesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      people: HOW_MANY_TO_SKIP,
      moreData: true,
    };

    this.loadMore = this.loadMore.bind(this);
    this.setCurrentPatient = this.setCurrentPatient.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);

    this.props.fetchEntities({
      key: 'accounts',
      url: `/api/accounts/${decodedToken.activeAccountId}`,
    });

    this.props.fetchEntities({
      key: 'chats',
      join: ['textMessages', 'patient'],
      params: {
        limit: HOW_MANY_TO_SKIP,
      },
    }).then((result) => {
      /*const noChats = !Object.keys(result.chats || {}).length;
      if (noChats) {
        this.props.setNewChat({});
      }*/

      if (Object.keys(result).length === 0 || Object.keys(result.chats).length < 15) {
        // For the infinite scroll component
        this.setState({ moreData: false });
      }

      this.props.defaultSelectedChatId();
    });
  }

  setCurrentPatient(id, chatId) {
    this.props.setSelectedChatId(chatId);
  }

  loadMore() {
    const newState = {};
    this.props.fetchEntities({
      key: 'chats',
      join: ['textMessages', 'patient'],
      params: {
        skip: this.state.people,
        limit: HOW_MANY_TO_SKIP,
      },
    }).then((result) => {
      if (Object.keys(result).length === 0 || Object.keys(result.chats).length < 15) {
        this.setState({ moreData: false });
      }

      this.setState({ people: this.state.people + Object.keys(result.chats).length })
    });
  }

  render() {
    const {
      chats,
      textMessages,
      patients,
      selectedPatient,
      selectedChat,
      newChat,
    } = this.props;


    const chatOrder = chats.sort((a, b) => {
      if (!a.textMessages || !b.textMessages) {
        return 0;
      }
      if (a.textMessages.length === 0 && b.textMessages.length === 0) {
        return 0;
      }
      if (b.textMessages.length === 0) {
        return 1;
      }
      if (a.textMessages.length === 0) {
        return -1;
      }
      return moment(textMessages.get(b.textMessages[b.textMessages.length - 1]).createdAt)
        .diff(textMessages.get(a.textMessages[a.textMessages.length - 1]).createdAt);
    });

    const firstId = (chatOrder.toArray()[0] ? chatOrder.toArray()[0].patientId : null);

    const currentPatient = selectedPatient;

    let currentChat;

    //allow for patients with not chat messages be searched and messages can be sent

    const sortedChat = this.props.chats.toArray().sort((a, b) => {
      return new Date(b.lastTextMessageDate) - new Date(a.lastTextMessageDate);
    });

    //currentChat = selectedChat || (!newChat && sortedChat[0]);
    currentChat = selectedChat;

    return (
      <ChatMessage
        textMessages={textMessages}
        chats={chatOrder}
        patients={patients}
        moreData={this.state.moreData}
        loadMore={this.loadMore}
        currentPatient={currentPatient}
        setCurrentPatient={this.setCurrentPatient}
        selectedChat={currentChat}
        searchPatient={this.props.searchPatient}
        searchedPatients={this.props.searchedPatients}
      />
    );
  }
}

PatientsMessagesContainer.propTypes = {
  currentPatient: PropTypes.object,
  chats: PropTypes.object,
  selectedChat: PropTypes.object,
  patients: PropTypes.object,
  selectedChatPatient: PropTypes.object,
  searchedPatients: PropTypes.object,
  fetchEntities: PropTypes.object,
  textMessages: PropTypes.object,
  searchPatient: PropTypes.func.isRequired,
  setSelectedChatId: PropTypes.func.isRequired,
  setSelectedPatient: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, currentDialog, chat, form, patientList }) {
  const patients = entities.getIn(['patients', 'models']);
  const chats = entities.getIn(['chats', 'models']);
  const selectedChatId = chat.get('selectedChatId');
  const selectedChat = chats.get(selectedChatId);

  // TODO: turn this into selectedPatient not selectedChat
  const finalChat = chats.get(selectedChatId) || chat.get('newChat');
  const selectedPatientId = finalChat && finalChat.patientId;

  return {
    textMessages: entities.getIn(['textMessages', 'models']),
    chats,
    selectedPatient: patients.get(selectedPatientId),
    patients,
    selectedChat,
    newChat: chat.get('newChat'),
    searchedPatients: patientList.get('searchedPatients'),
    currentDialogId: currentDialog.toJS().currentDialog,
    allowDialogScroll: currentDialog.toJS().allowDialogScroll,
    filters: form.dialogs,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    setCurrentDialog,
    setDialogScrollPermission,
    setSelectedChatId: Actions.setSelectedChatId,
    setNewChat: Actions.setNewChat,
    searchPatient: searchPatientAction,
    defaultSelectedChatId,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsMessagesContainer);
