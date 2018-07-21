
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { withRouter, matchPath } from 'react-router-dom';
import { parse } from 'query-string';
import Header from './Header';
import Logon from './Account/Logon';
import { locationShape } from '../library/PropTypeShapes/routerShapes';
import Review from './Booking/Review';
import styles from './styles.scss';

const BOOKING_TAB = undefined;
const ACCOUNT_TAB = 'account';
const REVIEW_TAB = 'summary';

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
    const { pathname, search } = this.props.location;
    const parsedSearch = parse(search);

    const isEditing = !!parsedSearch.edit;

    const isSummaryRoute =
      parsedSearch.tab !== ACCOUNT_TAB && (parsedSearch.tab === REVIEW_TAB || parsedSearch.edit);

    const isReviewRoute = !!matchPath(pathname, {
      path: '/widgets/:accountId/app/book/review',
    });

    const isCompleteRoute = !!matchPath(pathname, {
      path: '/widgets/:accountId/app/book/complete',
    });

    const isAccountRoute = !!matchPath(pathname, {
      path: '/widgets/:accountId/app/account',
    });

    const isAccountTab = parsedSearch.tab === ACCOUNT_TAB;

    const isBookingRoute = !isAccountTab && parsedSearch.tab === BOOKING_TAB;

    const tabState = {
      isEditing,
      isReviewRoute,
      isAccountRoute,
      isAccountTab,
      isBookingRoute,
      isSummaryRoute,
      isCompleteRoute,
    };
    const tabs = {
      BOOKING_TAB,
      ACCOUNT_TAB,
      REVIEW_TAB,
    };

    return (
      <div className={styles.reviewsWidgetContainer}>
        <div className={styles.reviewsWidgetCenter}>
          <Header tabs={tabs} tabState={tabState} />
          <div
            className={styles.container}
            ref={(node) => {
              this.containerNode = node;
              return this.containerNode;
            }}
          >
            {isSummaryRoute && !isEditing && <Review canConfirm={false} />}
            {isAccountTab && !isAccountRoute && !isReviewRoute && <Logon isAccountTab />}
            {(isBookingRoute || isAccountRoute || isEditing) &&
              this.props.children({ tabState, tabs })}
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
  children: PropTypes.func.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
};

function mapStateToProps({ availabilities, reviews }) {
  return {
    account: reviews.get('account'),
    isBooking: availabilities.get('isBooking'),
  };
}

export default withRouter(connect(
  mapStateToProps,
  null,
)(Widget));
