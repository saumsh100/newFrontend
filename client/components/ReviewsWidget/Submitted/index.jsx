
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, Stars } from '../../library';
import styles from './styles.scss';

class Submitted extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { review } = this.props;
    return (
      <div>
        <h2>Submitted</h2>
        <div>
          <Stars value={review.get('stars')} isStatic />
        </div>
        <div className={styles.messageWrapper}>
          <div className={styles.thanksHeader}>Thanks for your feedback</div>
          <div className={styles.apologyMessage}>
            My goal is to provide the best care and experience possible to my patients.
            I'm sorry that I did not meet your expectations. I hope that you will give us another
            chance to prove that we can do better.
          </div>
          <div className={styles.fromPractitioner}>
            - Dr. Sheridan Lee
          </div>
        </div>
        <Link to="/review">
          <h3>Back to Beginning</h3>
        </Link>
      </div>
    );
  }
}

Submitted.propTypes = {
  review: PropTypes.object.isRequired,
};

function mapStateToProps({ reviews }) {
  return {
    review: reviews.get('review'),
  };
}

export default connect(mapStateToProps, null)(Submitted);
