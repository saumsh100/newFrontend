
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import immutable from 'immutable';
import main from '../PatientList/main.scss';
import ChatListContainer from './ChatListContainer';
import MessageContainer from './MessageContainer';
import UserInfo from './UserInfo';
import { Row, Avatar, Col, CardHeader, Card, List, Grid, InfiniteScroll, AutoCompleteForm } from '../../library';
import { fetchEntities } from '../../../thunks/fetchEntities';
import styles from './styles.scss';

class ChatMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearch: false,
      value: '',
      searched: [],
      results: [],
    };

    this.submit = this.submit.bind(this);
    this.resetState = this.resetState.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.userClick = this.userClick.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
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

  getSuggestions(value) {
    return this.submitSearch({
      patients: value,
    }).then(() => {
      value = value.split(' ');
      const inputValue = [];
      inputValue[0] = new RegExp(value[0], 'i');
      inputValue[1] = new RegExp(value[1], 'i');
      const inputLength = inputValue.length;

      const patientSearch = this.props.searchedPatients || [] ;

      const searched = patientSearch.map((userId) => {
        const avatar = (this.props.patients.get(userId) ? this.props.patients.get(userId).toJS(): {} );
        const name = `${this.props.patients.get(userId).get('firstName')} ${this.props.patients.get(userId).get('lastName')}`;
        const age = moment().diff(this.props.patients.get(userId).get('birthDate'), 'years');
        const display = (<div className={main.searchList} onClick={this.userClick.bind(null, userId)}>
          <Avatar className={styles.users__photo} user={avatar} size="lg"/>
          <div className={main.grow}>
            <div className={main.users__header}>
              <div className={main.users__name}>
                {name},&nbsp;{age}
              </div>
            </div>
          </div>
        </div>);

        return {
          id: this.props.patients.get(userId).get('id'),
          display,
          name,
          email: this.props.patients.get(userId).get('email'),
        };
      });

      const results = inputLength === 0 ? [] : searched.filter((person) => {
        return inputValue[1].test(person.fullName) || inputValue[0].test(person.fullName) || inputValue[0].test(person.email);
      });

      this.setState({
        results,
        searched,
      });

      return results;
    });
  };

  submitSearch(value){
    if (value.patients.length >= 2) {
      return this.props.fetchEntities({url: '/api/patients/search', params: value})
        .then(result => {
          this.props.searchPatient(Object.keys(result.patients));
        });
    }
    return new Promise((resolve) => { resolve(); });
  }

  render() {
    const info = (this.props.currentPatient ? `${this.props.currentPatient.firstName} ${this.props.currentPatient.lastName} ${this.props.currentPatient.mobilePhoneNumber}` : null);
    const displayinfo = (this.props.currentPatient ? <UserInfo
      currentPatient={this.props.currentPatient}
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

      displayAnonInfo = <UserInfo
        currentPatient={{
          avatarUrl: '/images/avatar.png',
          anonPhone: userPhone,
        }}
      />;
    }

    const inputProps = {
      placeholder: 'Search...',
      value: this.state.value,
      onChange: this.onChange,
      onKeyDown: this.submit,
      name: 'patients',
    };

    return (
      <Grid>
        <Row className={styles.patients}>
          <Col xs={12} sm={4} md={4} lg={3}>
            <div className={styles.patients_list}>
              <Row className={styles.topRow}>
                <Card className={styles.headerInput}>
                  <div className={styles.header}>
                    <CardHeader title="&nbsp;" />
                  </div>
                  <div className={styles.input}>
                    <AutoCompleteForm
                      value={this.state.value}
                      getSuggestions={this.getSuggestions}
                      inputProps={inputProps}
                      data-test-id="patientSearch"
                      focusInputOnSuggestionClick={false}
                      getSuggestionValue={suggestion => suggestion.name}
                      classStyles={styles.chatSearch}
                    />
                  </div>
                </Card>
              </Row>
              <Row className={styles.listRow}>
                <Card className={styles.upcomingHead}>
                  <List className={styles.patients_list__users}>
                    <InfiniteScroll
                      loadMore={this.props.loadMore}
                      loader={<div style={{ clear: 'both' }}>Loading...</div>}
                      hasMore={this.props.moreData}
                      initialLoad={false}
                      useWindow={false}
                      threshold={1}
                    >
                      <ChatListContainer
                        textMessages={this.props.textMessages}
                        chats={this.props.chats}
                        patients={this.props.patients}
                        selectedChat={this.props.selectedChat}
                        onClick={this.props.setCurrentPatient}
                        currentPatient={this.props.currentPatient}
                      />
                    </InfiniteScroll>
                  </List>
                </Card>
              </Row>
            </div>
          </Col>
          <Col xs={12} sm={8} md={8} lg={9} className={styles.messages}>
            <div className={styles.topInfo}>
              <div>
                <span>To: </span>{info || userPhone}
              </div>
            </div>
            <div className={styles.main}>
              <MessageContainer
                selectedChat={this.props.selectedChat}
                setSelectedPatient={this.props.setCurrentPatient}
                currentPatient={this.props.currentPatient}
                textMessages={this.props.textMessages}
              />
              <div className={styles.rightInfo}>
                {displayinfo || displayAnonInfo}
                <div className={styles.bottomInfo}>

                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
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

function mapStateToProps({ entities }) {
  return {
    activeAccount: entities.getIn(['accounts', 'models']).first(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ChatMessage);
