
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import sentimentContent from './content';
import { mergeReviewValues } from '../../../../reducers/reviewsWidget';
import { Avatar, Link, Input, Stars, VButton } from '../../../library';
import styles from './styles.scss';

class Submitted extends Component {
  constructor(props) {
    super(props);

    this.share = this.share.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  share() {
    window.open('https://search.google.com/local/writereview?placeid=ChIJmdp9t7VwhlQRailxK3m6p1g', '_blank');
  }

  handleChange(field) {
    return (value) => {
      this.props.mergeReviewValues({ [field]: value });
    };
  }

  render() {
    const { review, reviewedPractitioner } = this.props;
    const poorReview = review.get('stars') < 4;
    const sentiment = poorReview ? 'sorry' : 'grateful';
    const content = sentimentContent[sentiment];
    return (
      <div>
        <div className={styles.main}>
          <div className={styles.row}>
            <Avatar user={reviewedPractitioner} size="lg" />
          </div>
          <div className={styles.header}>
            {content.header}
          </div>
          <div className={styles.message}>
            {content.response}
          </div>
          <div className={styles.from}>
            - {reviewedPractitioner.getPrettyName()}
          </div>
          <div>
            <Stars
              value={review.get('stars')}
              isStatic={false}
              isMinimal
              onChange={this.handleChange('stars')}
            />
          </div>
          <div>
            {poorReview ?
              <Input
                label="Description"
                value={review.get('description')}
                onChange={this.handleChange('description')}
              /> : null}
          </div>
          <div className={styles.row}>
            <VButton
              className={styles.button}
              color="darkblue"
              iconRight="google"
              onClick={this.share}
            >
              Share Review on Google
            </VButton>
          </div>
        </div>
      </div>
    );
  }
}

Submitted.propTypes = {
  review: PropTypes.object.isRequired,
  reviewedPractitioner: PropTypes.object.isRequired,
};

function mapStateToProps({ entities, reviews }) {
  const review = reviews.get('review');
  const pracId = review.get('practitionerId');
  const pracModels = entities.getIn(['practitioners', 'models']);
  const reviewedPractitioner = review.get('practitionerId') ?
    pracModels.get(pracId) :
    pracModels.first();

  return {
    review,
    reviewedPractitioner,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    mergeReviewValues,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Submitted);
