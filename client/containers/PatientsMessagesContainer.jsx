
import React, { PropTypes, Component } from 'react';
import { fetchEntities } from '../thunks/fetchEntities';
import { connect } from 'react-redux';
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
    console.log(chats.toArray()[0], patients.toArray()[0], textMessages.toArray()[0])

    return (
      <ChatMessage
        textMessages={textMessages}
        chats={chats}
        patients={patients}
        moreData={this.state.moreData}
        loadMore={this.loadMore}
      />
    );
  }
}

PatientsMessagesContainer.propTypes = {};

function mapStateToProps({ entities, currentDialog, form }) {
    return {
      chats: entities.getIn(['chats', 'models']),
      textMessages: entities.getIn(['textMessages', 'models']),
      patients: entities.getIn(['patients', 'models']),
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
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsMessagesContainer);
