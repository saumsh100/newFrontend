
import React, { Component } from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Header from './Header';
import { locationShape } from '../library/PropTypeShapes/routerShapes';
import Review from './Booking/Review';
import styles from './styles.scss';

class Widget extends Component {
  componentWillMount() {
    // Without this, none of our themed styles would work
    const color = this.props.account.get('bookingWidgetPrimaryColor') || '#ff715a';
    document.documentElement.style.setProperty('--primaryColor', color);
    document.documentElement.style.setProperty('--primaryButtonColor', color);
  }

  componentDidUpdate(prevProps) {
    // Scroll to top of view when route changes
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.containerNode.scrollTop = 0;
    }
  }

  render() {
    return (
      <div className={styles.reviewsWidgetContainer}>
        <div className={styles.reviewsWidgetCenter}>
          <Header />
          <div
            className={styles.container}
            ref={(node) => {
              this.containerNode = node;
              return this.containerNode;
            }}
          >
            {this.props.isBooking ? this.props.children : <Review />}
          </div>
          <div className={styles.poweredBy}>
            We run on <img src="/images/carecru_logo_color_horizontal.png" alt="CareCru" />
          </div>
        </div>
      </div>
    );
  }
}

Widget.propTypes = {
  account: PropTypes.instanceOf(Map).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  isBooking: PropTypes.bool.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
};

function mapStateToProps({ availabilities, reviews }) {
  return {
    account: reviews.get('account'),
    isBooking: availabilities.get('isBooking'),
  };
}

export default withRouter(connect(mapStateToProps, null)(Widget));
