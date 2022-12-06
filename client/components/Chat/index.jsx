import React, { Component } from 'react';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import classnames from 'classnames';
import { ErrorBoundary } from 'react-error-boundary';
import { bindActionCreators } from 'redux';
import { setChatIsLoading, setConversationIsLoading } from '../../reducers/chat';
import {
  cleanChatList,
  getChatCategoryCounts,
  getChatEntity,
  loadChatList,
  loadClosedChatList,
  loadFlaggedChatList,
  loadOpenChatList,
  loadUnreadChatList,
  selectChat,
  setNewChatTypeStatus,
  selectChatByPatientId,
} from '../../thunks/chat';
import { fetchEntitiesRequest } from '../../thunks/fetchEntities';
import {
  StandardButton as Button,
  Card,
  InfiniteScroll,
  List,
  SBody,
  SContainer,
  SHeader,
} from '../library';
import Loader from '../Loader';
import PatientSearch from '../PatientSearch';
import ChatList from './ChatList';
import ChatMenu from './ChatMenu';
import tabsConstants from './consts';
import MessageContainer from './MessageContainer';
import PatientInfo from './PatientInfo';
import styles from './reskin-styles.scss';
import ToHeader from './ToHeader';
import DesktopSkeleton from './ToHeader/DesktopSkeleton';
import ModuleError from '../ModuleError';
import ErrorPage from '../ErrorPage';
import { httpClient } from '../../util/httpClient';

const patientSearchTheme = {
  container: styles.patientSearchClass,
  suggestionsContainerOpen: styles.suggestionsContainer,
};

const patientSearchInputProps = {
  classStyles: styles.patientSearchInput,
  placeholder: 'Search...',
};

const CHAT_LIST_LIMIT = 15;

const HeaderSkeleton = () => (
  <div className={styles.skeleton}>
    <Skeleton circle className={styles.skeletonAvatar} height={35} width={35} />
    <Skeleton className={styles.skeletonRow} width={150} />
  </div>
);

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
      isNewconversation: false,
    };

    this.addNewChat = this.addNewChat.bind(this);
    this.loadChatList = this.loadChatList.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.togglePatientsList = this.togglePatientsList.bind(this);
    this.togglePatientsInfo = this.togglePatientsInfo.bind(this);
    this.toggleShowMessageContainer = this.toggleShowMessageContainer.bind(this);
    this.selectChatOrCreate = this.selectChatOrCreate.bind(this);
    this.selectChatIfIdIsProvided = this.selectChatIfIdIsProvided.bind(this);
  }

  componentDidMount() {
    this.props.getChatCategoryCounts();
    this.props
      .fetchEntitiesRequest({
        id: 'dashAccount',
        key: 'accounts',
      })
      .then(() => {
        this.props.setChatIsLoading(false);
        this.props.setConversationIsLoading(false);
      });
    this.selectChatIfIdIsProvided(this.props.match.params.chatId);
  }

  componentWillUnmount() {
    this.props.selectChat(null);
    this.props.setNewChatTypeStatus(false);
  }

  loadChatByCount = async (count) => {
    await this.chatListLoader()(count, CHAT_LIST_LIMIT).then(() =>
      this.receivedChatsPostUpdate({}),);
  };

  loadChatList() {
    return this.chatListLoader()(CHAT_LIST_LIMIT, this.state.chats).then((result) =>
      this.receivedChatsPostUpdate(result),);
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
      this.setState({ tabIndex: tabsConstants.OPEN_TAB }, () => this.loadChatList());
    }
  }

  togglePatientsList() {
    this.setState(
      (previousState) => ({
        showPatientsList: !previousState.showPatientsList,
        showPatientInfo: false,
        showMessageContainer: false,
      }),
      () => {
        this.props.setLocation('/chat');
        this.props.selectChat(null);
      },
    );
  }

  togglePatientsInfo() {
    this.setState((previousState) => ({
      showPatientInfo: !previousState.showPatientInfo,
      showPatientsList: false,
      showMessageContainer: !previousState.showMessageContainer,
    }));
  }

  toggleShowMessageContainer(isLoading) {
    this.setState((previousState) => ({
      showMessageContainer: !previousState.showMessageContainer,
      showPatientsList: false,
      showPatientInfo: false,
      isNewconversation: isLoading ?? false,
    }));
  }

  selectChatOrCreate(patient) {
    const selectChatCallback = async () => {
      if (!this.state.showMessageContainer) {
        this.toggleShowMessageContainer();
      }
      this.props.selectChatByPatientId(patient.ccId || patient.id);
    };
    const patientId = patient.ccId || patient.id;
    httpClient()
      .get(`/api/patients/${patientId}/chat`)
      .then(({ data: { chatId } }) => {
        console.log('chatId=', chatId);
        Promise.resolve(this.props.getChatEntity(chatId)).then((selectedChat) => {
          if (selectedChat) {
            const { isOpen } = selectedChat.toJS();
            const chatState = isOpen ? tabsConstants.OPEN_TAB : tabsConstants.CLOSED_TAB;
            this.changeTab(chatState, selectChatCallback);
          }
        });
      });
  }

  receivedChatsPostUpdate(result) {
    this.setState((previousState) => ({
      chats: previousState.chats + Object.keys(result.chats || {}).length,
      moreData: !(
        Object.keys(result).length === 0 || Object.keys(result.chats).length < CHAT_LIST_LIMIT
      ),
    }));
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
          this.props.setConversationIsLoading(false);
        });
      },
    );
  }

  showPatientInfo() {
    const { conversationIsLoading } = this.state.isNewconversation ? false : this.props;

    if (conversationIsLoading) {
      return <DesktopSkeleton />;
    }

    return (
      <div className={styles.rightInfo}>
        <ErrorBoundary FallbackComponent={ModuleError}>
          <Button
            icon="arrow-left"
            onClick={this.togglePatientsInfo}
            className={styles.closePatientInfo}
          />
          <PatientInfo />
          <div className={styles.bottomInfo} />
        </ErrorBoundary>
      </div>
    );
  }

  addNewChat() {
    // No data yet, this just sets it to not be null
    if (this.props.cancelToken !== null) {
      this.props.cancelToken.call();
    }

    this.props.selectChat(null, {});
    this.toggleShowMessageContainer();
    this.props.setNewChatTypeStatus(true);
    this.setState({ isNewconversation: true });
    this.renderMessageContainer();
  }

  renderChatList() {
    const { chatsFetching } = this.props;
    const { moreData, tabIndex } = this.state;

    return (
      <SBody>
        <ErrorBoundary FallbackComponent={ModuleError}>
          <List className={styles.chatsList}>
            <InfiniteScroll
              loadMore={this.loadChatList}
              loader={<Loader key="loader" />}
              hasMore={moreData && !chatsFetching}
              initialLoad={false}
              useWindow={false}
              threshold={1}
            >
              <ChatList tabIndex={tabIndex} onChatClick={this.toggleShowMessageContainer} />
            </InfiniteScroll>
          </List>
        </ErrorBoundary>
      </SBody>
    );
  }

  renderMessageContainer() {
    const { showPatientInfo, tabIndex, isNewconversation } = this.state;
    let { conversationIsLoading } = this.props;
    if (isNewconversation) {
      conversationIsLoading = false;
    }
    const patientInfoStyle = classnames(styles.rightSplit, {
      [styles.slideIn]: showPatientInfo,
      [styles.hideContainer]: !showPatientInfo,
    });

    const container = classnames(styles.leftSplit, { [styles.hideContainer]: showPatientInfo });

    return (
      <SBody>
        <div className={styles.splitWrapper}>
          <div className={container}>
            <ErrorBoundary FallbackComponent={ModuleError}>
              <SHeader className={styles.messageHeader}>
                {conversationIsLoading ? (
                  <HeaderSkeleton />
                ) : (
                  <ToHeader
                    onPatientInfoClick={this.togglePatientsInfo}
                    onPatientListClick={this.togglePatientsList}
                    onSearch={this.selectChatOrCreate}
                    loadChatByCount={this.loadChatByCount}
                    tabIndex={tabIndex}
                  />
                )}
              </SHeader>
              {!conversationIsLoading ? (
                <MessageContainer
                  setTab={this.changeTab}
                  isNewconversation={isNewconversation}
                  selectChatOrCreate={this.selectChatOrCreate}
                />
              ) : null}
            </ErrorBoundary>
          </div>
          <div className={patientInfoStyle}>{this.showPatientInfo()}</div>
        </div>
      </SBody>
    );
  }

  renderHeading() {
    const newChatStyle = classnames(styles.addNewChatButton);

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
            color="grey"
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
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <div className={classnames(styles.chatWrapper)}>
          <div
            className={classnames(styles.patientsList, {
              [styles.slideIn]: showPatientsList,
              [styles.hideContainer]: !showPatientsList,
            })}
          >
            <ErrorBoundary FallbackComponent={ModuleError}>
              <Card noBorder className={styles.leftCard}>
                <SContainer>
                  {this.renderHeading()}
                  {this.renderChatList()}
                </SContainer>
              </Card>
            </ErrorBoundary>

            <ChatMenu changeTab={this.changeTab} index={this.state.tabIndex} />
          </div>
          <ErrorBoundary FallbackComponent={ModuleError}>
            <Card
              noBorder
              className={classnames(styles.rightCard, { [styles.slideIn]: shouldSlideIn })}
            >
              <SContainer>{this.renderMessageContainer()}</SContainer>
            </Card>
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
    );
  }
}

