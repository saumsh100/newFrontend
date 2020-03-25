
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UnknownPatient from '../unknownPatient';
import { showAlertTimeout } from '../../../thunks/alerts';
import styles from './styles.scss';
import { toggleVisibility } from '../../../thunks/chat';
import DesktopHeader from './Desktop';
import HubHeader from './Hub';

const ToHeader = (props) => {
  const toggleChat = async () => {
    const chatState = props.isChatOpen ? 0 : 1;
    // only execute when chat is in current tab
    if (chatState === props.tabIndex) {
      await props.loadChatByCount(1);
    }
    // toggle the current chat to either open/close state
    props.toggleVisibility(props.selectedChatId, !props.isChatOpen);
  };
  return window.innerWidth > 576 ? (
    <DesktopHeader {...props} toggleChat={toggleChat} />
  ) : (
    <HubHeader {...props} />
  );
};

const mapStateToProps = ({ entities, chat }) => {
  const selectedChatId = chat.get('selectedChatId');
  const chats = entities.getIn(['chats', 'models']);
  const patients = entities.getIn(['patients', 'models']);
  const selectedChat = chats.get(selectedChatId) || chat.get('newChat');
  const selectedPatientId = selectedChat && selectedChat.patientId;
  const isUnknow = selectedChat && selectedChat.patientPhoneNumber && !selectedChat.patientId;

  return {
    selectedChatId,
    isChatOpen: (selectedChat && selectedChat.isOpen) || false,
    toInputTheme: {
      container: styles.autocompleteContainer,
      suggestionsContainerOpen: styles.suggestionsContainer,
    },
    toInputProps: { placeholder: 'To: Type name of patient' },
    selectedPatient: isUnknow
      ? UnknownPatient(selectedChat.patientPhoneNumber)
      : patients.get(selectedPatientId),
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showAlertTimeout,
      toggleVisibility,
    },
    dispatch,
  );

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(ToHeader);

ToHeader.propTypes = {
  isChatOpen: PropTypes.bool,
  selectedChatId: PropTypes.string,
  toggleVisibility: PropTypes.func.isRequired,
  loadChatByCount: PropTypes.func.isRequired,
  tabIndex: PropTypes.number,
};

ToHeader.defaultProps = {
  isChatOpen: false,
  selectedChatId: null,
  tabIndex: 0,
};
