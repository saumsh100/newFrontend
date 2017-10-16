
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styles from './styles.scss';

class ReviewsWidget extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // Without this, none of our themed styles would work
    const color = this.props.account.get('bookingWidgetPrimaryColor') || '#ff715a';
    document.documentElement.style.setProperty('--primaryColor', color);
  }

  render() {
    const {
      children,
    } = this.props;

    return (
      <div className={styles.reviewsWidgetContainer}>
        <div className={styles.reviewsWidgetCenter}>
          {children}
        </div>
      </div>
    );
  }
}

ReviewsWidget.propTypes = {};

function mapStateToProps({ reviews }) {
  const account = reviews.get('account');
  return {
    account,
  };
}

export default withRouter(connect(mapStateToProps, null)(ReviewsWidget));

// ChIJmdp9t7VwhlQRailxK3m6p1g
// https://search.google.com/local/writereview?placeid=ChIJmdp9t7VwhlQRailxK3m6p1g

// https://www.google.com/search?q=Capitol+Hill+Dental+Clinic+-+Dr.+Wong,+4633+Hastings+St,+Burnaby,+BC+V5C+2K6,+Canada&ludocid=6388279626030983530#lrd=0x548670b5b77dda99:0x58a7ba792b71296a,3,5

