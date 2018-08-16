
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { withRouter, matchPath } from 'react-router-dom';
import { Element } from 'react-scroll';
import classNames from 'classnames';
import Header from './Header';
import FloatingButton from './FloatingButton';
import Button from '../library/Button';
import { setIsClicked } from '../../reducers/widgetNavigation';
import { locationShape, historyShape } from '../library/PropTypeShapes/routerShapes';
import { AccountTabSVG, FindTimeSVG, ReviewBookSVG } from './SVGs';
import { refreshFirstStepData } from '../../reducers/availabilities';
import styles from './styles.scss';

const b = ({ pathname }, path) =>
  pathname
    .split('/')
    .filter((v, index) => index < 5)
    .concat(path)
    .join('/');

class Widget extends Component {
  constructor() {
    super();
    this.handleCleaningFirstStep = this.handleCleaningFirstStep.bind(this);
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

  /**
   * Ask if the user wants to proceed and reselect all data related to the first step.
   * @returns {*}
   */
  handleCleaningFirstStep() {
    if (
      window.confirm('Are you sure you want to edit your appointment information? You will have to re-select the steps in Find a Time section.')
    ) {
      this.props.refreshFirstStepData();
      return this.props.history.push(b(this.props.location, 'reason'));
    }
    return undefined;
  }

  render() {
    const { floatingButtonIsVisible, floatingButtonIsDisabled, floatingButtonText } = this.props;

    const { pathname } = this.props.location;

    const buildMatchpath = url => !!matchPath(pathname, { path: `/widgets/:accountId/app/${url}` });

    const isReviewRoute = buildMatchpath('book/review');
    const isCompleteRoute = buildMatchpath('book/complete');
    const isAccountRoute = buildMatchpath('account') || buildMatchpath('login');
    const isPatientRoute = buildMatchpath('book/patient-information');
    const isAdditionalRoute = buildMatchpath('book/additional-information');
    const isFirstRoute = buildMatchpath('book/reason');

    const routesState = {
      isFirstRoute,
      isReviewRoute,
      isAccountRoute,
      isCompleteRoute,
    };
    const isSecondStep = isAccountRoute || isPatientRoute || isAdditionalRoute || isReviewRoute;
    return (
      <div className={styles.reviewsWidgetContainer}>
        <div className={styles.reviewsWidgetCenter}>
          <Header routesState={routesState} />
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
                  <Button
                    className={classNames(styles.step, styles.active)}
                    disabled={isFirstRoute}
                    onClick={this.handleCleaningFirstStep}
                  >
                    <strong>Find a Time</strong>
                    <span>
                      <FindTimeSVG />
                    </span>
                  </Button>
                  <Button
                    disabled={!isAdditionalRoute && !isReviewRoute}
                    className={classNames(styles.step, { [styles.active]: isSecondStep })}
                    onClick={() =>
                      this.props.history.push(b(this.props.location, 'patient-information'))
                    }
                  >
                    <strong>Select Patient</strong>
                    <span>
                      <AccountTabSVG />
                    </span>
                  </Button>
                  <Button
                    className={classNames(styles.step, { [styles.active]: isReviewRoute })}
                    disabled
                  >
                    <strong>Review & Book</strong>
                    <span>
                      <ReviewBookSVG />
                    </span>
                  </Button>
                </div>
              </div>
            )}
            {this.props.children}
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
      refreshFirstStepData,
    },
    dispatch,
  );
}

Widget.propTypes = {
  refreshFirstStepData: PropTypes.func.isRequired,
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
