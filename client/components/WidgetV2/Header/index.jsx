
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
            <svg xmlns="http://www.w3.org/2000/svg">
              <path d="M6.44 7.146L.796 1.504A.51.51 0 0 1 .782.782a.51.51 0 0 1 .722.015L7.146 6.44 12.79.797a.51.51 0 0 1 .721-.015.51.51 0 0 1-.014.722L7.854 7.146l5.642 5.643a.51.51 0 0 1 .014.721.51.51 0 0 1-.721-.014L7.146 7.854l-5.642 5.642a.51.51 0 0 1-.722.014.51.51 0 0 1 .015-.721L6.44 7.146z" />
            </svg>
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
