import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import main from '../PatientList/main.scss';
import styles from './styles.scss';
import ChatListContainer from './ChatListContainer';
import MessageContainer from './MessageContainer';
import UserInfo from './UserInfo';
import { Row, Col, CardHeader, Card, List, Grid, InfiniteScroll, AutoCompleteForm } from '../../library';
import { fetchEntities } from '../../../thunks/fetchEntities';


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

      if (id) {
        this.props.setCurrentPatient(id);
      }
    }
  }

  userClick(id) {
    this.props.setCurrentPatient(id);
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
        const avatar = (this.props.patients.get(userId).get('avatarUrl') ? this.props.patients.get(userId).get('avatarUrl') : '/images/avatar.png');
        const name = `${this.props.patients.get(userId).get('firstName')} ${this.props.patients.get(userId).get('lastName')}`;
        const age = moment().diff(this.props.patients.get(userId).get('birthDate'), 'years');
        const display = (<div className={main.searchList} onClick={this.userClick.bind(null, userId)}>
          <img className={styles.users__photo} src={avatar} alt="photo" />
          <div className={main.grow}>
            <div className={main.users__header}>
              <div className={main.users__name}>
                {name}, {age}
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
    const info = (this.props.currentPatient ? `${this.props.currentPatient.firstName} ${this.props.currentPatient.lastName} ${this.props.currentPatient.phoneNumber}` : null);
    const displayinfo = (this.props.currentPatient ? <UserInfo
      currentPatient={this.props.currentPatient}
    /> : null);

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
                    <CardHeader title="Chat Search" />
                  </div>
                  <div className={styles.input}>
                    <AutoCompleteForm
                      value={this.state.value}
                      getSuggestions={this.getSuggestions}
                      inputProps={inputProps}
                      focusInputOnSuggestionClick={false}
                      getSuggestionValue={suggestion => suggestion.name}
                    />
                  </div>
                </Card>
              </Row>
              <Row className={styles.listRow}>
                <Card className={styles.upcomingHead}>
                  <div className={styles.header}>
                    <CardHeader title="Messages" />
                  </div>
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
                <span>To: </span>{info}
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
                {displayinfo}
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
  moreData: PropTypes.bool,
  textMessages: PropTypes.object,
  loadMore: PropTypes.func.isRequired,
  searchPatient: PropTypes.func.isRequired,
  setCurrentPatient: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ChatMessage);
