
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Link } from '../../../../library';
import styles from './styles.scss';

function Join({ isAuth }) {
  /**
   * Check if the user is logged, if it's send him to the personal-information route,
   * otherwise send him to the login
   */
  const linkTo = isAuth ? '../personal-information' : '../../login';
  return (
    <Modal active className={styles.customDialog}>
      <h3 className={styles.title}>
        Want to be notified if an earlier appointment becomes available?
      </h3>
      <div className={styles.buttonsWrapper}>
        <Link to={'./select-dates'} className={styles.confirmation}>
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
export default connect(mapStateToProps, null)(Join);

Join.propTypes = {
  isAuth: PropTypes.bool.isRequired,
};
