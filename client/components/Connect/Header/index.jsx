
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../../../thunks/auth';
import { IconButton } from '../../library';
import styles from './styles.scss';

function Header(props) {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.pullRight}>
        <IconButton
          icon="sign-out"
          onClick={props.logout}
        />
      </div>
    </div>
  );
}

Header.propTypes = {};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    logout,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(Header);
