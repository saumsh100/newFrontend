
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import Tabs from './Tabs';
import BackButton from './BackButton';
import Button from '../../library/Button';
import { setIsBooking } from '../../../actions/availabilities';
import { closeBookingModal } from '../../../thunks/availabilities';
import { historyShape } from '../../library/PropTypeShapes/routerShapes';
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
      this.props.setIsBooking(true);
    };
  }

  render() {
    const {
      history,
      isBooking,
      tabState: { isCompleteRoute },
    } = this.props;

    return (
      <div className={styles.topHead}>
        <div className={styles.headerContainer}>
          <div
            className={classNames(styles.headerLeftArea, {
              [styles.backComplete]: isCompleteRoute,
            })}
          >
            <BackButton history={history} goBack={this.goBack} />
          </div>

          <div className={styles.headerCenterArea}>
            <h2
              className={classNames(styles.pageTitle, {
                [styles.complete]: isCompleteRoute,
              })}
            >
              Schedule your Appointment
            </h2>
          </div>
          <div className={styles.headerRightArea}>
            <Button className={styles.closeButton} onClick={this.props.closeBookingModal}>
              <CloseBookingModalSVG />
            </Button>
          </div>
        </div>
        <Tabs
          tabs={this.props.tabs}
          tabState={this.props.tabState}
          isBooking={isBooking}
          history={history}
          setIsBooking={this.props.setIsBooking}
        />
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
  return bindActionCreators(
    {
      closeBookingModal,
      setIsBooking,
    },
    dispatch,
  );
}

Header.propTypes = {
  closeBookingModal: PropTypes.func.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  isBooking: PropTypes.bool.isRequired,
  setIsBooking: PropTypes.func.isRequired,
  tabs: PropTypes.objectOf(PropTypes.string).isRequired,
  tabState: PropTypes.objectOf(PropTypes.bool).isRequired,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header));
