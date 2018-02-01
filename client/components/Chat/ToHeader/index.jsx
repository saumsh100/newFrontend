
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Avatar,
  Input,
} from '../../library';
import { fetchEntities } from '../../../thunks/fetchEntities';
import { setNewChat, mergeNewChat, setSelectedChatId } from '../../../reducers/chat';
import PatientSearch from '../../PatientSearch';
import styles from './styles.scss';

const toInputTheme = {
  container: styles.autocompleteContainer,
  suggestionsContainerOpen: styles.suggestionsContainer,
};

const toInputProps = {
  placeholder: 'To: Type name of patient',
};

class ToHeader extends Component {
  constructor(props) {
    super(props);

    this.selectPatientForNewMessage = this.selectPatientForNewMessage.bind(this);
  }

  selectPatientForNewMessage(patient) {
    // If this patient has a chat, select the chat
    // if not, add that patientId to the newChat
    if (patient.chatId) {
      this.props.setSelectedChatId(patient.chatId);
    } else {
      this.props.mergeNewChat({ patientId: patient.id });
    }
  }

  render() {
    const { selectedPatient } = this.props;
    return (
      <div className={styles.wrapper}>
        {selectedPatient ?
          (
            <div className={styles.patientInfoWrapper}>
              <Avatar
                size="sm"
                user={selectedPatient}
              />
              <div className={styles.patientInfoName}>
                {selectedPatient.firstName} {selectedPatient.lastName}
              </div>
            </div>
          ) : (
            <PatientSearch
              placeholder="To: Type the name of the person"
              onSelect={this.selectPatientForNewMessage}
              inputProps={toInputProps}
              theme={toInputTheme}
              focusInputOnMount
            />
          )
        }
      </div>
    );
  }
}

ToHeader.propTypes = {
  newChat: PropTypes.object,
  activeAccount: PropTypes.object,
  selectedChat: PropTypes.object,
  setNewChat: PropTypes.func.isRequired,
  mergeNewChat: PropTypes.func.isRequired,
  setSelectedChatId: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, chat }) {
  const selectedChatId = chat.get('selectedChatId');
  const chats = entities.getIn(['chats', 'models']);
  const patients = entities.getIn(['patients', 'models']);
  const selectedChat = chats.get(selectedChatId) || chat.get('newChat');
  const selectedPatientId = selectedChat && selectedChat.patientId;

  return {
    // TODO: this is not right... shouldn't be getting activeAccount this way
    newChat: chat.get('newChat'),
    activeAccount: entities.getIn(['accounts', 'models']).first(),
    selectedPatient: patients.get(selectedPatientId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setNewChat,
    mergeNewChat,
    setSelectedChatId,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ToHeader);
