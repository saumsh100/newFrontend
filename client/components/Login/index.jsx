import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import DocumentTitle from 'react-document-title';
import { SubmissionError } from 'redux-form';
import { Card } from '../library';
import { login } from '../../thunks/auth';
import LoginForm from './LoginForm';
import CopyrightFooter from './CopyrightFooter';
import { locationShape } from '../library/PropTypeShapes/routerShapes';
import EnabledFeature from '../library/EnabledFeature';
import styles from './reskin-styles.scss';

const switchLocations = {
  'carecru.ca': {
    flag: '🇨🇦',
    citizenship: 'Canadian',
    website: 'carecru.ca',
  },
  'carecru.io': {
    flag: '🇺🇸',
    citizenship: 'American',
    website: 'carecru.io',
  },
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(values) {
    const {
      location: { state },
    } = this.props;
    return this.props
      .login({
        values,
        redirectedFrom: state && state.from,
      })
      .catch(({ response }) => {
        throw new SubmissionError({
          email: response.data,
          password: response.data,
        });
      });
  }

  onForgotPassword = () => {
    this.props.push('/forgot');
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { [window.location.hostname]: _, ...option } = switchLocations;
    const [differentLocation] = Object.values(option);
    return (
      <DocumentTitle title="CareCru | Login">
        <div className={styles.backDrop}>
          <img
            src="/images/carecru-logo-negative.svg"
            alt="carecru logo"
            className={styles.logoImage}
          />
          <EnabledFeature
            predicate={({ flags }) => flags.get('datacenter-switcher') && this.props.hasError}
            render={() => (
              <Card className={styles.location}>
                <a href={`https://${differentLocation.website}`}>
                  <span className={styles.flag}>{differentLocation.flag}</span>
                  {differentLocation.citizenship} customer? Click here to access{' '}
                  <span className={styles.underline}>{differentLocation.website}</span>
                </a>
              </Card>
            )}
          />
          <Card className={styles.loginForm}>
            <h1 className={styles.title}>Sign In</h1>
            <LoginForm onSubmit={this.handleLogin} onForgotPassword={this.onForgotPassword} />
          </Card>
          <EnabledFeature
            predicate={({ flags }) => flags.get('show-maintenance-banner')}
            render={() => (
              <div className={styles.maintenanceBanner}>
                <div className={styles.logoContainer}>
                  <img
                    className={styles.maintenanceBanner_logo}
                    src="/images/logo_black.png"
                    alt="CareCru Logo"
                  />
                </div>
                <div className={styles.maintenanceBanner_text}>
                  CareCru is currently down for scheduled maintenance.
                </div>
                <div className={styles.maintenanceBanner_subText}>
                  We are making important upgrades to our platform. CareCru will be back online
                  again soon.
                </div>
              </div>
            )}
          />
          <CopyrightFooter />
        </div>
      </DocumentTitle>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  hasError: PropTypes.bool,
};

Login.defaultProps = {
  hasError: false,
};

function mapStateToProps({ form }) {
  return { hasError: form.login && !!form.login.submitFailed };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      login,
      push,
    },
    dispatch,
  );
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(Login);
