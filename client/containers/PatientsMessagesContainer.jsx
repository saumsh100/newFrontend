
import React, { PropTypes, Component } from 'react';
import { fetchEntities } from '../thunks/fetchEntities';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import immutable from 'immutable';
import { bindActionCreators } from 'redux';
import ChatMessage from '../components/Patients/ChatMessage/';
import {
  setCurrentDialog,
  setDialogScrollPermission,
} from '../thunks/dialogs';
import moment from 'moment';
import * as Actions from '../actions/patientList';

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
      if (Object.keys(result).length === 0) {
        this.setState({ moreData: false });
      }
    });
  }

  setCurrentPatient(id, chatId) {
    console.log(id, chatId);
    this.props.setSelectedPatient(id);
    this.props.setChatPatient(chatId);
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
      if (Object.keys(result).length === 0) {
        this.setState({ moreData: false });
      }
    });

    newState.people = this.state.people + HOW_MANY_TO_SKIP;

    this.setState(newState);
  }

  render() {
    const {
      chats,
      textMessages,
      patients,
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

    const currentPatient = (this.props.selectedChatPatient ? this.props.selectedChatPatient : patients.get(firstId));
    const currentChat = (this.props.selectedChat ? this.props.selectedChat : chatOrder.toArray()[0]);

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
  setChatPatient: PropTypes.func.isRequired,
  setSelectedPatient: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, currentDialog, patientList, form }) {
  const patients = entities.getIn(['patients', 'models']);
  const chats = entities.getIn(['chats', 'models']);
  const selectedPatientId = patientList.get('selectedPatientId');
  const selectedChatPatient = patients.get(selectedPatientId);
  const selectedChatId = patientList.get('selectedChatId');
  const selectedChat = chats.get(selectedChatId);

  return {
    textMessages: entities.getIn(['textMessages', 'models']),
    chats,
    selectedChatPatient,
    patients,
    selectedChat,
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
    setSelectedPatient: Actions.setSelectedPatientIdAction,
    setChatPatient: Actions.setSelectedChatIdAction,
    searchPatient: Actions.searchPatientAction,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsMessagesContainer);
