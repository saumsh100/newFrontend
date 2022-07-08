import PropTypes from 'prop-types';
import React from 'react';
import { Button, Form, Field, LoginInput } from '../library';
import styles from './reskin-styles.scss';

export default function Login({ onSubmit, className, onForgotPassword }) {
  return (
    <Form form="login" onSubmit={onSubmit} ignoreSaveButton className={className}>
      <Field
        name="email"
        component={(props) => (
          <LoginInput
            label="Email Address"
            type="input"
            name="email"
            placeholder="Email Address"
            className={styles.input}
            ariaLabel="Email Address Input"
            value={props.input.value}
            submitFailed={props.meta.submitFailed}
            onChange={(target) => {
              props.input.onChange(target.target.value);
            }}
          />
        )}
        required
      />
      <Field
        name="password"
        component={(props) => (
          <>
            <LoginInput
              label="Password"
              type="password"
              name="password"
              placeholder="Password"
              className={styles.input}
              ariaLabel="Password Input"
              value={props.input.value}
              submitFailed={props.meta.submitFailed}
              onChange={(target) => {
                props.input.onChange(target.target.value);
              }}
            />
            {props.meta.submitFailed && (
              <p className={styles.errorMessage}>Please enter a valid email address or password</p>
            )}
          </>
        )}
        required
      />
      <div className={styles.buttonContainer}>
        <Button type="button" onClick={onForgotPassword} border="blue" className={styles.button}>
          Forgot Password
        </Button>
        <Button type="submit" className={styles.button}>
          Sign In
        </Button>
      </div>
    </Form>
  );
}

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onForgotPassword: PropTypes.func.isRequired,
  className: PropTypes.string,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool,
  }).isRequired,
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
};

Login.defaultProps = {
  className: '',
};
