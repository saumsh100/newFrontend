
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
import { CloseBookingModalSVG } from '../SVGs';
import styles from './styles.scss';

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
    } = this.props;

    const path = location.pathname
      .split('/')
      .filter((_, i) => i > 3)
      .join('/');

    return (
      <div className={styles.topHead}>
        <div className={styles.headerContainer}>
          <div
            className={classNames({
              [styles.headerLeftArea]: true,
              [styles.hideBack]: isCompleteRoute || isFirstRoute,
            })}
          >
            <BackButton history={history} goBack={this.goBack} />
          </div>

          <div className={styles.headerCenterArea}>
            <h2 className={classNames(styles.pageTitle, { [styles.complete]: isCompleteRoute })}>
              Schedule your Appointment
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

function mapStateToProps({ auth, availabilities }) {
  return {
    hasWaitList: availabilities.get('hasWaitList'),
    isAuth: auth.get('isAuthenticated'),
    isBooking: availabilities.get('isBooking'),
    patientUser: auth.get('patientUser'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ closeBookingModal }, dispatch);
}

Header.propTypes = {
  closeBookingModal: PropTypes.func.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  routesState: PropTypes.objectOf(PropTypes.bool).isRequired,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header));
