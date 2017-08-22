
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { createReview } from '../../../thunks/reviews';
import ReviewForm from './ReviewForm';
import styles from './styles.scss';

class Review extends Component {
  constructor(props) {
    super(props);

    this.createReview = this.createReview.bind(this);
  }

  createReview(values) {
    // Create review then send to next step
    return this.props.createReview(values)
      .then(() => {
        this.props.history.push('/login');
      });
  }

  render() {
    const { review } = this.props;
    return (
      <div>
        <div className={styles.reviewsFormWrapper}>
          <ReviewForm
            review={review}
            onSubmit={this.createReview}
          />
        </div>
      </div>
    );
  }
}

Review.propTypes = {
  review: PropTypes.object,
  createReview: PropTypes.func.isRequired,
};

function mapStateToProps({ reviews }) {
  return {
    review: reviews.get('review'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createReview,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Review));
