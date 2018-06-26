
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { SubmissionError } from 'redux-form';
import { Card, Button } from '../../library';
import { locationShape } from '../../library/PropTypeShapes/routerShapes';
import { login } from '../../../thunks/hubAuth';
import { electron } from '../../../util/ipc';
import LoginForm from '../LoginForm';
import CopyrightFooter from '../CopyrightFooter';
import { APP_VERSION_REQUEST, APP_VERSION_RESPONSE } from '../../../constants';
import styles from './styles.scss';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appVersion: '',
    };

    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    electron.send(APP_VERSION_REQUEST);
    electron.on(APP_VERSION_RESPONSE, (event, arg) => {
      this.setState({
        appVersion: arg,
      });
    });
  }

  handleLogin(values) {
    const {
      location: { state },
    } = this.props;
    return this.props
      .login({ values, redirectedFrom: state && state.from })
      .catch((err) => {
        const { data } = err;
        throw new SubmissionError({
          email: data,
          password: data,
        });
      });
  }

  render() {
    return (
      <DocumentTitle title="CareCru | Login">
        <div className={styles.backDrop}>
          <Card className={styles.loginForm}>
            <div className={styles.logoContainer}>
              <img
                className={styles.loginLogo}
                src="/images/logo_black.png"
                alt="CareCru Logo"
              />
            </div>
            <h1 className={styles.formTitle}>LOG IN</h1>
            <LoginForm
              onSubmit={this.handleLogin}
              className={styles.formWrapper}
            />
            <div className={styles.secondaryLink}>
              <Button
                className={styles.secondaryLink_text}
                onClick={() => {
                  this.props.push('/forgot');
                }}
              >
                Forgot your password?
              </Button>
            </div>
            <div className={styles.footer}>
              <CopyrightFooter />
            </div>
          </Card>
          <p className={styles.versionFooter}>v{this.state.appVersion}</p>
        </div>
      </DocumentTitle>
    );
  }
}
Login.propTypes = {
  login: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  location: PropTypes.shape(locationShape),
};

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      login,
      push,
    },
    dispatch,
  );
}

const enhance = connect(
  null,
  mapActionsToProps,
);

export default enhance(Login);
