
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import sentimentContent from './content';
import { mergeReviewValues } from '../../../../reducers/reviewsWidget';
import { saveReview } from '../../../../thunks/reviews';
import { Avatar, Link, Input, Stars, TextArea, Button } from '../../../library';
import styles from './styles.scss';

class Submitted extends Component {
  constructor(props) {
    super(props);

    this.share = this.share.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitBad = this.submitBad.bind(this);
    this.submitGood = this.submitGood.bind(this);
  }

  share() {
    const placeId = this.props.account.get('googlePlaceId');
    if (!placeId) {
      console.error('Account does not have a googlePlaceId');
      return;
    }

    // TODO: save review, and then link to google

    console.log('opening!');
    const url = `https://search.google.com/local/writereview?placeid=${placeId}`;
    window.open(url, '_blank');
  }

  handleChange(field) {
    return (value) => {
      value = field === 'stars' ? value : value.target.value;
      this.props.mergeReviewValues({ [field]: value });
    };
  }

  submitBad() {
    return this.props.saveReview()
      .then(() => this.props.history.push('./review/complete'))
      .catch(err => console.log('error in submitBad', err));
  }

  submitGood() {
    // Save review
    this.share();
    return this.props.saveReview()
      .then(() => this.props.history.push('./review/complete'))
      .catch(err => console.log('error in submitGood', err));
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
            <Button
              className={styles.button}
              color={description ? 'red' : 'darkblue'}
              onClick={this.submitBad}
              disabled={!description}
            >
              Submit Feedback
            </Button> :
            <Button
              className={styles.googleButton}
              color="darkblue"
              iconRight="google"
              onClick={this.submitGood}
            >
              Share Review on Google
            </Button>
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
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Submitted));
