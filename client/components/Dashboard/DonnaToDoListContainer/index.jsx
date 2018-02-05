
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Card } from '../../library';
import DonnaToDoTabs from './DonnaToDoTabs';
import Tasks from './Tasks';
import styles from './styles.scss';

class DonnaToDoListContainer extends Component {
  constructor(props){
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
    const currentDate = moment(this.props.dashboard.get('dashboardDate'));
    const nextPropsDate = moment(nextProps.dashboard.get('dashboardDate'));
    if (!nextPropsDate.isSame(currentDate, 'month') || !nextPropsDate.isSame(currentDate, 'day') || !nextPropsDate.isSame(currentDate, 'year')) {
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
      dashboard,
    } = this.props;

    const loadingToDos = dashboard.get('loadingToDos');
    const reminders = dashboard.get('reminders');

    return (
      <Card className={styles.card} runAnimation loaded={!loadingToDos}>
        <div className={styles.wrapper}>
          <DonnaToDoTabs
            toDoIndex={this.state.toDoIndex}
            changeTab={this.changeTab}
          />
          <Tasks
            toDoIndex={this.state.toDoIndex}
            reminders={reminders}
            loadingToDos={loadingToDos}
          />
        </div>
      </Card>
    );
  }
}

DonnaToDoListContainer.propTypes = {
  accountFetched: PropTypes.bool,
  dashboard: PropTypes.object,
};

export default DonnaToDoListContainer;