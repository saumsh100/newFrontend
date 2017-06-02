import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import styles from '../main.scss';
import PatientListItem from '../PatientListItem';
import {
  AutoCompleteForm,
  InfiniteScroll,
  Row,
  Card,
  List,
  CardHeader,
} from '../../../library';
import { fetchEntities } from '../../../../thunks/fetchEntities';


class UpcomingPatientList extends Component {
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
        return this.props.fetchEntities({url: `/api/chats/patient/${id}`}).then((result) => {
          const currentPatientId = {
            id,
          };
          this.props.setCurrentPatient(currentPatientId);
        });
      }
    }
  }

  userClick(id) {
    return this.props.fetchEntities({url: `/api/chats/patient/${id}`}).then((result) => {
      const currentPatientId = {
        id,
      };
      this.props.setCurrentPatient(currentPatientId);
    });
  }

  getSuggestions(value) {
    return this.props.submitSearch({
      patients: value,
    }).then(() => {
      value = value.split(' ');
      const inputValue = [];
      inputValue[0] = new RegExp(value[0], 'i');
      inputValue[1] = new RegExp(value[1], 'i');
      const inputLength = inputValue.length;

      const searched = this.props.searchedPatients.map((userId) => {
        const avatar = (this.props.patients.get(userId).get('avatarUrl') ? this.props.patients.get(userId).get('avatarUrl') : '/images/avatar.png');
        const name = `${this.props.patients.get(userId).get('firstName')} ${this.props.patients.get(userId).get('lastName')}`;
        const age = moment().diff(this.props.patients.get(userId).get('birthDate'), 'years');
        const display = (<div className={styles.searchList} onClick={this.userClick.bind(null, userId)}>
          <img className={styles.users__photo} src={avatar} alt="photo" />
          <div className={styles.grow}>
            <div className={styles.users__header}>
              <div className={styles.users__name}>
                {name}, {age}
              </div>
            </div>
          </div>
        </div>);

        return {
          id: this.props.patients.get(userId).get('id'),
          display: display,
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

  resetState() {
    this.setState({
      showSearch: false,
    });
  }

  onChange(event, { newValue }) {
    this.setState({
      value: newValue,
    });
  };

  render() {
    const inputProps = {
      placeholder: 'Search...',
      value: this.state.value,
      onChange: this.onChange,
      onKeyDown: this.submit,
      name: 'patients',
    };
    const display = (this.props.patientList[0] ? (this.props.patientList.map((user, i) => {
      return (
        <PatientListItem
          key={user.appointment.id + i}
          user={user}
          currentPatient={this.props.currentPatient}
          setCurrentPatient={this.props.setCurrentPatient.bind(null, user)}
        />
      );
    })) : (<div className={styles.patients_list__users_loading} />)
    );

    return (
      <div className={styles.patients_list}>
        <Row className={styles.topRow}>
          <Card className={styles.headerInput}>
            <div className={styles.header}>
              <CardHeader title="Patient Search" />
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
              <CardHeader title="Upcoming Patients" />
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
                {display}
              </InfiniteScroll>
            </List>
          </Card>
        </Row>
      </div>
    );
  }
}

UpcomingPatientList.propTypes = {
  patientList: PropTypes.array,
  setCurrentPatient: PropTypes.func,
  loadMore: PropTypes.func,
  currentPatient: PropTypes.object,
  moreData: PropTypes.bool,
  submitSearch: PropTypes.func,
  setSearchPatient: PropTypes.func,
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

export default enhance(UpcomingPatientList);