ChatMessage.defaultProps = {
  match: { params: { chatId: null } },
  chatsFetching: false,
};

ChatMessage.propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ chatId: PropTypes.string }) }),
  selectChat: PropTypes.func.isRequired,
  setNewChatTypeStatus: PropTypes.func.isRequired,
  loadChatList: PropTypes.func.isRequired,
  loadUnreadChatList: PropTypes.func.isRequired,
  loadFlaggedChatList: PropTypes.func.isRequired,
  loadOpenChatList: PropTypes.func.isRequired,
  loadClosedChatList: PropTypes.func.isRequired,
  cleanChatList: PropTypes.func.isRequired,
  setLocation: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  chatsFetching: PropTypes.bool,
  getChatEntity: PropTypes.func.isRequired,
  getChatCategoryCounts: PropTypes.func.isRequired,
  conversationIsLoading: PropTypes.bool.isRequired,
  selectChatByPatientId: PropTypes.func.isRequired,
  setChatIsLoading: PropTypes.func.isRequired,
  setConversationIsLoading: PropTypes.func.isRequired,
  cancelToken: PropTypes.func.isRequired,
};

function mapStateToProps({ apiRequests, chat }) {
  const wasChatsFetched =
    apiRequests.get('fetchingChats') && apiRequests.get('fetchingChats').get('wasFetched');
  const chatsFetching =
    apiRequests.get('fetchingChats') && apiRequests.get('fetchingChats').get('isFetching');
  return {
    wasChatsFetched,
    chatsFetching,
    conversationIsLoading: chat.get('conversationIsLoading'),
    cancelToken: chat.get('cancelToken'),
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
      setLocation: push,
      fetchEntitiesRequest,
      getChatEntity,
      getChatCategoryCounts,
      selectChatByPatientId,
      setChatIsLoading,
      setConversationIsLoading,
      setNewChatTypeStatus,
    },
    dispatch,
  );
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ChatMessage);
