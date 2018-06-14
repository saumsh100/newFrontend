
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
import PatientUser from '../../../entities/models/PatientUser';
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
      isAuth, patientUser, hasWaitList, history, isBooking, toggleIsBooking,
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
            <svg xmlns="http://www.w3.org/2000/svg">
              <path d="M6.44 7.146L.796 1.504A.51.51 0 0 1 .782.782a.51.51 0 0 1 .722.015L7.146 6.44 12.79.797a.51.51 0 0 1 .721-.015.51.51 0 0 1-.014.722L7.854 7.146l5.642 5.643a.51.51 0 0 1 .014.721.51.51 0 0 1-.721-.014L7.146 7.854l-5.642 5.642a.51.51 0 0 1-.722.014.51.51 0 0 1 .015-.721L6.44 7.146z" />
            </svg>
          </Button>
        </div>
        <Tabs isBooking={isBooking} history={history} setIsBooking={toggleIsBooking} />
      </div>
    );
  }
}

function mapStateToProps({ auth, availabilities }) {
  return {
    patientUser: auth.get('patientUser'),
    isAuth: auth.get('isAuthenticated'),
    hasWaitList: availabilities.get('hasWaitList'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      closeBookingModal,
      toggleIsBooking: setIsBooking,
    },
    dispatch,
  );
}

Header.propTypes = {
  hasWaitList: PropTypes.bool.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  isAuth: PropTypes.bool.isRequired,
  isBooking: PropTypes.bool.isRequired,
  patientUser: PropTypes.instanceOf(PatientUser).isRequired,
  toggleIsBooking: PropTypes.func.isRequired,
  closeBookingModal: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
