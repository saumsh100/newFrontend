
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
    this.props.fetchEntities({
      key: 'chats',
      join: ['textMessages', 'patient'],
      params: {
        skip: this.state.people,
        limit: HOW_MANY_TO_SKIP,
      },
    }).then((result) => {
      if (Object.keys(result).length === 0 || Object.keys(result.chats || {}).length < 15) {
        this.setState({ moreData: false });
      }

      this.setState({ people: this.state.people + Object.keys(result.chats || {}).length })
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

    return (
      <ChatMessage
        textMessages={textMessages}
        chats={chats}
        patients={patients}
        moreData={this.state.moreData}
        loadMore={this.loadMore}
        currentPatient={selectedPatient}
        setCurrentPatient={this.setCurrentPatient}
        selectedChat={selectedChat}
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

  const finalChat = selectedChat || chat.get('newChat');
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
