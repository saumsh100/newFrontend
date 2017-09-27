
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import sentimentContent from '../Submitted/content';
import { mergeReviewValues } from '../../../../reducers/reviewsWidget';
import { saveReview } from '../../../../thunks/reviews';
import { closeBookingModal } from '../../../../thunks/availabilities';
import { Avatar, Link, Input, Stars, TextArea, VButton } from '../../../library';
import styles from './styles.scss';

class Complete extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { review, reviewedPractitioner } = this.props;
    const poorReview = review.get('stars') < 4;
    const sentiment = poorReview ? 'sorry' : 'grateful';
    const content = sentimentContent[sentiment];
    const stars = review.get('stars');
    const description = review.get('description');

    return (
      <div className={styles.main}>
        <div className={styles.row}>
          <Avatar
            size="xl"
            user={reviewedPractitioner}
          />
        </div>
        <div className={styles.header}>
          Feedback sent to {reviewedPractitioner.getPrettyName()}.
        </div>
        <div>
          <Stars
            value={stars}
            isStatic
            isMinimal
          />
        </div>
        <VButton
          className={styles.button}
          color='red'
          onClick={this.props.closeBookingModal}
        >
          Done
        </VButton>
      </div>
    );
  }
}

Complete.propTypes = {
  review: PropTypes.object.isRequired,
  reviewedPractitioner: PropTypes.object.isRequired,
};

function mapStateToProps({ entities, reviews }) {
  const review = reviews.get('review');
  const account = reviews.get('account');
  const pracId = review.get('practitionerId');
  const pracModels = entities.getIn(['practitioners', 'models']);
  const reviewedPractitioner = review.get('practitionerId') ?
    pracModels.get(pracId) :
    pracModels.first();

  return {
    review,
    account,
    reviewedPractitioner,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    mergeReviewValues,
    saveReview,
    closeBookingModal,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Complete));
