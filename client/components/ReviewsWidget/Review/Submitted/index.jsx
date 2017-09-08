
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import sentimentContent from './content';
import { Avatar, Link, Stars, VButton } from '../../../library';
import styles from './styles.scss';

class Submitted extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { review, reviewedPractitioner } = this.props;
    const sentiment = review.get('stars') < 4 ? 'sorry' : 'grateful';
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
            <Stars value={review.get('stars')} isStatic isMinimal />
          </div>
          <div className={styles.row}>
            <VButton
              className={styles.button}
              color="darkblue"
              iconRight="google"
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

export default connect(mapStateToProps, null)(Submitted);
