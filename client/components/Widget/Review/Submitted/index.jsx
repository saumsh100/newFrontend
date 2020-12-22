
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import sentimentContent from './content';
import { mergeReviewValues } from '../../../../reducers/reviewsWidget';
import { saveReview } from '../../../../thunks/reviews';
import { Stars, TextArea, Button } from '../../../library';
import Picture from '../Picture';
import EnabledFeature from '../../../library/EnabledFeature';
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
    return this.props
      .saveReview()
      .then(() => this.props.history.push('./review/complete'))
      .catch(err => console.error('error in submitBad', err));
  }

  submitGood() {
    // Save review
    this.share();
    return this.props
      .saveReview()
      .then(() => this.props.history.push('./review/complete'))
      .catch(err => console.error('error in submitGood', err));
  }

  render() {
    const { review, reviewedPractitioner } = this.props;
    const poorReview = review.get('stars') < 4;
    const noStars = review.get('stars') === 0;
    const filledSentiment = poorReview ? 'sorry' : 'grateful';
    const sentiment = noStars ? 'empty' : filledSentiment;
    const content = sentimentContent[sentiment];
    const stars = review.get('stars');
    const description = review.get('description');
    return (
      <div className={styles.main}>
        <div className={styles.row}>
          <Picture reviewedPractitioner={reviewedPractitioner} />
        </div>
        <div className={styles.header}>{content.header}</div>
        <div className={styles.message}>{content.response}</div>
        <div className={styles.starsWrapper}>
          <Stars isMinimal value={stars} isStatic={false} onChange={this.handleChange('stars')} />
        </div>
        <div className={styles.footer}>
          <div className={styles.textAreaWrapper}>
            {!noStars && poorReview && (
              <TextArea
                label="Feedback"
                value={description || ''}
                onChange={this.handleChange('description')}
                classStyles={styles.textArea}
                theme={{ label: styles.label,
filled: styles.label }}
              />
            )}
          </div>
          {poorReview ? (
            <Button
              className={styles.button}
              onClick={this.submitBad}
              disabled={noStars && !description}
            >
              Share Feedback
            </Button>
          ) : (
            <Button className={styles.button} onClick={this.submitGood}>
              Share Review on Google
            </Button>
          )}
          <EnabledFeature
            predicate={({ flags }) => flags.get('google-compliant-link')}
            render={() =>
              !noStars &&
              poorReview && (
                <Button className={styles.poorShare} onClick={this.share}>
                  Share Review on Google
                </Button>
              )
            }
          />
        </div>
      </div>
    );
  }
}

Submitted.propTypes = {
  review: PropTypes.shape({}).isRequired,
  reviewedPractitioner: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,

  account: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }).isRequired,

  saveReview: PropTypes.func.isRequired,
  mergeReviewValues: PropTypes.func.isRequired,
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
    },
    dispatch,
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Submitted),
);
