
import React, { Component } from 'react';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import ChatList from './ChatList';
import MessageContainer from './MessageContainer';
import PatientInfo from './PatientInfo';
import PatientInfoPage from '../Patients/PatientInfo/Electron';
import ToHeader from './ToHeader';
import { Button, SContainer, SHeader, SBody, Card, List, InfiniteScroll } from '../library';
import {
  loadChatList,
  selectChat,
  loadUnreadChatList,
  loadFlaggedChatList,
  loadOpenChatList,
  loadClosedChatList,
  cleanChatList,
  getChatEntity,
  getChatCategoryCounts,
  selectChatByPatientId,
} from '../../thunks/chat';
import Loader from '../Loader';
import { fetchEntitiesRequest } from '../../thunks/fetchEntities';
import { setBackHandler, setTitle } from '../../reducers/electron';
import PatientSearch from '../PatientSearch';
import { isHub, TOOLBAR_LEFT, TOOLBAR_RIGHT } from '../../util/hub';
import { CHAT_PAGE } from '../../constants/PageTitle';
import tabsConstants from './consts';
import ChatMenu from './ChatMenu';
import styles from './styles.scss';

const patientSearchTheme = {
  container: styles.patientSearchClass,
  suggestionsContainerOpen: styles.suggestionsContainer,
};

const patientSearchInputProps = {
  classStyles: styles.patientSearchInput,
  placeholder: 'Search...',
};

const CHAT_LIST_LIMIT = 15;

class ChatMessage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: null,
      chats: 0,
      moreData: true,
      showPatientsList: true,
      showMessageContainer: false,
      showPatientInfo: false,
    };

    this.addNewChat = this.addNewChat.bind(this);
    this.loadChatList = this.loadChatList.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.togglePatientsList = this.togglePatientsList.bind(this);
    this.togglePatientsInfo = this.togglePatientsInfo.bind(this);
    this.toggleShowMessageContainer = this.toggleShowMessageContainer.bind(this);
    this.selectChatOrCreate = this.selectChatOrCreate.bind(this);
    this.hubChatPage = this.hubChatPage.bind(this);
    this.selectChatIfIdIsProvided = this.selectChatIfIdIsProvided.bind(this);
  }

  componentDidMount() {
    this.props.getChatCategoryCounts();
    this.props.fetchEntitiesRequest({
      id: 'dashAccount',
      key: 'accounts',
    });
    this.selectChatIfIdIsProvided(this.props.match.params.chatId);
  }

  componentWillUnmount() {
    this.props.selectChat(null);
  }

  selectChatIfIdIsProvided(chatId = null) {
    if (chatId) {
      // find chat information from chatId, and go to the tab according to isOpen state
      Promise.resolve(this.props.getChatEntity(chatId)).then((selectedChat) => {
        if (selectedChat) {
          const { isOpen, id } = selectedChat.toJS();
          const newTabIndex = isOpen ? tabsConstants.OPEN_TAB : tabsConstants.CLOSED_TAB;
          this.changeTab(newTabIndex, () => this.props.selectChat(id));
          this.toggleShowMessageContainer();
        }
        return selectedChat;
      });
    } else {
      this.setState(
        {
          tabIndex: tabsConstants.OPEN_TAB,
        },
        () => this.loadChatList(),
      );
    }
  }

  addNewChat() {
    // No data yet, this just sets it to not be null
    this.props.selectChat(null, {});
    this.toggleShowMessageContainer();
  }

  togglePatientsList() {
    this.setState(
      {
        showPatientsList: !this.state.showPatientsList,
        showPatientInfo: false,
        showMessageContainer: false,
      },
      () => {
        this.props.setLocation('/chat');
        this.props.selectChat(null);
      },
    );
  }

  togglePatientsInfo(pageTitle) {
    this.setState(
      {
        showPatientInfo: !this.state.showPatientInfo,
        showPatientsList: false,
        showMessageContainer: !this.state.showMessageContainer,
      },
      () => {
        this.props.setTitle(pageTitle);
        this.props.setBackHandler(() => {
          this.props.setTitle(CHAT_PAGE);
          this.toggleShowMessageContainer();
        });
      },
    );
  }

  toggleShowMessageContainer() {
    this.setState(
      {
        showMessageContainer: !this.state.showMessageContainer,
        showPatientsList: false,
        showPatientInfo: false,
      },
      this.hubChatPage,
    );
  }

  async hubChatPage() {
    this.props.setTitle(CHAT_PAGE);
    this.props.setBackHandler(this.togglePatientsList);
  }

  selectChatOrCreate(patient) {
    const selectChatCallback = async () => {
      if (!this.state.showMessageContainer) {
        this.toggleShowMessageContainer();
      }
      await this.hubChatPage();
      this.props.selectChatByPatientId(patient.ccId);
    };
    this.changeTab(tabsConstants.ALL_TAB, selectChatCallback);
  }

  receivedChatsPostUpdate(result) {
    this.setState({
      chats: this.state.chats + Object.keys(result.chats || {}).length,
      moreData: !(
        Object.keys(result).length === 0 || Object.keys(result.chats).length < CHAT_LIST_LIMIT
      ),
    });
  }

  chatListLoader() {
    const { tabIndex } = this.state;

    if (tabIndex === tabsConstants.UNREAD_TAB) {
      return this.props.loadUnreadChatList;
    }

    if (tabIndex === tabsConstants.FLAGGED_TAB) {
      return this.props.loadFlaggedChatList;
    }

    if (tabIndex === tabsConstants.OPEN_TAB) {
      return this.props.loadOpenChatList;
    }

    if (tabIndex === tabsConstants.CLOSED_TAB) {
      return this.props.loadClosedChatList;
    }

    return this.props.loadChatList;
  }

  loadChatList() {
    return this.chatListLoader()(CHAT_LIST_LIMIT, this.state.chats).then(result =>
      this.receivedChatsPostUpdate(result));
  }

  loadChatByCount = async (count) => {
    await this.chatListLoader()(count, CHAT_LIST_LIMIT).then(() =>
      this.receivedChatsPostUpdate({}));
  };

  changeTab(newIndex, callback = () => {}) {
    if (this.state.tabIndex === newIndex) {
      callback();
      return;
    }
    this.props.selectChat(null);
    this.props.getChatCategoryCounts();

    this.setState(
      {
        tabIndex: newIndex,
        chats: 0,
      },
      () => {
        this.props.cleanChatList();
        this.loadChatList().then(() => {
          callback();
        });
      },
    );
  }

  showPatientInfo() {
    if (isHub()) {
      return this.state.showPatientInfo && <PatientInfoPage />;
    }

    return (
      <div className={styles.rightInfo}>
        <Button
          icon="arrow-left"
          onClick={this.togglePatientsInfo}
          className={styles.closePatientInfo}
        />
        <PatientInfo />
        <div className={styles.bottomInfo} />
      </div>
    );
  }

  renderChatList() {
    const { chatsFetching } = this.props;
    return (
      <SBody>
        <List className={styles.chatsList}>
          <InfiniteScroll
            loadMore={this.loadChatList}
            loader={<Loader key="loader" />}
            hasMore={this.state.moreData && !chatsFetching}
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
    const patientInfoStyle = classnames(styles.rightSplit, {
      [styles.slideIn]: showPatientInfo,
      [styles.hubRightSplit]: isHub(),
      [styles.hideContainer]: !showPatientInfo,
    });

    const container = classnames(styles.leftSplit, { [styles.hideContainer]: showPatientInfo });

    return (
      <SBody>
        <div className={styles.splitWrapper}>
          <div className={container}>
            <SHeader className={styles.messageHeader}>
              <ToHeader
                onPatientInfoClick={this.togglePatientsInfo}
                onPatientListClick={this.togglePatientsList}
                onSearch={this.selectChatOrCreate}
                loadChatByCount={this.loadChatByCount}
                tabIndex={this.state.tabIndex}
              />
            </SHeader>
            <MessageContainer
              setTab={this.changeTab}
              selectChatOrCreate={this.selectChatOrCreate}
            />
          </div>
          <div className={patientInfoStyle}>{this.showPatientInfo()}</div>
        </div>
      </SBody>
    );
  }

  renderHeading() {
    const { toolbarPosition } = this.props;
    const isLeftSide = isHub() && toolbarPosition === TOOLBAR_LEFT;
    const newChatStyle = classnames(styles.addNewChatButton, { [styles.leftToolbar]: isLeftSide });

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
            className={newChatStyle}
            color="darkblue"
            data-test-id="button_addNewChat"
          />
        </div>
      </SHeader>
    );
  }

  render() {
    const { showPatientsList, showMessageContainer, showPatientInfo } = this.state;
    const shouldSlideIn = showMessageContainer || showPatientInfo;

    return (
      <div className={classnames(styles.chatWrapper, { [styles.hub]: isHub() })}>
        <div
          className={classnames(styles.patientsList, {
            [styles.slideIn]: showPatientsList,
            [styles.hideContainer]: !showPatientsList,
          })}
        >
          <Card noBorder className={styles.leftCard}>
            <SContainer>
              {this.renderHeading()}
              {this.renderChatList()}
            </SContainer>
          </Card>
          <ChatMenu changeTab={this.changeTab} index={this.state.tabIndex} />
        </div>
        <Card
          noBorder
          className={classnames(styles.rightCard, { [styles.slideIn]: shouldSlideIn })}
        >
          <SContainer>{this.renderMessageContainer()}</SContainer>
        </Card>
      </div>
    );
  }
}

