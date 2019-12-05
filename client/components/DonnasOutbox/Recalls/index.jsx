
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import { List, ListItem, Loading, Grid, Row, Col } from '../../library';
import styles from './styles.scss';
import { httpClient } from '../../../util/httpClient';

const getAttrFromPatient = (patient, primaryType) => {
  const attrs = {
    sms: 'mobilePhoneNumber',
    phone: 'mobilePhoneNumber',
    email: 'email',
  };

  return patient[attrs[primaryType]];
};

function SuccessfulList({ success, primaryType }) {
  return (
    <div className={styles.successList}>
      {success.map((patient) => {
        const lastAppt = patient.appointments[patient.appointments.length - 1];
        const lastApptDate = moment(lastAppt.startDate).format('DD/MM/YYYY');
        return (
          <Grid className={styles.successItemWrapper}>
            <Row>
              <Col xs={4}>
                {patient.firstName} {patient.lastName}
              </Col>
              <Col xs={4}>{getAttrFromPatient(patient, primaryType)}</Col>
              <Col xs={4}>{lastApptDate}</Col>
            </Row>
          </Grid>
        );
      })}
    </div>
  );
}

class RecallListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  toggleExpanded() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { recall } = this.props;
    return (
      <div className={styles.listItemWrapper}>
        <ListItem className={styles.listItem} onClick={this.toggleExpanded}>
          <div className={styles.col}>Type: {recall.primaryType}</div>
          <div className={styles.col}>Length: {recall.lengthSeconds}</div>
          <div className={styles.col}>Success: {recall.success.length}</div>
          <div className={styles.col}>Fail: {recall.errors.length}</div>
        </ListItem>
        {this.state.expanded ? (
          <SuccessfulList success={recall.success} primaryType={recall.primaryType} />
        ) : null}
      </div>
    );
  }
}

export default class OutboxRecalls extends Component {
  constructor(props) {
    super(props);

    // Using state because configurations are not supported
    this.state = {
      isLoading: true,
      recalls: [],
      selectedRecall: null,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  UNSAFE_componentWillMount() {
    // this.setState({ isLoading: true });

    const { account } = this.props;
    return Promise.all([httpClient().get(`/api/accounts/${account.id}/recalls/list`)])
      .then(([recallsData]) => {
        console.log('recallsData', recallsData);
        this.setState({
          isLoading: false,
          recalls: recallsData.data,
        });
      })
      .catch(err => console.error('Failed to load configs', err));
  }

  handleTabChange(tabIndex) {
    this.setState({ tabIndex });
  }

  render() {
    const { account } = this.props;
    const { recalls, isLoading } = this.state;

    let totalSuccess = 0;
    let totalErrors = 0;
    recalls.forEach((r) => {
      totalSuccess += r.success.length;
      totalErrors += r.errors.length;
    });

    if (isLoading) {
      return (
        <div className={styles.loadingWrapper}>
          <Loading />
        </div>
      );
    }

    return (
      <div className={styles.recallsWrapper}>
        {!recalls.length ? (
          <div>No Recalls</div>
        ) : (
          <div>
            <h4>Total Success: {totalSuccess}</h4>
            <h4>Total Errors: {totalErrors}</h4>
            <List>
              {recalls.map(recall => (
                <RecallListItem key={recall.id} recall={recall} />
              ))}
            </List>
          </div>
        )}
      </div>
    );
  }
}

OutboxRecalls.propTypes = {
  account: PropTypes.object.isRequired,
};
