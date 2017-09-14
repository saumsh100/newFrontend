
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import sentimentContent from './content';
import { mergeReviewValues } from '../../../../reducers/reviewsWidget';
import { Avatar, Link, Input, Stars, TextArea, VButton } from '../../../library';
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
      value = field === 'stars' ? value : value.target.value;
      this.props.mergeReviewValues({ [field]: value });
    };
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
            value={stars}
            isStatic={false}
            isMinimal
            onChange={this.handleChange('stars')}
          />
        </div>
        <div className={styles.footer}>
          <div className={styles.textAreaWrapper}>
            {poorReview ?
              <TextArea
                label="FEEDBACK"
                value={description}
                onChange={this.handleChange('description')}
              /> : null}
          </div>
          {poorReview ?
            <VButton
              className={styles.button}
              color={description ? 'red' : 'darkblue'}
              onClick={this.share}
              disabled={!description}
            >
              Submit Feedback
            </VButton> :
            <VButton
              className={styles.googleButton}
              color="darkblue"
              iconRight="google"
              onClick={this.share}
            >
              Share Review on Google
            </VButton>
          }
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
