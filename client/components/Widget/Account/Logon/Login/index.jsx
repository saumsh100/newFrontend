
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import { parse, stringify } from 'query-string';
import { Link, Form, Field, Button } from '../../../../library';
import { login } from '../../../../../thunks/patientAuth';
import { updateReview } from '../../../../../thunks/reviews';
import { locationShape } from '../../../../library/PropTypeShapes/routerShapes';
import { inputTheme } from '../../../theme';
import styles from './styles.scss';

function Login(props) {
  /**
   * Dispatch the login action, if the credentials are valid proceed,
   * otherwise throw a SubmissionError with the provided data.
   *
   * @param {object} values
   */
  const handleLogin = values =>
    props.login(values).catch(({ data }) => {
      throw new SubmissionError({
        email: data,
        password: data,
      });
    });

  const b = path =>
    props.location.pathname
      .split('/')
      .filter((v, index) => index < 4)
      .concat(path)
      .join('/');

  const parsedSearch = parse(props.location.search);

  const signUpLink = `account?${stringify({
    ...parsedSearch,
    signUp: true,
  })}`;

  const resetLink = `account?${stringify({
    ...parsedSearch,
    reset: true,
  })}`;

  return (
    <div className={styles.scrollableContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Sign in to your account</h1>
          <p className={styles.description}>
            <Link className={styles.subCardLink} to={b(signUpLink)}>
              Sign Up
            </Link>{' '}
            or{' '}
            <Link to={b(resetLink)}>
              <span className={styles.subCardLink}>Forgot Password?</span>
            </Link>
          </p>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <div className={styles.signInBottom}>
            <Form form="login" onSubmit={handleLogin} ignoreSaveButton>
              <Field type="email" name="email" label="Email" required theme={inputTheme(styles)} />
              <Field
                theme={inputTheme(styles)}
                type="password"
                name="password"
                label="Password"
                required
                classStyles={styles.group}
              />
              <Button type="submit" className={styles.actionButton}>
                Sign In
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      login,
      updateReview,
    },
    dispatch,
  );
}
function mapStateToProps({ auth }) {
  return {
    patientUser: auth.get('patientUser'),
    isAuthenticated: auth.get('isAuthenticated'),
  };
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Login),
);
