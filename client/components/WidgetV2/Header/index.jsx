
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Tabs from './Tabs';
import Title from './Title';
import BackButton from './BackButton';
import Button from '../../library/Button';
import PatientUserMenu from './PatientUserMenu';
import { setIsBooking } from '../../../actions/availabilities';
import { closeBookingModal } from '../../../thunks/availabilities';
import { historyShape } from '../../library/PropTypeShapes/routerShapes';
import patientUserShape from '../../library/PropTypeShapes/patientUserShape';
import { closeBookingModalSVG } from '../SVGs';
import styles from './styles.scss';

class Header extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }

  goBack(path) {
    return () => this.props.history.push(path);
  }

  render() {
    const {
      hasWaitList, history, isAuth, isBooking, patientUser,
    } = this.props;

    return (
      <div className={styles.headerContainer}>
        <div className={styles.headerLeftArea}>
          <BackButton history={history} goBack={this.goBack} />
        </div>
        <div className={styles.headerCenterArea}>
          <Title history={history} hasWaitList={hasWaitList} />
        </div>
        <div className={styles.headerRightArea}>
          {isAuth && <PatientUserMenu user={patientUser} />}
          <Button className={styles.closeButton} onClick={this.props.closeBookingModal}>
            {closeBookingModalSVG}
          </Button>
        </div>
        <Tabs isBooking={isBooking} history={history} setIsBooking={this.props.setIsBooking} />
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
Header.defaultProps = {
  patientUser: false,
};
Header.propTypes = {
  closeBookingModal: PropTypes.func.isRequired,
  hasWaitList: PropTypes.bool.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  isAuth: PropTypes.bool.isRequired,
  isBooking: PropTypes.bool.isRequired,
  patientUser: PropTypes.oneOfType([PropTypes.shape(patientUserShape), PropTypes.bool]),
  setIsBooking: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
