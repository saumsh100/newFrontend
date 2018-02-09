
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import immutable from 'immutable';
import main from '../Patients/PatientList/main.scss';
import ChatList from './ChatList';
import MessageContainer from './MessageContainer';
import PatientInfo from './PatientInfo';
import ToHeader from './ToHeader';
import {
  Button,
  Row,
  Avatar,
  Col,
  SContainer,
  SHeader,
  SBody,
  CardHeader,
  Card,
  List,
  Grid,
  InfiniteScroll,
  Tabs,
  Tab,
  Input,
} from '../library';
import { fetchEntities } from '../../thunks/fetchEntities';
import { setNewChat, mergeNewChat, setSelectedChatId } from '../../reducers/chat';
import PatientSearch from '../PatientSearch';
import styles from './styles.scss';

const patientSearchTheme = {
  container: styles.patientSearchClass,
};

const patientSearchInputProps = {
  classStyles: styles.patientSearchInput,
  placeholder: 'Search...',
};

class ChatMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearch: false,
      value: '',
      searched: [],
      results: [],
      tabIndex: 0,
    };

    this.addNewChat = this.addNewChat.bind(this);
    this.selectChatOrCreate = this.selectChatOrCreate.bind(this);
    this.submit = this.submit.bind(this);
    this.resetState = this.resetState.bind(this);
    // this.submitSearch = this.submitSearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.userClick = this.userClick.bind(this);
    // this.getSuggestions = this.getSuggestions.bind(this);
  }

  addNewChat() {
    // No data yet, this just sets it to not be null
    this.props.setNewChat({});
    this.props.setSelectedChatId(null);
  }

  selectChatOrCreate(patient) {
    // If this patient has a chat, select the chat
    if (patient.chatId) {
      this.props.setSelectedChatId(patient.chatId);
      this.props.setNewChat(null);
    } else {
      this.props.setSelectedChatId(null);
      this.props.setNewChat({ patientId: patient.id });
    }
  }

  submit(event) {
    if (event.key === 'Enter') {
      let id = null;
      this.state.results.forEach((result) => {
        if (result.name === this.state.value) {
          id = result.id;
        }
      });

      const map = immutable.fromJS(this.props.chats);
      const selectedChat = map.filter(chat => chat.get('patientId') === id).first() || {};

      if (id) {
        return this.props.fetchEntities({ url: `/api/chats/patient/${id}` }).then(() => {
          this.props.setCurrentPatient(id, selectedChat.id);
        });
      }
    }
  }

  userClick(id) {
    const map = immutable.fromJS(this.props.chats);
    const selectedChat = map.filter(chat => chat.get('patientId') === id).first() || {};

    return this.props.fetchEntities({ url: `/api/chats/patient/${id}` }).then(() => {
      this.props.setCurrentPatient(id, selectedChat.id);
    });
  }

  resetState() {
    this.setState({
      showSearch: false,
    });
  }

  onChange(e, { newValue }) {
    this.setState({
      value: newValue,
    });
  };

  render() {
    const {
      newChat,
    } = this.props;

    const info = (this.props.currentPatient ? `${this.props.currentPatient.firstName} ${this.props.currentPatient.lastName} ${this.props.currentPatient.mobilePhoneNumber}` : null);
    const displayinfo = (this.props.currentPatient ? <PatientInfo
      patient={this.props.currentPatient}
    /> : null);

    let userPhone = null;
    let displayAnonInfo = null;

    if (this.props.selectedChat && !this.props.selectedChat.patientId && this.props.selectedChat.textMessages[0]) {
      const firstMessage = this.props.textMessages.get(this.props.selectedChat.textMessages[0]).toJS();

      if (firstMessage.to !== this.props.activeAccount.toJS().twilioPhoneNumber) {
        userPhone = firstMessage.to;
      } else {
        userPhone = firstMessage.from;
      }

      /*displayAnonInfo = (
        <PatientInfo
          patient={{
            avatarUrl: '',
            anonPhone: userPhone,
          }}
        />
      );*/
      displayAnonInfo = null;
    }

    const inputProps = {
      placeholder: 'Search...',
      value: this.state.value,
      onChange: this.onChange,
      onKeyDown: this.submit,
      name: 'patients',
    };

    return (
      <div className={styles.chatWrapper}>
        <div className={styles.patientsList}>
          <Card className={styles.leftCard} noBorder>
            <SContainer>
              <SHeader className={styles.leftCardHeader}>
                <div className={styles.searchSection}>
                  <div className={styles.searchInputWrapper}>
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
                  />
                </div>
                {/*<div className={styles.actionsSection}>

                    </div>*/}
                <div className={styles.tabsSection}>
                  <Tabs
                    fluid
                    index={this.state.tabIndex}
                    onChange={(index) => this.setState({ tabIndex: index })}
                    noUnderLine
                  >
                    <Tab label="All" inactiveClass={styles.inactiveTab} activeClass={styles.activeTab} />
                    <Tab label="Unread" inactiveClass={styles.inactiveTab} activeClass={styles.activeTab} />
                    <Tab label="Flagged" inactiveClass={styles.inactiveTab} activeClass={styles.activeTab} />
                  </Tabs>
                </div>
              </SHeader>
              <SBody>
                <List className={styles.chatsList}>
                  <InfiniteScroll
                    loadMore={this.props.loadMore}
                    loader={<div style={{ clear: 'both' }}>Loading...</div>}
                    hasMore={this.state.tabIndex === 0 && this.props.moreData}
                    initialLoad={false}
                    useWindow={false}
                    threshold={1}
                  >
                    <ChatList
                      textMessages={this.props.textMessages}
                      chats={this.props.chats}
                      patients={this.props.patients}
                      selectedChat={this.props.selectedChat}
                      onClick={this.props.setCurrentPatient}
                      currentPatient={this.props.currentPatient}
                      newChat={newChat}
                      filterIndex={this.state.tabIndex}
                    />
                  </InfiniteScroll>
                </List>
              </SBody>
            </SContainer>
          </Card>
        </div>
        <Card
          noBorder
          className={styles.rightCard}
        >
          <SContainer>
            <SHeader className={styles.messageHeader}>
              <ToHeader />
            </SHeader>
            <SBody>
              <div className={styles.splitWrapper}>
                <div className={styles.leftSplit}>
                  <MessageContainer
                    newChat={newChat}
                    selectedChat={this.props.selectedChat}
                    currentPatient={this.props.currentPatient}
                    textMessages={this.props.textMessages}
                  />
                </div>
                <div className={styles.rightSplit}>
                  <div className={styles.rightInfo}>
                    {displayinfo || displayAnonInfo}
                    <div className={styles.bottomInfo}>

                    </div>
                  </div>
                </div>
              </div>
            </SBody>
          </SContainer>
        </Card>
      </div>
    );
  }
}

ChatMessage.propTypes = {
  currentPatient: PropTypes.object,
  searchedPatients: PropTypes.object,
  chats: PropTypes.object,
  patients: PropTypes.object,
  selectedChat: PropTypes.object,
  activeAccount: PropTypes.object,
  moreData: PropTypes.bool,
  textMessages: PropTypes.object,
  loadMore: PropTypes.func.isRequired,
  searchPatient: PropTypes.func.isRequired,
  setCurrentPatient: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, chat }) {
  return {
    // TODO: this is not right... can't get activeAccount this way!
    activeAccount: entities.getIn(['accounts', 'models']).first(),
    newChat: chat.get('newChat'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    setNewChat,
    setSelectedChatId,
    mergeNewChat,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ChatMessage);
