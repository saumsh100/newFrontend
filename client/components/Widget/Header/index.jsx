
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import BackButton from './BackButton';
import Button from '../../library/Button';
import { closeBookingModal } from '../../../thunks/availabilities';
import { historyShape, locationShape } from '../../library/PropTypeShapes/routerShapes';
import { BackButtonSVG, CloseBookingModalSVG } from '../SVGs';
import styles from './styles.scss';
import EnabledFeature from '../../library/EnabledFeature';

class Header extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }

  goBack(path) {
    return () => {
      this.props.history.push(path);
    };
  }

  render() {
    const {
      history,
      location,
      routesState: { isCompleteRoute, isFirstRoute },
      isReviewApp,
    } = this.props;

    const path = location.pathname
      .split('/')
      .filter((_, i) => i > 3)
      .join('/');

    return (
      <div className={styles.topHead}>
        <div className={styles.headerContainer}>
          <EnabledFeature
            predicate={({ flags }) =>
              flags.get('back-button-multi-location-booking-widget') && isFirstRoute
            }
            render={() => (
              <div
                className={classNames({
                  [styles.headerLeftArea]: true,
                  [styles.hideBack]: isCompleteRoute || isReviewApp,
                })}
              >
                <Button
                  className={styles.backButton}
                  onClick={() => {
                    window.parent.postMessage('reInitializeWidget', '*');
                  }}
                >
                  <BackButtonSVG />
                </Button>
              </div>
            )}
            fallback={() => (
              <div
                className={classNames({
                  [styles.headerLeftArea]: true,
                  [styles.hideBack]: isCompleteRoute || isFirstRoute || isReviewApp,
                })}
              >
                <BackButton history={history} goBack={this.goBack} />
              </div>
            )}
          />
          <div className={styles.headerCenterArea}>
            <h2 className={classNames(styles.pageTitle, { [styles.complete]: isCompleteRoute })}>
              {isReviewApp ? 'Review Your Visit' : 'Schedule Your Appointment'}
            </h2>
          </div>
          <div className={styles.headerRightArea}>
            <Button
              className={styles.closeButton}
              onClick={() => this.props.closeBookingModal(path)}
            >
              <CloseBookingModalSVG />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ closeBookingModal }, dispatch);
}

Header.propTypes = {
  closeBookingModal: PropTypes.func.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  routesState: PropTypes.objectOf(PropTypes.bool).isRequired,
  isReviewApp: PropTypes.bool.isRequired,
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(Header),
);
