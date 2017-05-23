
import React, { PropTypes, Component } from 'react';
import { fetchEntities } from '../thunks/fetchEntities';
import { connect } from 'react-redux';
import immutable from 'immutable';
import { bindActionCreators } from 'redux';
import ChatMessage from '../components/Patients/ChatMessage/';
import {
  setCurrentDialog,
  setDialogScrollPermission,
} from '../thunks/dialogs';
import {
  sendMessageOnClient,
  readMessagesInCurrentDialog,
} from '../thunks/fetchEntities';
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
  }

  componentDidMount() {
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
      return moment(textMessages.get(a.textMessages[a.textMessages.length - 1]).createdAt)
        .diff(textMessages.get(b.textMessages[b.textMessages.length - 1]).createdAt);
    });

    const firstId = (chatOrder.toArray()[0] ? chatOrder.toArray()[0].patientId : null);

    const currentPatient = (this.props.selectedPatient ? this.props.selectedPatient : patients.get(firstId));

    return (
      <ChatMessage
        textMessages={textMessages}
        chats={chatOrder}
        patients={patients}
        moreData={this.state.moreData}
        loadMore={this.loadMore}
        currentPatient={currentPatient}
        setCurrentPatient={this.props.setSelectedPatient}
        selectedChat={this.props.selectedChat}
      />
    );
  }
}

PatientsMessagesContainer.propTypes = {};

function mapStateToProps({ entities, currentDialog, patientList, form }) {
  const patients = entities.getIn(['patients', 'models']);
  const chats = entities.getIn(['chats', 'models']);
  const selectedPatientId = patientList.get('selectedPatientId');
  const selectedPatient = patients.get(selectedPatientId);
  const map = Immutable.fromJS(chats);
  const selectedChat = map.filter( (chat) => {
    return chat.get('patientId') === selectedPatientId;
  }).first();
  return {
    chats,
    textMessages: entities.getIn(['textMessages', 'models']),
    selectedPatient,
    patients,
    selectedChat,
    currentDialogId: currentDialog.toJS().currentDialog,
    allowDialogScroll: currentDialog.toJS().allowDialogScroll,
    filters: form.dialogs,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    setCurrentDialog,
    sendMessageOnClient,
    readMessagesInCurrentDialog,
    setDialogScrollPermission,
    setSelectedPatient: Actions.setSelectedPatientIdAction,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsMessagesContainer);
