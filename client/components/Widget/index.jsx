import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { withRouter, matchPath } from 'react-router-dom';
import { Element } from 'react-scroll';
import classNames from 'classnames';
import { parse } from 'query-string';
import Header from './Header';
import FloatingButton from './FloatingButton';
import Button from '../library/Button';
import { setIsClicked } from '../../reducers/widgetNavigation';
import { locationShape, historyShape } from '../library/PropTypeShapes/routerShapes';
import { AccountTabSVG, FindTimeSVG, ReviewBookSVG } from './SVGs';
import {
  refreshFirstStepData,
  setSelectedServiceId,
  setUTMParams,
  setReferrerURL,
  setGACookie,
  setGCLAWCookie,
  setTymbrelFormCookie,
} from '../../reducers/availabilities';
import styles from './styles.scss';

const buildMatchpath = (url, pathname) =>
  !!matchPath(pathname, { path: `/widgets/:accountId/app/${url}` });

const b = ({ pathname }, path, size = 5) =>
  pathname
    .split('/')
    .filter((v, index) => index < size)
    .concat(path)
    .join('/');

function getCookie(cName) {
  let cValue = ` ${document.cookie}`;
  let cStart = cValue.indexOf(` ${cName}=`);
  if (cStart === -1) {
    cValue = null;
  } else {
    cStart = cValue.indexOf('=', cStart) + 1;
    let cEnd = cValue.indexOf(';', cStart);
    if (cEnd === -1) {
      cEnd = cValue.length;
    }
    cValue = decodeURI(cValue.substring(cStart, cEnd));
  }
  return cValue;
}

class Widget extends Component {
  constructor() {
    super();
    this.containerNode = createRef();
    this.handleCleaningFirstStep = this.handleCleaningFirstStep.bind(this);
  }

  componentDidMount() {
    const color = this.props.account.get('bookingWidgetPrimaryColor') || '#ff715a';
    document.documentElement.style.setProperty('--primaryColor', color);
    document.documentElement.style.setProperty('--primaryButtonColor', color);

    const queryVars = parse(this.props.location.search);
    if (!queryVars.sentRecallId) {
      this.props.setSelectedServiceId(null);
    }

    const utmParams = Object.keys(queryVars).reduce((acc, key) => {
      if (key.includes('utm_')) {
        acc[key] = queryVars[key];
      }
      return acc;
    }, {});

    this.props.setUTMParams(utmParams);

    // Get and set ref query param
    const referrerURL = queryVars.ref;
    this.props.setReferrerURL(referrerURL);

    // Get the cookies and set in redux states.
    const gACookie = getCookie('_ga');
    const gCLAWCookie = getCookie('_gcl_aw');
    const tymbrelFormCookie = getCookie('tymbrel_form_cookies');

    this.props.setGACookie(gACookie);
    this.props.setGCLAWCookie(gCLAWCookie);
    this.props.setTymbrelFormCookie(tymbrelFormCookie);
  }

  componentDidUpdate(prevProps) {
    // Scroll to top of view when route changes
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.containerNode.current.scrollTop = 0;
    }
  }

  /**
   * Ask if the user wants to proceed and reselect all data related to the first step.
   * @returns {*}
   */
  handleCleaningFirstStep() {
    if (
      window.confirm(
        'Are you sure you want to edit your appointment information? You will have to re-select the steps in Find a Time section.',
      )
    ) {
      this.props.refreshFirstStepData();
      return this.props.history.push(b(this.props.location, 'book/reason', 4));
    }
    return undefined;
  }

  render() {
    const { floatingButtonIsVisible, floatingButtonIsDisabled, floatingButtonText } = this.props;

    const { pathname } = this.props.location;

    const isReviewApp = pathname.split('/')[4] === 'review';

    const isReviewRoute = buildMatchpath('book/review', pathname);
    const isCompleteRoute = buildMatchpath('book/complete', pathname);
    const isAccountRoute = buildMatchpath('account', pathname) || buildMatchpath('login', pathname);
    const isPatientRoute = buildMatchpath('book/patient-information', pathname);
    const isAdditionalRoute = buildMatchpath('book/additional-information', pathname);
    const isFirstRoute = buildMatchpath('book/reason', pathname);

    const routesState = {
      isFirstRoute,
      isReviewRoute,
      isAccountRoute,
      isCompleteRoute,
    };
    const isSecondStep = isAccountRoute || isPatientRoute || isAdditionalRoute || isReviewRoute;
    const bookingWidgetButtonLabel = this.props.account.get('bookingWidgetButtonLabel');
    return (
      <div className={styles.reviewsWidgetContainer}>
        <div className={styles.reviewsWidgetCenter}>
          <Header
            routesState={routesState}
            isReviewApp={isReviewApp}
            bookingWidgetButtonLabel={bookingWidgetButtonLabel}
          />
          <Element id="widgetContainer" className={styles.widgetContainer} ref={this.containerNode}>
            {!isCompleteRoute && !isReviewApp && (
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
    selectedServiceId: availabilities.get('selectedServiceId'),
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
      setSelectedServiceId,
      setUTMParams,
      refreshFirstStepData,
      setReferrerURL,
      setGACookie,
      setGCLAWCookie,
      setTymbrelFormCookie,
    },
    dispatch,
  );
}

Widget.propTypes = {
  refreshFirstStepData: PropTypes.func.isRequired,
  account: PropTypes.instanceOf(Map).isRequired,
  children: PropTypes.node.isRequired,
  setSelectedServiceId: PropTypes.func.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  floatingButtonIsVisible: PropTypes.bool.isRequired,
  floatingButtonIsDisabled: PropTypes.bool.isRequired,
  setIsClicked: PropTypes.func.isRequired,
  setUTMParams: PropTypes.func.isRequired,
  floatingButtonText: PropTypes.string.isRequired,
  setReferrerURL: PropTypes.func.isRequired,
  setGACookie: PropTypes.func.isRequired,
  setGCLAWCookie: PropTypes.func.isRequired,
  setTymbrelFormCookie: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Widget));
