
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { Card } from '../../library';
import DonnaToDoTabs from './DonnaToDoTabs';
import accountShape from '../../library/PropTypeShapes/accountShape';
import Tasks from './Tasks';
import styles from './styles.scss';

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

  componentWillReceiveProps(nextProps) {
    const currentDate = moment(this.props.dashboardDate);
    const nextDate = moment(nextProps.dashboardDate);
    if (currentDate.toISOString() !== nextDate.toISOString()) {
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
    const {
      account, loadingToDos, reminders, recalls, reviews, wasAccountFetched,
    } = this.props;

    return (
      <Card className={styles.card} runAnimation loaded={!loadingToDos && wasAccountFetched}>
        <div className={styles.wrapper}>
          <DonnaToDoTabs toDoIndex={this.state.toDoIndex} changeTab={this.changeTab} />
          {wasAccountFetched && (
            <Tasks
              toDoIndex={this.state.toDoIndex}
              reminders={reminders}
              recalls={recalls}
              reviews={reviews}
              loadingToDos={loadingToDos}
              timezone={account.timezone}
            />
          )}
        </div>
      </Card>
    );
  }
}

function mapStateToProps({
  entities, auth, apiRequests, dashboard,
}) {
  const wasAccountFetched =
    apiRequests.get('dashAccount') && apiRequests.get('dashAccount').wasFetched;

  const account = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  return {
    account,
    wasAccountFetched,
    loadingToDos: dashboard.get('loadingToDos'),
    reminders: dashboard.get('reminders'),
    recalls: dashboard.get('recalls'),
    reviews: dashboard.get('reviews'),
    dashboardDate: dashboard.get('dashboardDate'),
  };
}

DonnaToDoListContainer.propTypes = {
  wasAccountFetched: PropTypes.bool,
  fetchDonnasToDos: PropTypes.func.isRequired,
  account: PropTypes.shape(accountShape).isRequired,
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
};

export default connect(mapStateToProps, null)(DonnaToDoListContainer);