ChatMessage.defaultProps = {
  match: { params: { chatId: null } },
  chatsFetching: false,
  toolbarPosition: TOOLBAR_LEFT,
};

ChatMessage.propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ chatId: PropTypes.string }) }),
  selectChat: PropTypes.func.isRequired,
  loadChatList: PropTypes.func.isRequired,
  loadUnreadChatList: PropTypes.func.isRequired,
  loadFlaggedChatList: PropTypes.func.isRequired,
  loadOpenChatList: PropTypes.func.isRequired,
  loadClosedChatList: PropTypes.func.isRequired,
  cleanChatList: PropTypes.func.isRequired,
  setLocation: PropTypes.func.isRequired,
  setBackHandler: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  chatsFetching: PropTypes.bool,
  toolbarPosition: PropTypes.oneOf([TOOLBAR_LEFT, TOOLBAR_RIGHT]),
  getChatEntity: PropTypes.func.isRequired,
  getChatCategoryCounts: PropTypes.func.isRequired,
  selectChatByPatientId: PropTypes.func.isRequired,
};

function mapStateToProps({ apiRequests, electron }) {
  const wasChatsFetched =
    apiRequests.get('fetchingChats') && apiRequests.get('fetchingChats').get('wasFetched');
  const chatsFetching =
    apiRequests.get('fetchingChats') && apiRequests.get('fetchingChats').get('isFetching');

  return {
    wasChatsFetched,
    chatsFetching,
    toolbarPosition: electron.get('toolbarPosition'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectChat,
      loadChatList,
      loadUnreadChatList,
      loadFlaggedChatList,
      loadOpenChatList,
      loadClosedChatList,
      cleanChatList,
      setBackHandler,
      setLocation: push,
      setTitle,
      fetchEntitiesRequest,
      getChatEntity,
      getChatCategoryCounts,
      selectChatByPatientId,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(ChatMessage);
