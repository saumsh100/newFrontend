import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { Card, getISODate } from '../../library';
import DonnaToDoTabs from './DonnaToDoTabs';
import accountShape from '../../library/PropTypeShapes/accountShape';
import Tasks from './Tasks';
import styles from '../styles';

class DonnaToDoListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toDoIndex: 0,
    };
    this.changeTab = this.changeTab.bind(this);
  }

  componentDidMount() {
    this.props.fetchDonnasToDos(this.state.toDoIndex);
  }

  componentDidUpdate(prevProps) {
    const currentDate = getISODate(this.props.dashboardDate, this.props.account.timezone);
    const previousDate = getISODate(prevProps.dashboardDate, this.props.account.timezone);
    if (currentDate !== previousDate) {
      this.props.fetchDonnasToDos(this.state.toDoIndex);
    }
  }

  changeTab(index) {
    if (index !== this.state.index) {
      this.props.fetchDonnasToDos(index);
      this.setState({
        toDoIndex: index,
      });
    }
  }

  render() {
    const { account, loadingToDos, reminders, recalls, reviews, wasAccountFetched } = this.props;

    return (
      <Card
        className={styles.donnaTodoContainer_card}
        runAnimation
        loaded={!loadingToDos && wasAccountFetched}
      >
        <div className={styles.donnaTodoContainer_wrapper}>
          <DonnaToDoTabs toDoIndex={this.state.toDoIndex} changeTab={this.changeTab} />
          {wasAccountFetched && (
            <Tasks
              toDoIndex={this.state.toDoIndex}
              reminders={reminders}
              recalls={recalls}
              reviews={reviews}
              account={account}
              loadingToDos={loadingToDos}
              timezone={account.timezone}
            />
          )}
        </div>
      </Card>
    );
  }
}

function mapStateToProps({ auth, apiRequests, dashboard }) {
  const wasAccountFetched =
    apiRequests.get('dashAccount') && apiRequests.getIn(['dashAccount', 'wasFetched']);

  return {
    account: auth.get('account'),
    wasAccountFetched,
    loadingToDos: dashboard.get('loadingToDos'),
    reminders: dashboard.get('reminders'),
    recalls: dashboard.get('recalls'),
    reviews: dashboard.get('reviews'),
    dashboardDate: dashboard.get('dashboardDate'),
    timezone: auth.get('timezone'),
  };
}

DonnaToDoListContainer.propTypes = {
  wasAccountFetched: PropTypes.bool,
  fetchDonnasToDos: PropTypes.func.isRequired,
  account: PropTypes.shape(accountShape),
  loadingToDos: PropTypes.bool,
  reviews: PropTypes.instanceOf(List),
  recalls: PropTypes.instanceOf(List),
  reminders: PropTypes.instanceOf(List),
  dashboardDate: PropTypes.string.isRequired,
};

DonnaToDoListContainer.defaultProps = {
  wasAccountFetched: false,
  reviews: List,
  recalls: List,
  reminders: List,
  loadingToDos: false,
  account: null,
};

export default connect(mapStateToProps, null)(DonnaToDoListContainer);
