
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { stringify } from 'query-string';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import Button from '../../library/Button';
import { locationShape, historyShape } from '../../library/PropTypeShapes/routerShapes';
import transitions from './transitions.scss';
import { AccountTabSVG, SummaryTabSVG, BookingTabSVG } from '../SVGs';
import styles from './styles.scss';

function Tabs({
  location,
  history: { push },
  tabState: {
    isEditing,
    isReviewRoute,
    isSummaryRoute,
    isAccountTab,
    isAccountRoute,
    isBookingRoute,
    isCompleteRoute,
  },
  tabs: { BOOKING_TAB, ACCOUNT_TAB, REVIEW_TAB },
}) {
  return (
    !isCompleteRoute && (
      <div className={styles.tabsWrapper}>
        <CSSTransition
          unmountOnExit
          in={!isEditing && !isReviewRoute}
          timeout={{
            enter: 1000,
            exit: 1000,
          }}
          classNames={transitions}
        >
          <div className={styles.tabsContainer}>
            <Button
              className={classnames(styles.tab, { [styles.active]: isBookingRoute })}
              onClick={() =>
                push({
                  ...location,
                  search: stringify({ tab: BOOKING_TAB }),
                })
              }
            >
              <span className={styles.content}>
                <BookingTabSVG />
                Booking
              </span>
            </Button>
            <Button
              className={classnames(styles.tab, {
                [styles.active]: isSummaryRoute,
              })}
              onClick={() =>
                push({
                  ...location,
                  search: stringify({ tab: REVIEW_TAB }),
                })
              }
            >
              <span className={styles.content}>
                <SummaryTabSVG />
                Summary
              </span>
            </Button>

            <Button
              className={classnames(styles.tab, {
                [styles.active]: isAccountTab,
                [styles.active]: isAccountRoute,
              })}
              onClick={() =>
                push({
                  ...location,
                  search: stringify({ tab: ACCOUNT_TAB }),
                })
              }
            >
              <span className={styles.content}>
                <AccountTabSVG />
                Account
              </span>
            </Button>
          </div>
        </CSSTransition>
        <CSSTransition
          unmountOnExit
          in={isEditing}
          timeout={{
            enter: 1000,
            exit: 1000,
          }}
          classNames={transitions}
        >
          <div className={styles.editMode}>EDIT MODE</div>
        </CSSTransition>
        <CSSTransition
          unmountOnExit
          in={isReviewRoute}
          timeout={{
            enter: 1000,
            exit: 1000,
          }}
          classNames={transitions}
        >
          <div className={styles.editMode}>Review and Confirm</div>
        </CSSTransition>
        <CSSTransition
          unmountOnExit
          in={isAccountRoute}
          timeout={{
            enter: 1000,
            exit: 1000,
          }}
          classNames={transitions}
        >
          <div className={styles.editMode}>ACCOUNT MODE</div>
        </CSSTransition>
      </div>
    )
  );
}

function mapStateToProps({ availabilities, widgetNavigation }) {
  return {
    isEditing: widgetNavigation.get('isEditing'),
    selectedAvailability: availabilities.get('selectedAvailability'),
  };
}

export default withRouter(connect(mapStateToProps)(Tabs));

Tabs.propTypes = {
  location: PropTypes.shape(locationShape).isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  tabs: PropTypes.objectOf(PropTypes.string).isRequired,
  tabState: PropTypes.objectOf(PropTypes.bool).isRequired,
};
