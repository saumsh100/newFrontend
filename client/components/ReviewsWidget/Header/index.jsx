
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeBookingModal } from '../../../thunks/availabilities';
import { IconButton } from '../../library';
import styles from './styles.scss';

function Header(props) {
  return (
    <div className={styles.headerContainer}>
      <IconButton
        icon="close"
        onClick={props.closeBookingModal}
      />
    </div>
  );
}

Header.propTypes = {};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    closeBookingModal,
  }, dispatch);
}

export default Header;
