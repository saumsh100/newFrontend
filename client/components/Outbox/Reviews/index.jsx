
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { List, Loading } from '../../library';
import styles from './styles.scss';
import { httpClient } from '../../../util/httpClient';
import accountShape from '../../library/PropTypeShapes/accountShape';
import OutboxItem from '../OutboxItem';

export default class OutboxReviews extends Component {
  constructor(props) {
    super(props);

    // Using state because configurations are not supported
    this.state = {
      isLoading: true,
      reviews: null,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { account } = this.props;
    return Promise.all([httpClient().get(`/api/accounts/${account.id}/reviews/list`)])
      .then(([reviewsData]) => {
        this.setState({
          isLoading: false,
          reviews: reviewsData.data,
        });
      })
      .catch(err => console.error('Failed to load configs', err));
  }

  render() {
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
              <OutboxItem data={reviews} styles={styles} dateFormat="h:mma MMM Do, YYYY" />
            </List>
          </div>
        )}
      </div>
    );
  }
}

OutboxReviews.propTypes = {
  account: PropTypes.shape(accountShape).isRequired,
};
