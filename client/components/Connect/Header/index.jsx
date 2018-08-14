
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { logout } from '../../../thunks/auth';
import { IconButton, VButton, Button } from '../../library';
import styles from './styles.scss';

function Header(props) {
  const logoutButton = () => (
    <Button
      className={styles.button}
      icon="angle-left"
      onClick={() => {
        props
          .logout()
          .then(() => window.JavaParent && window.JavaParent.onLogoutSuccess());
      }}
      title="Sign Out"
    />
  );

  const settingsButton = () => (
    <Button
      className={styles.button}
      icon="angle-left"
      onClick={() => props.history.push('./settings')}
      title="Settings"
    />
  );

  return (
    <div className={styles.headerWrapper}>
      <Switch>
        <Route exact path="/panel" component={settingsButton} />
        <Route exact path="/settings" component={logoutButton} />
      </Switch>
    </div>
  );
}

Header.propTypes = {};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout,
    },
    dispatch,
  );
}

// need with Router so that it re-renders on changing routes
export default withRouter(connect(
  null,
  mapDispatchToProps,
)(Header));
