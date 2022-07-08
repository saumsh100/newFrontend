import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { mergeReviewValues } from '../../../../reducers/reviewsWidget';
import { saveReview } from '../../../../thunks/reviews';
import { closeBookingModal } from '../../../../thunks/availabilities';
import { Stars } from '../../../library';
import { Button } from '../../components';
import Picture from '../Picture';
import styles from './styles.scss';

const Complete = (props) => {
  const { review, reviewedPractitioner } = props;
  const stars = review.get('stars');
  return (
    <div className={styles.main}>
      <div className={styles.row}>
        <Picture reviewedPractitioner={reviewedPractitioner} />
      </div>
      <div className={styles.completeHeader}>Feedback sent.</div>
      <div className={styles.starsWrapper}>
        <Stars value={stars} isStatic isMinimal />
      </div>
      <div className={styles.footer}>
        <Button className={styles.button} color="red" onClick={() => props.closeBookingModal()}>
          Done
        </Button>
      </div>
    </div>
  );
};

Complete.propTypes = {
  review: PropTypes.shape({
    get: PropTypes.func,
  }).isRequired,
  reviewedPractitioner: PropTypes.shape({
    get: PropTypes.func,
  }).isRequired,
  closeBookingModal: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, reviews }) {
  const review = reviews.get('review');
  const account = reviews.get('account');
  const pracId = review.get('practitionerId');
  const pracModels = entities.getIn(['practitioners', 'models']);
  const reviewedPractitioner = review.get('practitionerId')
    ? pracModels.get(pracId)
    : pracModels.first();

  return {
    review,
    account,
    reviewedPractitioner,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      mergeReviewValues,
      saveReview,
      closeBookingModal,
    },
    dispatch,
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Complete));
