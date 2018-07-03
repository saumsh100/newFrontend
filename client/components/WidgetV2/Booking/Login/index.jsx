
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import { Link, Form, Field, Button } from '../../../library';
import { login } from '../../../../thunks/patientAuth';
import { updateReview } from '../../../../thunks/reviews';
import styles from './styles.scss';

function Login(props) {
  /**
   * Dispatch the login action, if the credentials are valid proceed,
   * otherwise throw a SubmissionError with the provided data.
   *
   * @param {object} values
   */
  const handleLogin = values =>
    props
      .login(values)
      .then(() => {
        this.props.history.push('./book/patient-information');
      })
      .catch(({ data }) => {
        throw new SubmissionError({
          email: data,
          password: data,
        });
      });

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <Link to="./signup" className={styles.subCard}>
          <div className={styles.subCardWrapper}>
            <h3 className={styles.subCardTitle}>Don’t have an account?</h3>
            <p className={styles.subCardSubtitle}>Create an account to confirm your request.</p>
          </div>
          <span className={styles.subCardLink}>Sign Up</span>
        </Link>
        <div className={styles.content}>
          <div className={styles.signInTop}>
            <h3 className={styles.title}>Login</h3>
            <Link to="./reset">
              <span className={styles.subCardLink}>Forgot Password?</span>
            </Link>
          </div>
          <Form form="login" onSubmit={handleLogin} ignoreSaveButton>
            <Field
              type="email"
              name="email"
              label="Email"
              required
              theme={{
                erroredLabelFilled: styles.erroredLabelFilled,
                input: styles.input,
                filled: styles.filled,
                label: styles.label,
                group: styles.group,
                error: styles.error,
                erroredInput: styles.erroredInput,
                bar: styles.bar,
                erroredLabel: styles.erroredLabel,
              }}
            />
            <Field
              theme={{
                erroredLabelFilled: styles.erroredLabelFilled,
                input: styles.input,
                filled: styles.filled,
                label: styles.label,
                group: styles.group,
                error: styles.error,
                erroredInput: styles.erroredInput,
                bar: styles.bar,
                erroredLabel: styles.erroredLabel,
              }}
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

Login.propTypes = {
  login: PropTypes.func,
};

export default withRouter(connect(null, mapDispatchToProps)(Login));
