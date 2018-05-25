
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Link } from '../../../../library';
import styles from './styles.scss';

function RemoveDates({ isAuth }) {
  /**
   * Check if the user is logged, if it's send him to the personal-information route,
   * otherwise send him to the login
   */
  const linkTo = isAuth ? '../personal-information' : '../../login';
  return (
    <Modal active className={styles.customDialog}>
      <h3 className={styles.title}>Do you need to remove a specific date from your waitlist?</h3>
      <div className={styles.buttonsWrapper}>
        <Link to={'./days-unavailable'} className={styles.confirmation}>
          Yes
        </Link>
        <Link to={linkTo} className={styles.negation}>
          No
        </Link>
      </div>
    </Modal>
  );
}

function mapStateToProps({ auth }) {
  return {
    isAuth: auth.get('isAuthenticated'),
  };
}
export default connect(mapStateToProps, null)(RemoveDates);

RemoveDates.propTypes = {
  isAuth: PropTypes.bool.isRequired,
};
