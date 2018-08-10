
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { withRouter, matchPath } from 'react-router-dom';
import { parse } from 'query-string';
import { Element } from 'react-scroll';
import classNames from 'classnames';
import Header from './Header';
import Logon from './Account/Logon';
import FloatingButton from './FloatingButton';
import Button from '../library/Button';
import { setIsClicked } from '../../reducers/widgetNavigation';
import { locationShape, historyShape } from '../library/PropTypeShapes/routerShapes';
import Review from './Booking/Review';
import { AccountTabSVG, FindTimeSVG, ReviewBookSVG } from './SVGs';
import styles from './styles.scss';

const BOOKING_TAB = undefined;
const ACCOUNT_TAB = 'account';
const REVIEW_TAB = 'summary';

class Widget extends Component {
  constructor(props) {
    super(props);

    this.renderChildren = this.renderChildren.bind(this);
  }

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

  renderTabs({
    isAccountRoute, isAccountTab, isEditing, isReviewRoute, isSummaryRoute,
  }) {
    if (isSummaryRoute && !isEditing) {
      return <Review canConfirm={false} />;
    }

    if (isAccountTab && !isAccountRoute && !isReviewRoute) {
      return <Logon isAccountTab />;
    }

    return null;
  }

  renderChildren(tabState, tabs, history) {
    const { isAccountRoute, isBookingRoute, isEditing } = tabState;

    const isChildrenRoute = isBookingRoute || isAccountRoute || isEditing;
    if (!isChildrenRoute) {
      return this.renderTabs(tabState);
    }
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        location: {
          ...history.location,
          state: {
            ...history.location.state,
            ...tabState,
            ...tabs,
          },
        },
      }));
  }

  render() {
    const {
      floatingButtonIsVisible,
      floatingButtonIsDisabled,
      floatingButtonText,
      history,
    } = this.props;

    const { pathname, search } = this.props.location;
    const parsedSearch = parse(search);

    const isEditing = !!parsedSearch.edit;

    const isSummaryRoute =
      parsedSearch.tab !== ACCOUNT_TAB &&
      (parsedSearch.tab === REVIEW_TAB || parsedSearch.edit === 'true');

    const isReviewRoute = !!matchPath(pathname, {
      path: '/widgets/:accountId/app/book/review',
    });

    const isCompleteRoute = !!matchPath(pathname, {
      path: '/widgets/:accountId/app/book/complete',
    });

    const isAccountRoute =
      !!matchPath(pathname, {
        path: '/widgets/:accountId/app/account',
      }) ||
      !!matchPath(pathname, {
        path: '/widgets/:accountId/app/login',
      });
    const isPatientRoute =
      !!matchPath(pathname, {
        path: '/widgets/:accountId/app/book/patient-information',
      }) ||
      !!matchPath(pathname, {
        path: '/widgets/:accountId/app/book/additional-information',
      });
    const isAccountTab = parsedSearch.tab === ACCOUNT_TAB;

    const isBookingRoute = !isAccountTab && parsedSearch.tab === BOOKING_TAB;

    const isFirstRoute =
      isBookingRoute &&
      !isEditing &&
      !!matchPath(pathname, {
        path: '/widgets/:accountId/app/book/reason',
      });

    const tabState = {
      isFirstRoute,
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
          <Element
            id="widgetContainer"
            className={styles.widgetContainer}
            ref={(node) => {
              this.containerNode = node;
              return this.containerNode;
            }}
          >
            {!isCompleteRoute && (
              <div className={styles.stepsWrapper}>
                <div className={styles.steps}>
                  <div className={classNames(styles.step, styles.active)}>
                    <strong>Find a Time</strong>
                    <span>
                      <FindTimeSVG />
                    </span>
                  </div>
                  <div
                    className={classNames(styles.step, {
                      [styles.active]: isAccountRoute || isPatientRoute || isReviewRoute,
                    })}
                  >
                    <strong>Select Patient</strong>
                    <span>
                      <AccountTabSVG />
                    </span>
                  </div>
                  <div className={classNames(styles.step, { [styles.active]: isReviewRoute })}>
                    <strong>Review & Book</strong>
                    <span>
                      <ReviewBookSVG />
                    </span>
                  </div>
                </div>
              </div>
            )}
            {this.renderChildren(tabState, tabs, history)}
          </Element>
          <div className={styles.poweredBy}>
            We run on <img src="/images/carecru_logo_color_horizontal.png" alt="CareCru" />
          </div>
          <FloatingButton visible={floatingButtonIsVisible}>
            <Button
              disabled={floatingButtonIsDisabled}
              className={styles.floatingButton}
              onClick={() => {
                this.props.setIsClicked(true);
              }}
            >
              {floatingButtonText}
            </Button>
          </FloatingButton>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ availabilities, reviews, widgetNavigation }) {
  return {
    account: reviews.get('account'),
    isBooking: availabilities.get('isBooking'),
    floatingButtonIsVisible: widgetNavigation.getIn(['floatingButton', 'isVisible']),
    floatingButtonIsDisabled: widgetNavigation.getIn(['floatingButton', 'isDisabled']),
    floatingButtonIsClicked: widgetNavigation.getIn(['floatingButton', 'isClicked']),
    floatingButtonText: widgetNavigation.getIn(['floatingButton', 'text']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setIsClicked,
    },
    dispatch,
  );
}

Widget.propTypes = {
  account: PropTypes.instanceOf(Map).isRequired,
  children: PropTypes.node.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  floatingButtonIsVisible: PropTypes.bool.isRequired,
  floatingButtonIsDisabled: PropTypes.bool.isRequired,
  setIsClicked: PropTypes.func.isRequired,
  floatingButtonText: PropTypes.string.isRequired,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Widget));
