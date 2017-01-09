
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from '../library';
import login from '../../thunks/auth';
import LoginForm from './LoginForm';
import styles from './styles.scss';

class Login extends Component {
  render() {
    return (
      <div className={styles.backDrop}>
        <Card className={styles.loginForm}>
          <div className={styles.logoContainer}>
            <img
              className={styles.loginLogo}
              src="/images/logo_black.png"
              alt="CareCru Logo"
            />
          </div>
          <LoginForm onSubmit={this.props.login} />
        </Card>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
};


function mapActionsToProps(dispatch) {
  return bindActionCreators({
    login,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);

export default enhance(Login);
