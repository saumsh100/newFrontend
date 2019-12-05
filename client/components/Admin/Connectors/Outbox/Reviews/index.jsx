
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import { List, ListItem, Loading, Grid, Row, Col } from '../../../../library';
import styles from './styles.scss';
import { httpClient } from '../../../../../util/httpClient';

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
        const reviewAppt = patient.appointment;
        const reviewApptDate = moment(reviewAppt.startDate).format('h:mma MMM Do, YYYY');
        return (
          <Grid className={styles.successItemWrapper}>
            <Row>
              <Col xs={4}>
                {patient.firstName} {patient.lastName}
              </Col>
              <Col xs={4}>{getAttrFromPatient(patient, primaryType)}</Col>
              <Col xs={4}>{reviewApptDate}</Col>
            </Row>
          </Grid>
        );
      })}
    </div>
  );
}

class ReminderListItem extends Component {
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
    const { review } = this.props;
    return (
      <div className={styles.listItemWrapper}>
        <ListItem className={styles.listItem} onClick={this.toggleExpanded}>
          <div className={styles.col}>Type: {'email'}</div>
          <div className={styles.col}>Length: {'1 week'}</div>
          <div className={styles.col}>Success: {review.success.length}</div>
          <div className={styles.col}>Fail: {review.errors.length}</div>
        </ListItem>
        {this.state.expanded ? (
          <SuccessfulList success={review.success} primaryType="email" />
        ) : null}
      </div>
    );
  }
}

export default class OutboxReviews extends Component {
  constructor(props) {
    super(props);

    // Using state because configurations are not supported
    this.state = {
      isLoading: true,
      reviews: null,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { account } = this.props;
    return Promise.all([httpClient().get(`/api/accounts/${account.id}/reviews/list`)])
      .then(([reviewsData]) => {
        console.log('reviewsData', reviewsData);
        this.setState({
          isLoading: false,
          reviews: reviewsData.data,
        });
      })
      .catch(err => console.error('Failed to load configs', err));
  }

  handleTabChange(tabIndex) {
    this.setState({ tabIndex });
  }

  render() {
    const { account } = this.props;
    const { reviews, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className={styles.loadingWrapper}>
          <Loading />
        </div>
      );
    }

    const totalSuccess = reviews && reviews.success ? reviews.success.length : 'error';
    const totalErrors = reviews && reviews.errors ? reviews.errors.length : 'error';

    return (
      <div className={styles.reviewsWrapper}>
        {!reviews ? (
          <div>No Reviews</div>
        ) : (
          <div>
            <h4>Total Success: {totalSuccess}</h4>
            <h4>Total Errors: {totalErrors}</h4>
            <List>
              <ReminderListItem review={reviews} />
            </List>
          </div>
        )}
      </div>
    );
  }
}

OutboxReviews.propTypes = {
  account: PropTypes.object.isRequired,
};
