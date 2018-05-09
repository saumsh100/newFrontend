
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ChatList from './ChatList';
import MessageContainer from './MessageContainer';
import PatientInfo from './PatientInfo';
import classnames from 'classnames';
import ToHeader from './ToHeader';
import {
  Button,
  SContainer,
  SHeader,
  SBody,
  Card,
  List,
  InfiniteScroll,
  Tabs,
  Tab,
} from '../library';
import {
  defaultSelectedChatId,
  loadChatList,
  selectChat,
  loadUnreadChatList,
  loadFlaggedChatList,
  cleanChatList,
} from '../../thunks/chat';
import { setNewChat } from '../../reducers/chat';
import PatientSearch from '../PatientSearch';
import styles from './styles.scss';

const patientSearchTheme = {
  container: styles.patientSearchClass,
};

const patientSearchInputProps = {
  classStyles: styles.patientSearchInput,
  placeholder: 'Search...',
};

const CHAT_LIST_OFFSET = 15;

class ChatMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      chats: 0,
      moreData: true,
      showPatientsList: true,
      showMessageContainer: false,
      showPatientInfo: false,
    };

    this.addNewChat = this.addNewChat.bind(this);
    this.selectChatOrCreate = this.selectChatOrCreate.bind(this);
    this.loadChatList = this.loadChatList.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.togglePatientsList = this.togglePatientsList.bind(this);
    this.togglePatientsInfo = this.togglePatientsInfo.bind(this);
    this.toggleShowMessageContainer = this.toggleShowMessageContainer.bind(this);
    this.selectChatOrCreate = this.selectChatOrCreate.bind(this);
  }

  componentDidMount() {
    this.loadChatList(true);
  }

  addNewChat() {
    // No data yet, this just sets it to not be null
    this.props.setNewChat({});
    this.props.selectChat(null);
    this.toggleShowMessageContainer();
  }

  togglePatientsList() {
    this.setState({
      showPatientsList: !this.state.showPatientsList,
      showPatientInfo: false,
      showMessageContainer: false,
    });
  }

  togglePatientsInfo() {
    this.setState({
      showPatientInfo: !this.state.showPatientInfo,
      showPatientsList: false,
      showMessageContainer: !this.state.showMessageContainer,
    });
  }

  toggleShowMessageContainer() {
    this.setState({
      showMessageContainer: !this.state.showMessageContainer,
      showPatientsList: false,
      showPatientInfo: false,
    });
  }

  selectChatOrCreate(patient) {
    // If this patient has a chat, select the chat
    if (patient.chatId) {
      this.props.selectChat(patient.chatId);
      this.props.setNewChat(null);
    } else {
      this.props.selectChat(null);
      this.props.setNewChat({ patientId: patient.id });
    }
  }

  receivedChatsPostUpdate(result) {
    this.setState({
      chats: this.state.chats + Object.keys(result.chats || {}).length,
      moreData: !(
        Object.keys(result).length === 0 || Object.keys(result.chats).length < CHAT_LIST_OFFSET
      ),
    });
  }

  chatListLoader() {
    const { tabIndex } = this.state;

    if (tabIndex === 1) {
      return this.props.loadUnreadChatList;
    }

    if (tabIndex === 2) {
      return this.props.loadFlaggedChatList;
    }

    return this.props.loadChatList;
  }

  loadChatList(initial = false) {
    return this.chatListLoader()(CHAT_LIST_OFFSET, this.state.chats)
      .then(result => this.receivedChatsPostUpdate(result))
      .then(() => {
        if (initial) {
          this.props.defaultSelectedChatId();
        }
      });
  }

  changeTab(newIndex) {
    if (this.state.tabIndex === newIndex) {
      return;
    }

    this.props.selectChat(null);

    this.setState(
      {
        tabIndex: newIndex,
        chats: 0,
      },
      () => {
        this.props.cleanChatList();
        this.loadChatList().then(() => {
          this.props.defaultSelectedChatId();
        });
      }
    );
  }

  renderHeading() {
    return (
      <SHeader className={styles.leftCardHeader}>
        <div className={styles.searchSection}>
          <div className={styles.searchInputWrapper} data-test-id="input_chatSearch">
            <PatientSearch
              onSelect={this.selectChatOrCreate}
              theme={patientSearchTheme}
              inputProps={patientSearchInputProps}
            />
          </div>
          <Button
            icon="edit"
            onClick={this.addNewChat}
            className={styles.addNewChatButton}
            color="darkblue"
            data-test-id="button_addNewChat"
          />
        </div>
        <div className={styles.tabsSection}>
          <Tabs fluid index={this.state.tabIndex} onChange={this.changeTab} noUnderLine>
            <Tab label="All" inactiveClass={styles.inactiveTab} activeClass={styles.activeTab} />
            <Tab label="Unread" inactiveClass={styles.inactiveTab} activeClass={styles.activeTab} />
            <Tab
              label="Flagged"
              inactiveClass={styles.inactiveTab}
              activeClass={styles.activeTab}
            />
          </Tabs>
        </div>
      </SHeader>
    );
  }

  renderChatList() {
    return (
      <SBody>
        <List className={styles.chatsList}>
          <InfiniteScroll
            loadMore={this.loadChatList}
            loader={<div style={{ clear: 'both' }}>Loading...</div>}
            hasMore={this.state.moreData}
            initialLoad={false}
            useWindow={false}
            threshold={1}
          >
            <ChatList
              tabIndex={this.state.tabIndex}
              onChatClick={this.toggleShowMessageContainer}
            />
          </InfiniteScroll>
        </List>
      </SBody>
    );
  }

  renderMessageContainer() {
    const { showPatientInfo } = this.state;
    const slideStyle = showPatientInfo ? styles.slideIn : {};
    const patientInfoStyle = classnames(styles.rightSplit, slideStyle);

    return (
      <SBody>
        <div className={styles.splitWrapper}>
          <div className={styles.leftSplit}>
            <MessageContainer />
          </div>
          <div className={patientInfoStyle}>
            <div className={styles.rightInfo}>
              <Button
                icon="arrow-left"
                onClick={this.togglePatientsInfo}
                className={styles.closePatientInfo}
              />
              <PatientInfo />
              <div className={styles.bottomInfo} />
            </div>
          </div>
        </div>
      </SBody>
    );
  }

  render() {
    const { showPatientsList, showMessageContainer, showPatientInfo } = this.state;
    const slideStyle = showPatientsList ? styles.slideIn : {};
    const patientsListStyle = classnames(styles.patientsList, slideStyle);

    const messageContainerSlideStyle =
      showMessageContainer || showPatientInfo ? styles.slideIn : {};
    const messageContainerClass = classnames(styles.rightCard, messageContainerSlideStyle);

    return (
      <div className={styles.chatWrapper}>
        <div className={patientsListStyle}>
          <Card className={styles.leftCard} noBorder>
            <SContainer>
              {this.renderHeading()}
              {this.renderChatList()}
            </SContainer>
          </Card>
        </div>
        <Card noBorder className={messageContainerClass}>
          <SContainer>
            <SHeader className={styles.messageHeader}>
              <ToHeader
                onPatientInfoClick={this.togglePatientsInfo}
                onPatientListClick={this.togglePatientsList}
                onSearch={this.selectChatOrCreate}
              />
            </SHeader>
            {this.renderMessageContainer()}
          </SContainer>
        </Card>
      </div>
    );
  }
}

ChatMessage.propTypes = {
  setNewChat: PropTypes.func,
  defaultSelectedChatId: PropTypes.func,
  selectChat: PropTypes.func,
  loadChatList: PropTypes.func,
  loadUnreadChatList: PropTypes.func,
  loadFlaggedChatList: PropTypes.func,
  cleanChatList: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setNewChat,
      defaultSelectedChatId,
      selectChat,
      loadChatList,
      loadUnreadChatList,
      loadFlaggedChatList,
      cleanChatList,
    },
    dispatch
  );
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(ChatMessage);
