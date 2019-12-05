
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import DocumentTitle from 'react-document-title';
import { SubmissionError } from 'redux-form';
import { Card, Button } from '../../library';
import { locationShape } from '../../library/PropTypeShapes/routerShapes';
import { login } from '../../../thunks/hubAuth';
import { setLocale } from '../../../reducers/electron';
import { electron } from '../../../util/ipc';
import LoginForm from '../LoginForm';
import CopyrightFooter from '../CopyrightFooter';
import RegionSelector from '../../RegionSelector';
import { APP_VERSION_REQUEST, APP_VERSION_RESPONSE, SET_REGION } from '../../../constants';
import styles from './styles.scss';

const regionData = {
  'en-CA': {
    label: 'Canada',
    value: 'en-CA',
  },
  'en-US': {
    label: 'USA',
    value: 'en-US',
  },
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { appVersion: '' };

    this.handleLogin = this.handleLogin.bind(this);
    this.selectRegion = this.selectRegion.bind(this);
  }

  componentDidMount() {
    electron.send(APP_VERSION_REQUEST);
    electron.on(APP_VERSION_RESPONSE, (event, arg) => {
      this.setState({ appVersion: arg });
    });
  }

  handleLogin(values) {
    const { location: { state } } = this.props;
    return this.props
      .login({
        values,
        redirectedFrom: state && state.from,
      })
      .catch((err) => {
        const { data } = err;
        throw new SubmissionError({
          email: data,
          password: data,
        });
      });
  }

  selectRegion(region) {
    electron.send(SET_REGION, region);
    this.props.setLocale(region);
  }

  render() {
    const { locale } = this.props;
    const activeRegion = regionData[locale];

    return (
      <DocumentTitle title="CareCru | Login">
        <div className={styles.backDrop}>
          <Card className={styles.loginForm}>
            <div className={styles.logoContainer}>
              <img className={styles.loginLogo} src="/images/logo_black.png" alt="CareCru Logo" />
            </div>
            <h1 className={styles.formTitle}>LOG IN</h1>
            <LoginForm onSubmit={this.handleLogin} className={styles.formWrapper} />
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
              <RegionSelector
                options={Object.values(regionData)}
                selectRegion={this.selectRegion}
                currentRegion={activeRegion}
              />
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
  setLocale: PropTypes.func.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  locale: PropTypes.string.isRequired,
};

function bindStateToProps({ electron: eReducer }) {
  return { locale: eReducer.get('locale') };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      login,
      push,
      setLocale,
    },
    dispatch,
  );
}

const enhance = connect(
  bindStateToProps,
  mapActionsToProps,
);

export default enhance(Login);
