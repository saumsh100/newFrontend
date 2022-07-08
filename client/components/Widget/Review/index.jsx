import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { createReview } from '../../../thunks/reviews';
import { Button } from '../components';
import ReviewForm from './ReviewForm';
import styles from './styles.scss';

class Review extends Component {
  constructor(props) {
    super(props);

    this.createReview = this.createReview.bind(this);
  }

  createReview(values) {
    // Create review then send to next step
    return this.props.createReview(values).then(() => {
      this.props.history.push('./signup');
    });
  }

  render() {
    const { review } = this.props;
    const { stars, description } = review.toJS();
    const initialValues = { stars, description };
    return (
      <div className={styles.reviewsWrapper}>
        <div className={styles.reviewsFormWrapper}>
          <ReviewForm initialValues={initialValues} onSubmit={this.createReview} />
          <Button>Next</Button>
        </div>
      </div>
    );
  }
}

Review.propTypes = {
  review: PropTypes.shape.isRequired,
  createReview: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

function mapStateToProps({ reviews }) {
  return {
    review: reviews.get('review'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createReview,
    },
    dispatch,
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Review));
